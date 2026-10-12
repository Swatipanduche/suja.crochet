const Razorpay = require('razorpay');

// Credentials load from environment variables (see .env / .env.example).
// RAZORPAY_KEY_ID is safe to expose to the frontend (it's a public key used
// to open the Razorpay Checkout widget). RAZORPAY_KEY_SECRET must never be
// sent to the browser or logged — it only ever lives here, on the server.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const isMockMode = () => (process.env.PAYMENTS_MODE || 'mock') === 'mock';

module.exports = { razorpay, isMockMode };
