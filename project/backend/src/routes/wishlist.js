const express = require('express');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(items.map((i) => i.product));
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.body;
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: {},
      create: { userId: req.user.id, productId },
    });
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/:productId', requireAuth, async (req, res, next) => {
  try {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
