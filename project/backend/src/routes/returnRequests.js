const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// POST /api/return-requests
// Enforces the business rule: proof is required, and the order must already
// be delivered (general "changed my mind" returns are not accepted).
router.post('/', async (req, res, next) => {
  try {
    const { orderId, orderItemId, description, proofUrls } = req.body;

    if (!orderId || !orderItemId || !description) {
      return res.status(400).json({ error: 'orderId, orderItemId and description are required.' });
    }
    if (!Array.isArray(proofUrls) || proofUrls.length === 0) {
      return res.status(400).json({ error: 'At least one photo (or unboxing video link) is required as proof.' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.status !== 'delivered') {
      return res.status(400).json({
        error: 'Return/defect requests can only be submitted after an order is delivered, and only for genuine defects or damage.',
      });
    }

    const request = await prisma.returnRequest.create({
      data: {
        orderId, orderItemId, description,
        proofUrlsJson: JSON.stringify(proofUrls),
        status: 'submitted',
      },
    });

    res.status(201).json(request);
  } catch (e) { next(e); }
});

module.exports = router;
