const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/products?category=hair&sort=low&maxPrice=1000&search=clip
router.get('/', async (req, res, next) => {
  try {
    const { category, sort, maxPrice, search } = req.query;
    const where = { isActive: true };
    if (category) where.categoryId = category;
    if (maxPrice) where.price = { lte: Number(maxPrice) };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'low') orderBy = { price: 'asc' };
    if (sort === 'high') orderBy = { price: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: true,
        reviews: { where: { status: 'approved' } },
      },
    });
    
    let formatted = products.map(formatProduct);
    const { minRating } = req.query;
    if (minRating) {
      formatted = formatted.filter((p) => p.rating >= Number(minRating));
    }

    res.json(formatted);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true, reviews: { where: { status: 'approved' } } },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(product));
  } catch (e) { next(e); }
});

function formatProduct(p) {
  const approvedReviews = p.reviews || [];
  const reviewsCount = approvedReviews.length;
  const rating = reviewsCount > 0
    ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
    : 4.8;

  return {
    id: p.id,
    name: p.name,
    cat: p.categoryId,
    price: p.price,
    mrp: p.mrp,
    emoji: p.emoji,
    isBestseller: p.isBestseller,
    isNewArrival: p.isNewArrival,
    description: p.description,
    materials: p.materials,
    sizeInfo: p.sizeInfo,
    colors: JSON.parse(p.colorsJson || '[]'),
    images: (p.images || []).map((i) => i.url),
    stock: p.stock !== undefined ? p.stock : 20,
    rating,
    reviewsCount,
  };
}

module.exports = router;
