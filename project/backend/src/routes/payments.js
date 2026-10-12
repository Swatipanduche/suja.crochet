const express = require('express');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { razorpay, isMockMode } = require('../lib/razorpay');
const router = express.Router();

// 1. Create a payment order once the customer reaches the payment step.
// Security: Re-fetches the order from the database to get the exact amount
// to prevent client-side price tampering.
router.post('/create-order', async (req, res, next) => {
  try {
    const { localOrderId } = req.body;
    if (!localOrderId) {
      return res.status(400).json({ error: 'localOrderId is required' });
    }

    // Verify order in database
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: localOrderId }, { orderNumber: localOrderId }] },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found for payment creation' });
    }

    const amountInRupees = order.total;
    const amountInPaise = amountInRupees * 100;

    if (isMockMode()) {
      return res.json({
        razorpayOrderId: 'mock_order_' + order.orderNumber,
        amount: amountInPaise,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        mock: true,
      });
    }

    // Real Razorpay order creation — requires RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
      },
    });

    // Link razorpayOrderId to the payment record
    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      mock: false,
    });
  } catch (e) {
    next(e);
  }
});

// 2. Verify the payment signature server-side (HMAC-SHA256)
// Handles idempotency and updates database records.
router.post('/verify', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body;

    if (!localOrderId) {
      return res.status(400).json({ error: 'localOrderId is required' });
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ id: localOrderId }, { orderNumber: localOrderId }] },
      include: { payments: true, items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const payment = order.payments[0];

    // Idempotency: If already marked as paid, return success immediately
    if (payment && payment.status === 'paid') {
      return res.json({ verified: true, alreadyProcessed: true, orderNumber: order.orderNumber });
    }

    let verified = false;

    if (isMockMode()) {
      verified = true; // safe simulated payment in development
    } else {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment signature parameters' });
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      verified = expectedSignature === razorpay_signature;
    }

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: verified ? 'paid' : 'failed',
          razorpayOrderId: razorpay_order_id || payment.razorpayOrderId,
          razorpayPaymentId: razorpay_payment_id || null,
          razorpaySignature: razorpay_signature || null,
        },
      });
    }

    if (verified) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'order_placed' },
      });

      // Deduct product stock safely
      for (const item of order.items) {
        if (item.productId) {
          try {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          } catch (err) {
            // non-blocking if stock column update is soft
          }
        }
      }
    }

    res.json({ verified, orderNumber: order.orderNumber });
  } catch (e) {
    next(e);
  }
});

// 3. Webhook — Razorpay webhook event processor
router.post('/webhook', async (req, res) => {
  try {
    if (isMockMode()) return res.json({ received: true, mock: true });

    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    const expected = crypto
      .createHmac('sha256', secret)
      .update(req.body) // raw Buffer
      .digest('hex');

    if (signature !== expected) {
      return res.status(400).send('Invalid webhook signature');
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: { razorpayOrderId },
        });

        if (paymentRecord && paymentRecord.status !== 'paid') {
          await prisma.payment.update({
            where: { id: paymentRecord.id },
            data: {
              status: 'paid',
              razorpayPaymentId: razorpayPaymentId,
            },
          });
          await prisma.order.update({
            where: { id: paymentRecord.orderId },
            data: { status: 'order_placed' },
          });
        }
      }
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
