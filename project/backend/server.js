require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productsRoutes = require('./src/routes/products');
const categoriesRoutes = require('./src/routes/categories');
const ordersRoutes = require('./src/routes/orders');
const paymentsRoutes = require('./src/routes/payments');
const customOrdersRoutes = require('./src/routes/customOrders');
const contactRoutes = require('./src/routes/contact');
const returnRequestsRoutes = require('./src/routes/returnRequests');
const reviewsRoutes = require('./src/routes/reviews');
const wishlistRoutes = require('./src/routes/wishlist');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Razorpay webhooks need the raw body for signature verification, so that
// route registers its own raw-body parser before the global json parser.
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

const { attachUser } = require('./src/middleware/auth');
app.use(attachUser);

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'suja-crochet-backend' }));

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/custom-orders', customOrdersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/return-requests', returnRequestsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`suja.crochet backend running on http://localhost:${PORT}`);
  console.log(`Payments mode: ${process.env.PAYMENTS_MODE || 'mock'}`);
});
