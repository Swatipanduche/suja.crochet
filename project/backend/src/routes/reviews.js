const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/reviews?productId=... — approved reviews for a product
router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.query;
    const reviews = await prisma.review.findMany({
      where: { status: 'approved', ...(productId ? { productId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (e) { next(e); }
});

// POST /api/reviews — only allowed against a delivered order, enforced here
router.post('/', async (req, res, next) => {
  try {
    const { productId, orderId, rating, text } = req.body;
    if (!productId || !orderId || !rating || !text) {
      return res.status(400).json({ error: 'productId, orderId, rating and text are required.' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'delivered') {
      return res.status(400).json({ error: 'Reviews can only be submitted for a delivered order.' });
    }

    const review = await prisma.review.create({
      data: { productId, orderId, rating: Number(rating), text, status: 'pending' },
    });

    res.status(201).json(review);
  } catch (e) { next(e); }
});

module.exports = router;
