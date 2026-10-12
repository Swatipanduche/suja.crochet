# Assets folder

`products/` already contains the real handmade product photography used by
the storefront (see `frontend/src/app.js` → `PRODUCTS`, and
`backend/prisma/seed.js` for the matching database seed data). No stock or
AI-generated imagery is used anywhere in this project.

To add a new product photo:

1. Add the image file to `products/` (JPEG or PNG, ideally resized to under
   ~1400px on the long edge and compressed — large uploads slow the site
   down).
2. Reference it from the product's `images` array in `frontend/src/app.js`
   (and from `images` in `backend/prisma/seed.js` if you're using the
   database), as `/assets/products/your-file.jpg`.
3. If a product has more than one photo, list them all in `images` — the
   product detail page automatically shows clickable thumbnails when there's
   more than one.

`branding/` is for logo files, a favicon, and Instagram-ready brand assets —
currently empty, add these whenever you have final brand artwork.
