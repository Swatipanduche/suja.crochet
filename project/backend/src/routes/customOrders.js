const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// POST /api/custom-orders — the "Made Just for You" form
router.post('/', async (req, res, next) => {
  try {
    const {
      name, email, phone, productType, preferredColor, size, quantity,
      occasion, budget, requirements, referenceImageUrl, preferredDeliveryDate,
    } = req.body;

    if (!name || !email || !phone || !productType) {
      return res.status(400).json({ error: 'Name, email, phone and product type are required.' });
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        name, email, phone, productType,
        preferredColor, size, quantity: Number(quantity) || 1,
        occasion, budget, requirements, referenceImageUrl,
        preferredDeliveryDate: preferredDeliveryDate ? new Date(preferredDeliveryDate) : null,
        status: 'new',
      },
    });

    res.status(201).json(customOrder);
  } catch (e) { next(e); }
});

module.exports = router;
