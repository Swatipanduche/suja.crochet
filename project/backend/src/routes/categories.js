const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (e) { next(e); }
});

module.exports = router;
