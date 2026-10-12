# suja.crochet — Backend & Payment Architecture

This document is the blueprint for the real backend behind the storefront prototype. It's written so you (or any Node/Next.js developer) can build against it directly. Nothing here needs to run today — it's the spec for when you're ready to stand up a server and database.

**Recommended stack:** Node.js + Express (or Next.js API routes) + PostgreSQL (or MySQL) + Prisma/Sequelize ORM. Anything else (Django, Rails, etc.) can follow the same schema and flow.

---

## 1. Environment variables

Create a `.env` file on the server (never commit it, never send secrets to the browser):

```env
# Razorpay — get these from https://dashboard.razorpay.com/app/keys
# Leave the test placeholders until you have a real account.
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=your_secret_here          # SERVER-SIDE ONLY. Never send to frontend.
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret   # for verifying webhook calls

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suja_crochet

# Auth
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# File uploads (product photos, custom-order references, defect proof)
UPLOAD_PROVIDER=s3           # or "local" for dev
S3_BUCKET=suja-crochet-uploads
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=ap-south-1
```

Only `RAZORPAY_KEY_ID` is ever exposed to the frontend (it's public by design, used to open the Razorpay Checkout widget). `RAZORPAY_KEY_SECRET` must only ever live on the server.

---

## 2. Database schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash TEXT,              -- null if using OTP/social login only
  role VARCHAR(20) DEFAULT 'customer', -- 'customer' | 'admin'
  created_at TIMESTAMP DEFAULT now()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(120),
  phone VARCHAR(20),
  line1 TEXT, city VARCHAR(80), state VARCHAR(80), pincode VARCHAR(10),
  is_default BOOLEAN DEFAULT false
);

-- Categories
CREATE TABLE categories (
  id VARCHAR(40) PRIMARY KEY,        -- 'gift' | 'hair' | 'bouquets' | 'decor' | 'custom'
  name VARCHAR(80) NOT NULL,
  description TEXT,
  emoji VARCHAR(10)
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  category_id VARCHAR(40) REFERENCES categories(id),
  description TEXT,
  materials TEXT,
  size_info TEXT,
  price INTEGER NOT NULL,            -- store in paise/smallest unit if you prefer exactness
  mrp INTEGER,                       -- original price if discounted; null otherwise
  colors JSONB,                      -- ["#B0693F", "#E7B7AC"]
  stock INTEGER DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Product images (ordered, multiple per product)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,   -- e.g. SUJA482913, shown to customer
  user_id UUID REFERENCES users(id),
  address_id UUID REFERENCES addresses(id),
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  status VARCHAR(30) DEFAULT 'order_placed',
  -- 'order_placed' | 'handmade_preparation' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
  estimated_delivery_date DATE,
  tracking_number VARCHAR(60),
  created_at TIMESTAMP DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  selected_color VARCHAR(20),
  custom_note TEXT
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  provider VARCHAR(20) DEFAULT 'razorpay',   -- or 'cod'
  razorpay_order_id VARCHAR(60),
  razorpay_payment_id VARCHAR(60),
  razorpay_signature VARCHAR(140),
  amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',      -- 'pending' | 'paid' | 'failed' | 'refunded'
  created_at TIMESTAMP DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),   -- only allow reviews tied to a completed order
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'approved' | 'hidden'
  created_at TIMESTAMP DEFAULT now()
);

-- Wishlist
CREATE TABLE wishlist_items (
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- Custom orders
CREATE TABLE custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NULL,
  name VARCHAR(120), email VARCHAR(160), phone VARCHAR(20),
  product_type VARCHAR(80), preferred_color VARCHAR(80), size VARCHAR(60),
  quantity INTEGER DEFAULT 1, occasion VARCHAR(100), budget VARCHAR(60),
  requirements TEXT, reference_image_url TEXT, preferred_delivery_date DATE,
  status VARCHAR(20) DEFAULT 'new',
  -- 'new' | 'reviewing' | 'accepted' | 'in_progress' | 'completed' | 'rejected'
  created_at TIMESTAMP DEFAULT now()
);

-- Return / defect requests
CREATE TABLE return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  description TEXT NOT NULL,
  proof_urls JSONB,               -- photos / unboxing video links
  status VARCHAR(20) DEFAULT 'submitted',
  -- 'submitted' | 'approved' | 'rejected' | 'more_info_needed' | 'resolved'
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Coupons (optional)
CREATE TABLE coupons (
  code VARCHAR(30) PRIMARY KEY,
  discount_type VARCHAR(10),      -- 'flat' | 'percent'
  discount_value INTEGER,
  min_order_value INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP
);
```

---

## 3. Razorpay integration flow

```
Frontend (Checkout)
   │
   ├─► POST /api/payments/create-order  (amount, cart)
   │
   ▼
Backend
   ├─ Creates a local `orders` row (status: order_placed, unpaid)
   ├─ Calls Razorpay Orders API to create a razorpay_order_id
   ├─ Returns { razorpay_order_id, amount, key_id } to frontend
   │
   ▼
Frontend
   ├─ Opens Razorpay Checkout widget with razorpay_order_id + key_id
   ├─ Customer pays
   ├─ Razorpay returns { razorpay_payment_id, razorpay_order_id, razorpay_signature }
   │
   ├─► POST /api/payments/verify  (all three values above)
   │
   ▼
Backend
   ├─ Recomputes HMAC-SHA256 signature using RAZORPAY_KEY_SECRET
   ├─ Compares to the signature Razorpay sent
   ├─ If it matches → mark payment 'paid', order 'order_placed', send confirmation email
   └─ If it doesn't match → reject, mark payment 'failed'
```

### Backend code (Express)

```js
// routes/payments.js
const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const router = express.Router();

// Credentials load from environment variables — set these in your .env file.
// RAZORPAY_KEY_ID is safe to expose to the frontend; RAZORPAY_KEY_SECRET is not.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create a Razorpay order once the customer reaches payment
router.post('/create-order', async (req, res) => {
  const { amountInRupees, localOrderId } = req.body;
  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInRupees * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: localOrderId,
    });
    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID, // public key only
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not create payment order' });
  }
});

// 2. Verify the payment signature after the customer pays
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    // Mark payment failed in DB here
    return res.status(400).json({ verified: false });
  }

  // Signature matches — mark payment 'paid' and order confirmed in DB here
  res.json({ verified: true });
});

// 3. Webhook — Razorpay calls this directly (covers cases where the browser
// closes before step 2 fires). Verify with RAZORPAY_WEBHOOK_SECRET.
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');
  if (signature !== expected) return res.status(400).send('Invalid signature');

  const event = JSON.parse(req.body);
  // Handle event.event === 'payment.captured', 'payment.failed', etc.
  res.json({ received: true });
});

module.exports = router;
```

### Frontend call (opens Razorpay Checkout)

```js
async function payWithRazorpay(amountInRupees, localOrderId, customer) {
  const { razorpayOrderId, amount, keyId } = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountInRupees, localOrderId }),
  }).then(r => r.json());

  const rzp = new window.Razorpay({
    key: keyId, // RAZORPAY_KEY_ID only — never the secret
    amount,
    currency: 'INR',
    name: 'suja.crochet',
    order_id: razorpayOrderId,
    prefill: { name: customer.name, email: customer.email, contact: customer.mobile },
    theme: { color: '#B0693F' },
    handler: async function (response) {
      const result = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...response, localOrderId }),
      }).then(r => r.json());
      if (result.verified) window.location.href = `/confirmation/${localOrderId}`;
      else alert('Payment could not be verified. Please contact support.');
    },
  });
  rzp.open();
}
```

### Test / mock mode (no Razorpay account yet)

Until real keys exist, gate the flow behind an environment flag so the rest of the site is fully testable:

```js
if (process.env.PAYMENTS_MODE === 'mock') {
  // Skip Razorpay entirely — mark the order paid immediately and redirect
  // to confirmation. This is exactly what the frontend prototype simulates.
} else {
  await payWithRazorpay(total, order.id, customerDetails);
}
```

Set `PAYMENTS_MODE=mock` in development and `PAYMENTS_MODE=live` once `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` are filled in with real values from the Razorpay dashboard.

---

## 4. Core API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/products` | List products (filter by category, price, rating, sort) |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/cart` | Add/update cart item (or keep cart client-side + sync on checkout) |
| POST | `/api/orders` | Create an order (pre-payment) |
| GET | `/api/orders/:id` | Order detail + tracking stage |
| POST | `/api/payments/create-order` | Create Razorpay order (see above) |
| POST | `/api/payments/verify` | Verify signature (see above) |
| POST | `/api/custom-orders` | Submit a custom order request |
| POST | `/api/return-requests` | Submit a defect/return report with proof uploads |
| POST | `/api/reviews` | Submit a review (only for a delivered order) |
| GET/POST | `/api/wishlist` | Manage wishlist |
| **Admin** | `/api/admin/products` | CRUD products |
| **Admin** | `/api/admin/orders` | View/update order status, add tracking |
| **Admin** | `/api/admin/custom-orders` | View + update status |
| **Admin** | `/api/admin/return-requests` | Approve/reject/request info |
| **Admin** | `/api/admin/reviews` | Approve/hide/delete |

Admin routes should sit behind auth middleware checking `role === 'admin'` on the JWT.

---

## 5. Business rules to enforce server-side

These are stated in the brief and should be enforced in code, not just copy on the page:

1. Every order gets `estimated_delivery_date = created_at + 20 to 25 days`.
2. `return_requests` can only be created for an order that is `delivered`, and require at least one `proof_urls` entry before submission is accepted.
3. Reviews can only be submitted against an `order_id` that belongs to the requesting user and is `delivered`.
4. `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` must never appear in any response body, frontend bundle, or client-side log.
5. Order status can only move forward through the defined stages (`order_placed → handmade_preparation → packed → shipped → out_for_delivery → delivered`), enforced in the admin update endpoint.

---

## 6. What's already built vs. what's next

**Already built (in the prototype artifact):** every customer-facing screen and flow — home, shop with filters/sort, product detail with colour/quantity/custom note, cart, three-step checkout with a mock payment step, order confirmation, account with order tracking, wishlist, custom order form, about, categories, and a lightweight admin preview — all wired together with realistic mock data so the flows can be clicked through end to end.

**Next, when you're ready to go live:**
1. Stand up the database from the schema above.
2. Build the API routes and wire the frontend's mock state to real fetch calls.
3. Create a Razorpay account, drop the real `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` into `.env`, and flip `PAYMENTS_MODE` from `mock` to `live`.
4. Replace the emoji placeholders with real product photography (the prototype's `card-photo` / `pd-main-photo` blocks are the only places image URLs need to be swapped in).
5. Add authentication (email/OTP or email+password) for the account and admin areas.
