const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// POST /api/contact — the "Contact Us" page form. Saved to the database so
// nothing gets silently lost; admins review it under Admin → Messages.
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    const saved = await prisma.contactMessage.create({
      data: { name, email, message, status: 'new' },
    });
    res.status(201).json(saved);
  } catch (e) { next(e); }
});

module.exports = router;
