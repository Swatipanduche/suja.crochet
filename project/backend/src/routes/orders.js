const express = require('express');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

function generateOrderNumber() {
  return 'SUJA' + Math.floor(100000 + Math.random() * 900000);
}

// POST /api/orders
// body: { customer:{name,email,phone}, address:{line1,city,state,pincode},
//          items:[{productId, quantity, color, note}], paymentMethod: 'razorpay'|'cod' }
router.post('/', async (req, res, next) => {
  try {
    const { customer, address, items, paymentMethod } = req.body;
    if (!customer?.name || !customer?.phone || !items?.length) {
      return res.status(400).json({ error: 'Missing customer details or cart items.' });
    }
    if (!address?.line1 || !address?.city || !address?.state || !address?.pincode) {
      return res.status(400).json({ error: 'A complete delivery address is required.' });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = items.map((i) => {
      const product = productMap[i.productId];
      if (!product) throw Object.assign(new Error(`Product ${i.productId} not found`), { status: 400 });
      subtotal += product.price * i.quantity;
      return {
        productId: product.id,
        quantity: i.quantity,
        unitPrice: product.price,
        selectedColor: i.color || null,
        customNote: i.note || null,
      };
    });

    const deliveryFee = subtotal > 999 ? 0 : 79;
    const total = subtotal + deliveryFee;

    // Handmade products need real preparation time — every order gets a
    // 20–25 day estimate from the moment it's placed.
    const days = 20 + Math.floor(Math.random() * 6); // 20–25
    const estimatedDeliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    let addressRecord = null;
    if (req.user && address) {
      addressRecord = await prisma.address.create({
        data: { userId: req.user.id, fullName: customer.name, phone: customer.phone, ...address },
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user ? req.user.id : null,
        addressId: addressRecord ? addressRecord.id : null,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingLine1: address?.line1 || null,
        shippingCity: address?.city || null,
        shippingState: address?.state || null,
        shippingPincode: address?.pincode || null,
        subtotal,
        deliveryFee,
        total,
        estimatedDeliveryDate,
        status: 'order_placed',
        items: { create: orderItemsData },
        payments: {
          create: {
            provider: paymentMethod === 'cod' ? 'cod' : 'razorpay',
            amount: total,
            status: paymentMethod === 'cod' ? 'pending' : 'pending',
          },
        },
      },
      include: { items: true, payments: true },
    });

    res.status(201).json(order);
  } catch (e) { next(e); }
});

// GET /api/orders — the signed-in customer's own orders
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, payments: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) { next(e); }
});

// GET /api/orders/:id — by id or order number, used for order confirmation / tracking
router.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: req.params.id }, { orderNumber: req.params.id }] },
      include: { items: { include: { product: true } }, payments: true, address: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (e) { next(e); }
});

module.exports = router;
