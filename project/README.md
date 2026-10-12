# suja.crochet — Handmade Crochet E-Commerce

A complete storefront for a handmade crochet brand: browsing, cart, checkout with a Razorpay-ready payment flow, order tracking, custom orders, wishlist, reviews, and an admin dashboard.

```
suja-crochet/
├── frontend/     Storefront — vanilla HTML/CSS/JS served by Vite, includes the admin panel
├── backend/      Express API + Prisma (SQLite by default) + Razorpay integration
├── README.md     You are here
└── package.json  Optional root scripts to run both apps together
```

The frontend runs on its own with realistic built-in demo data, so you can open it immediately. When the backend is also running, the frontend automatically pulls live product data from the database and routes checkout through the real payment API — see **"How the two connect"** below.

---

## 1. Requirements

- Node.js 18 or later ([nodejs.org](https://nodejs.org))
- npm (comes with Node)
- No separate database server needed for local development — the backend uses SQLite, a file-based database that needs no installation.

---

## 2. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs both `frontend/` and `backend/` dependencies. (Equivalent to running `npm install` inside each folder separately.)

If you'd rather use the root convenience scripts (`npm run dev`, etc.), also run:

```bash
npm install
```

at the root, to pull in `concurrently`.

---

## 3. Configure the database

The backend uses [Prisma](https://www.prisma.io/) with SQLite by default — zero setup required.

A working `backend/.env` (safe mock defaults, no real secrets) is already included, so you can skip straight to:

```bash
cd backend
npm run prisma:migrate     # creates dev.db and all tables from prisma/schema.prisma
npm run seed                # populates categories, starter products, and an admin user
```

(If you ever need to start fresh, `backend/.env.example` is the template to copy from.)

The seed script creates:
- 5 categories and 10 starter products (matching the frontend's demo catalogue)
- An admin login: **admin@sujacrochet.com / admin123** (change this before going live)

**Switching to PostgreSQL for production:** open `backend/prisma/schema.prisma`, change:
```prisma
datasource db {
  provider = "sqlite"      // change to "postgresql"
  url      = env("DATABASE_URL")
}
```
and set `DATABASE_URL` in `.env` to your Postgres connection string, e.g.
`postgresql://user:password@localhost:5432/suja_crochet`. Then re-run `npm run prisma:migrate`.

---

## 4. Where to add your Razorpay credentials

Open `backend/.env` (created from `.env.example` in step 3) and fill in:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
PAYMENTS_MODE=live
```

Get these from your [Razorpay Dashboard → API Keys](https://dashboard.razorpay.com/app/keys). Until you have an account, leave `PAYMENTS_MODE=mock` (the default) — checkout will fully work end to end using a simulated, always-successful payment, so you can test everything else first.

`RAZORPAY_KEY_SECRET` is read only in `backend/src/lib/razorpay.js` and `backend/src/routes/payments.js`, on the server. It is never sent to the frontend or logged. Only `RAZORPAY_KEY_ID` (a public key) is returned to the browser, to open the Razorpay Checkout widget.

---

## 5. Run in development mode

**Option A — one command from the root** (after `npm install` at the root):
```bash
npm run dev
```
This starts the frontend (http://localhost:5173) and backend (http://localhost:4000) together.

**Option B — two terminals:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies any `/api/...` request to the backend on port 4000 (see `frontend/vite.config.js`), so the frontend's `fetch('/api/...')` calls work in development without any extra configuration.

If the backend isn't running, the frontend still works fully off its built-in demo data — nothing breaks, it just won't reflect live database changes.

---

## 6. How the two connect

- On load, the frontend tries `GET /api/products`. If the backend responds, live products (with real database IDs) replace the demo data — **the backend must be running and seeded for checkout to work**, since orders reference real product IDs.
- **Checkout now actually creates a real order first:** every checkout calls `POST /api/orders`, which saves the order, its items, and the delivery address to the database. Only *then* does it proceed to payment.
- **Payment is via Razorpay only** (Cash on Delivery has been removed) — the frontend opens the real **Razorpay Checkout widget** (loaded via `checkout.razorpay.com/v1/checkout.js` in `index.html`), and on success calls `POST /api/payments/verify` to confirm the signature and mark the order paid. `backend/.env` currently has real Razorpay **test-mode** keys (`rzp_test_...`) with `PAYMENTS_MODE=live`, so the real widget opens — use Razorpay's test card numbers to complete a payment; no real money moves until you swap in `rzp_live_` keys.
- The **Contact Us** form and **Custom Orders** form both save to the database (`ContactMessage` / `CustomOrder` tables) via `POST /api/contact` and `POST /api/custom-orders` — nothing is just a fake "message sent" toast.
- The **Admin Dashboard** (`#admin`, e.g. http://localhost:5173/#admin) now has a real sign-in screen and calls the real `/api/admin/*` endpoints with the returned JWT — see "Where do orders show up?" below.
- **Order tracking** for customers (no login required): after checkout, the browser remembers the order's ID in `localStorage`. The "My Orders" tab in Account re-fetches the live status/tracking number for those orders from `GET /api/orders/:id` — click **"🔄 Refresh Status"** any time to pull the latest status the admin has set.

To sign in as admin against the backend API directly (e.g. with `curl` or Postman):
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sujacrochet.com","password":"admin123"}'
```
Use the returned `token` as `Authorization: Bearer <token>` on any `/api/admin/...` route.

---

## 6a. Where do orders show up?

Every order is saved to the backend's database — a single file at **`backend/prisma/dev.db`** (SQLite) by default. You can view/edit it three ways:

1. **Admin Dashboard in the browser** — go to `#admin`, sign in with the seeded admin account, click **Orders**. You can change an order's status (`order_placed → handmade_preparation → packed → shipped → out_for_delivery → delivered`, or `cancelled`) and set a tracking/AWB number — customers see this update the next time they hit "Refresh Status".
2. **Prisma Studio** — a free visual database browser. From `backend/`:
   ```bash
   npx prisma studio
   ```
   Opens at http://localhost:5555 with tables for `Order`, `OrderItem`, `Payment`, `Product`, etc.
3. **Directly via the API** — `GET /api/admin/orders` (with an admin token) returns every order as JSON.

## 6b. Order tracking for customers

Customers don't need an account to track an order:
- Right after checkout, they land on a confirmation page showing their **Order ID** (e.g. `SUJA482913`) — tell them to save it.
- Their browser also remembers it automatically (in `localStorage`), so **Account → My Orders** shows it with a live progress bar and a **"🔄 Refresh Status"** button that re-checks the database.
- If they switch browsers/devices, they've lost the local memory — for a production launch you'll likely want to add proper customer accounts (sign up/sign in) so orders are tied to an email/password instead of just the browser. The backend already supports this (`Order.userId`, `/api/auth/signup`, `/api/orders` returns a user's own orders when signed in) — only the frontend login screen is still missing (see "Next steps" below).

---

## 7. Build for production

**Frontend:**
```bash
cd frontend
npm run build
```
Outputs static files to `frontend/dist/` — deploy this folder to any static host (Vercel, Netlify, S3 + CloudFront, etc.). Set your production API's URL by adjusting the frontend's `src/api.js` `BASE` constant, or by keeping `/api` and reverse-proxying it to the backend from your hosting platform (same pattern as the Vite dev proxy).

**Backend:**
```bash
cd backend
npm install --omit=dev
npm run prisma:migrate     # against your production DATABASE_URL
npm start
```
Deploy to any Node host (Render, Railway, Fly.io, a VPS, etc.). Set all variables from `.env.example` in your host's environment configuration — do not commit a `.env` file. Set `PAYMENTS_MODE=live` and real Razorpay credentials before accepting real payments.

---

## 8. Project structure reference

```
backend/
├── prisma/
│   ├── schema.prisma      Database schema (Users, Products, Orders, Payments, etc.)
│   └── seed.js            Demo categories/products + admin user
├── src/
│   ├── lib/
│   │   ├── prisma.js      Shared Prisma client
│   │   └── razorpay.js    Razorpay client + mock-mode toggle
│   ├── middleware/
│   │   └── auth.js        JWT auth (attachUser / requireAuth / requireAdmin)
│   └── routes/
│       ├── products.js, categories.js
│       ├── orders.js               order creation, tracking
│       ├── payments.js             Razorpay create-order / verify / webhook
│       ├── customOrders.js         "Made Just for You" form submissions
│       ├── returnRequests.js       defect/return reports with proof
│       ├── reviews.js
│       ├── wishlist.js
│       ├── auth.js                 signup / login
│       └── admin.js                admin CRUD for products/orders/etc.
├── server.js
├── .env.example
└── package.json

frontend/
├── index.html
├── src/
│   ├── app.js        All page rendering + interactions (home, shop, product,
│   │                 cart, checkout, account, custom orders, admin, etc.)
│   ├── api.js         fetch() wrapper around the backend API
│   └── styles.css
├── vite.config.js
└── package.json
```

---

## 9. Business rules already implemented

- Every order is created with an estimated delivery window of **20–25 days** (handmade preparation time).
- General returns ("changed my mind") are not accepted — the backend's `return-requests` route only accepts a request for an order that is already `delivered`, and requires at least one proof file/link.
- Reviews can only be submitted against a `delivered` order.
- `RAZORPAY_KEY_SECRET` is never exposed to the frontend.
- Order status can only be updated through the defined stages: `order_placed → handmade_preparation → packed → shipped → out_for_delivery → delivered` (enforced in `backend/src/routes/admin.js`).

---

## 10. Next steps to fully go live

1. **Real Razorpay test keys are already in `backend/.env`** (`PAYMENTS_MODE=live`) — the real Checkout widget opens using Razorpay's test mode. When you're ready for real customer payments, replace `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` with your `rzp_live_...` keys (after Razorpay KYC activation), and register your webhook URL (`https://yourdomain.com/api/payments/webhook`) with a real `RAZORPAY_WEBHOOK_SECRET`.
2. **Change the seeded admin password** (`admin@sujacrochet.com` / `admin123`) — sign in, then add a "change password" flow, or update `passwordHash` directly via Prisma Studio.
3. Replace the emoji/photo placeholders with your final product photography (already mostly done — see `frontend/public/assets/products/`).
4. (Optional but recommended) Add real customer sign-in/sign-up screens using the already-built `/api/auth/signup` and `/api/auth/login` endpoints, so orders are tied to an account instead of just the browser's local storage.
5. Switch the database from SQLite to PostgreSQL for production (see step 3 above) and deploy: static frontend to any static host, backend + Postgres to any Node host (Render, Railway, Fly.io, etc.).

## 11. Product photography

The demo catalogue in `frontend/src/app.js` (and the matching seed data in
`backend/prisma/seed.js`) uses real handmade product photography, stored in
`frontend/public/assets/products/`. There is no stock or AI-generated imagery
anywhere in this project. To add more products, drop a photo into that
folder and add an entry to the `PRODUCTS` array (and to `seed.js` if you're
using the database) — see `frontend/public/assets/README.md` for the exact
steps.

Thank you for building suja.crochet. Handmade with love. 🧶
