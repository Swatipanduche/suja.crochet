const express = require('express');
const prisma = require('../lib/prisma');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Every route below requires a valid admin JWT (role: "admin").
// Sign in as the seeded admin (admin@sujacrochet.com / admin123) via
// POST /api/auth/login, then send the returned token as:
//   Authorization: Bearer <token>
router.use(requireAdmin);

/* ---------- Dashboard ---------- */
router.get('/dashboard', async (req, res, next) => {
  try {
    const [productCount, orderCount, revenue, pendingCustomOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'cancelled' } } }),
      prisma.customOrder.count({ where: { status: 'new' } }),
    ]);
    res.json({
      productCount, orderCount,
      revenue: revenue._sum.total || 0,
      pendingCustomOrders,
    });
  } catch (e) { next(e); }
});

/* ---------- Products (CRUD) ---------- */
router.get('/products', async (req, res, next) => {
  try { res.json(await prisma.product.findMany({ include: { images: true } })); }
  catch (e) { next(e); }
});

router.post('/products', async (req, res, next) => {
  try { res.status(201).json(await prisma.product.create({ data: req.body })); }
  catch (e) { next(e); }
});

router.put('/products/:id', async (req, res, next) => {
  try { res.json(await prisma.product.update({ where: { id: req.params.id }, data: req.body })); }
  catch (e) { next(e); }
});

router.delete('/products/:id', async (req, res, next) => {
  try { await prisma.product.delete({ where: { id: req.params.id } }); res.json({ ok: true }); }
  catch (e) { next(e); }
});

/* ---------- Orders ---------- */
router.get('/orders', async (req, res, next) => {
  try {
    res.json(await prisma.order.findMany({
      include: { items: { include: { product: true } }, payments: true },
      orderBy: { createdAt: 'desc' },
    }));
  } catch (e) { next(e); }
});

// PATCH /api/admin/orders/:id  { status, trackingNumber }
// status must move forward through the defined stages.
const STAGES = ['order_placed', 'handmade_preparation', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
router.patch('/orders/:id', async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    if (status && !STAGES.includes(status) && status !== 'cancelled') {
      return res.status(400).json({ error: `Status must be one of: ${STAGES.join(', ')}, cancelled` });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { ...(status ? { status } : {}), ...(trackingNumber ? { trackingNumber } : {}) },
    });
    res.json(order);
  } catch (e) { next(e); }
});

/* ---------- Custom orders ---------- */
router.get('/custom-orders', async (req, res, next) => {
  try { res.json(await prisma.customOrder.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (e) { next(e); }
});

router.patch('/custom-orders/:id', async (req, res, next) => {
  try {
    const { status } = req.body; // new | reviewing | accepted | in_progress | completed | rejected
    res.json(await prisma.customOrder.update({ where: { id: req.params.id }, data: { status } }));
  } catch (e) { next(e); }
});

/* ---------- Contact messages ---------- */
router.get('/contact-messages', async (req, res, next) => {
  try { res.json(await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (e) { next(e); }
});

router.patch('/contact-messages/:id', async (req, res, next) => {
  try {
    const { status } = req.body; // new | read | replied
    res.json(await prisma.contactMessage.update({ where: { id: req.params.id }, data: { status } }));
  } catch (e) { next(e); }
});

/* ---------- Return / defect requests ---------- */
router.get('/return-requests', async (req, res, next) => {
  try {
    res.json(await prisma.returnRequest.findMany({
      include: { order: true, orderItem: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }));
  } catch (e) { next(e); }
});

router.patch('/return-requests/:id', async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body; // approved | rejected | more_info_needed | resolved
    res.json(await prisma.returnRequest.update({ where: { id: req.params.id }, data: { status, adminNotes } }));
  } catch (e) { next(e); }
});

/* ---------- Reviews ---------- */
router.get('/reviews', async (req, res, next) => {
  try { res.json(await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (e) { next(e); }
});

router.patch('/reviews/:id', async (req, res, next) => {
  try {
    const { status } = req.body; // approved | hidden
    res.json(await prisma.review.update({ where: { id: req.params.id }, data: { status } }));
  } catch (e) { next(e); }
});

router.delete('/reviews/:id', async (req, res, next) => {
  try { await prisma.review.delete({ where: { id: req.params.id } }); res.json({ ok: true }); }
  catch (e) { next(e); }
});

module.exports = router;
