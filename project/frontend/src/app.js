import { api } from './api.js';

/* ============ DATA ============ */
// This mock data powers the storefront out of the box. If a backend is
// running at /api (see backend/), the loadFromBackend() call further down
// will replace it with live data from the database — everything else in
// this file keeps working unchanged either way.
const CATEGORIES = [
  {
    id:'gift',
    icon:'gift',
    emoji:'🎁',
    name:'Gift Collection',
    desc:'Cute handmade keychains and little gifts.'
  },
  {
    id:'hair',
    icon:'hair',
    emoji:'🎀',
    name:'Hair Accessories',
    desc:'Crochet bows, clips, hair ties, sticks and scrunchies.'
  },
  {
    id:'bouquets',
    icon:'flower',
    emoji:'💐',
    name:'Crochet Bouquets',
    desc:'Handmade flower bouquets and single stems that never wilt.'
  },
  {
    id:'decor',
    icon:'home',
    emoji:'🏡',
    name:'Decor Items',
    desc:'Beautiful crochet pieces for cars, curtains, tables, walls and home.'
  },
  {
    id:'custom',
    icon:'custom',
    emoji:'🧵',
    name:'Custom Orders',
    desc:'Made exactly to your request.'
  },
];
const PRODUCTS = [
  {id:"crochet-bouquet", name:"Crochet Flower Bouquet", cat:"bouquets", price:899, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/crochet-bouquet.jpeg"],
   desc:"A handmade crochet flower bouquet, wrapped beautifully for gifting.", materials:"Acrylic yarn, wire stems, wrap, ribbon", size:"Approx. 30cm", colors:["#F2B705"]},
  {id:"red-rose-bouquet", name:"Red Rose Crochet Bouquet", cat:"bouquets", price:999, mrp:1199, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/red-rose-bouquet.jpeg"],
   desc:"A rich red crochet rose bouquet made to last and never wilt.", materials:"Acrylic yarn, wire stems, wrap, ribbon", size:"Approx. 30cm", colors:["#C6284B"]},
  {id:"single-rose", name:"Single Crochet Rose Stem", cat:"bouquets", price:249, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/single-rose.jpeg"],
   desc:"One elegant crochet rose on a stem \u2014 sweet on its own or as part of a bouquet.", materials:"Acrylic yarn, wire stem", size:"Approx. 22cm", colors:["#D83A67"]},
  {id:"sunflower-bouquet", name:"Sunflower Crochet Bouquet", cat:"bouquets", price:899, mrp:1099, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/sunflower-bouquet.jpeg"],
   desc:"A cheerful hand-stitched sunflower bouquet, wrapped ready for gifting.", materials:"Acrylic yarn, wire stem, wrap, ribbon", size:"Approx. 30cm", colors:["#F2B705"]},
  {id:"tulip-bouquet", name:"Tulip Crochet Bouquet", cat:"bouquets", price:799, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/tulip-bouquet.jpeg","/assets/products/tulip-bouquet-alt.png"],
   desc:"A crochet tulip in full bloom, gift-wrapped and tied with a ribbon.", materials:"Acrylic yarn, wire stem, wrap, ribbon", size:"Approx. 28cm", colors:["#E6338C"]},
  {id:"crochet-bow-clip", name:"Crochet Bow Hair Clip", cat:"hair", price:299, mrp:399, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/crochet-bow-clip.jpeg"],
   desc:"A soft crochet bow clip that adds a playful handmade touch to any hairstyle.", materials:"Cotton-blend yarn, hair clip base", size:"Approx. 8cm", colors:["#D81B60"]},
  {id:"blue-flower-claw-clip", name:"Blue Flower Claw Clip", cat:"hair", price:349, mrp:449, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/blue-flower-claw-clip.png"],
   desc:"A floral crochet claw clip for a cheerful everyday updo.", materials:"Cotton-blend yarn, acrylic claw clip base", size:"Approx. 9cm", colors:["#4A90E2"]},
  {id:"daisy-hair-stick", name:"Daisy Hair Stick", cat:"hair", price:399, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/daisy-hair-stick.png"],
   desc:"A statement daisy hair stick with a handmade crochet flower.", materials:"Cotton yarn, wooden hair stick", size:"Flower approx. 10cm", colors:["#F5D547"]},
  {id:"pink-hair-bow", name:"Pink Crochet Hair Bow", cat:"hair", price:299, mrp:399, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/pink-hair-bow.jpeg"],
   desc:"A delicate pink crochet bow for half-up styles and ponytails.", materials:"Acrylic yarn, hair clip base", size:"Approx. 9cm", colors:["#F3A1BD"]},
  {id:"floral-hair-claw", name:"Floral Crochet Hair Claw", cat:"hair", price:349, mrp:449, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/floral-hair-claw.jpeg"],
   desc:"A pretty floral claw clip designed to hold a bun or half-up hairstyle.", materials:"Cotton-blend yarn, acrylic claw clip base", size:"Approx. 9cm", colors:["#B96B8B"]},
  {id:"red-crochet-hair-bow", name:"Red Crochet Hair Bow", cat:"hair", price:299, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/red-crochet-hair-bow.jpeg"],
   desc:"A bold red crochet bow that turns a simple hairstyle into a statement look.", materials:"Acrylic yarn, hair clip base", size:"Approx. 10cm", colors:["#B51245"]},
  {id:"pink-flower-hair-tie", name:"Pink Blossom Hair Tie", cat:"hair", price:249, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/pink-flower-hair-tie.png"],
   desc:"A soft crochet flower hair tie that dresses up a simple ponytail.", materials:"Acrylic yarn, elastic band", size:"Flower approx. 6cm", colors:["#F4A6C1"]},
  {id:"lotus-hair-stick", name:"Lotus Hair Stick", cat:"hair", price:399, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/lotus-hair-stick.jpeg"],
   desc:"A handcrafted lotus hair stick for an elegant traditional-inspired style.", materials:"Cotton yarn, wooden hair stick", size:"Flower approx. 10cm", colors:["#E91E63"]},
  {id:"rose-hair-tie", name:"Rose Hair Tie", cat:"hair", price:249, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/rose-hair-tie.png"],
   desc:"A crochet rose hair tie with a rich handmade texture.", materials:"Acrylic yarn, elastic band", size:"One size", colors:["#B83A4B"]},
  {id:"small-flower-claw-clip", name:"Small Flower Claw Clip", cat:"hair", price:299, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/small-flower-claw-clip.png"],
   desc:"A compact floral claw clip for an easy everyday hairstyle.", materials:"Cotton-blend yarn, acrylic claw clip base", size:"Approx. 7cm", colors:["#F1D36B"]},
  {id:"flower-scrunchie", name:"Flower Crochet Scrunchie", cat:"hair", price:299, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/flower-scrunchie.jpeg"],
   desc:"A soft textured crochet scrunchie finished with a pretty flower detail.", materials:"Acrylic yarn, elastic band", size:"One size", colors:["#F2A6C6"]},
  {id:"sunflower-claw-clip", name:"Sunflower Claw Clip", cat:"hair", price:349, mrp:449, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/sunflower-claw-clip.jpeg"],
   desc:"A sunny crochet sunflower claw clip with a sturdy base.", materials:"Cotton-blend yarn, acrylic claw clip base", size:"Approx. 9cm", colors:["#F2B705"]},
  {id:"sunflower-hair-clutch", name:"Sunflower Hair Clutch", cat:"hair", price:399, mrp:499, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/sunflower-hair-clutch.jpeg"],
   desc:"A bright sunflower crochet hair accessory for a statement half-up look.", materials:"Cotton yarn, hair clip base", size:"Flower approx. 10cm", colors:["#F2B705"]},
  {id:"sunflower-hair-stick", name:"Sunflower Hair Stick", cat:"hair", price:399, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/sunflower-hair-stick.png"],
   desc:"A full crochet sunflower mounted on a hair stick for special occasions.", materials:"Cotton yarn, wooden hair stick", size:"Flower approx. 10cm", colors:["#F2B705"]},
  {id:"tulip-claw-clip", name:"Tulip Claw Clip", cat:"hair", price:349, mrp:449, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/tulip-claw-clip-1.jpeg","/assets/products/tulip-claw-clip-2.jpeg"],
   desc:"A delicate crochet tulip claw clip for a fresh floral hairstyle.", materials:"Cotton-blend yarn, acrylic claw clip base", size:"Approx. 8cm", colors:["#E6338C"]},
  {id:"rainbow-car-charm", name:"Rainbow Car Charm", cat:"decor", price:299, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/rainbow-car-charm.png"],
   desc:"A cheerful crochet rainbow charm to brighten your car interior.", materials:"Cotton yarn, hanging cord", size:"Approx. 12cm", colors:["#E98A45"]},
  {id:"crochet-coaster", name:"Crochet Coaster", cat:"decor", price:149, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/crochet-coaster.jpeg"],
   desc:"A handmade crochet coaster that adds a cozy touch to your coffee table.", materials:"Cotton yarn", size:"Approx. 10cm diameter", colors:["#C58A5B"]},
  {id:"daisy-curtain-decor", name:"Daisy Curtain Decor", cat:"decor", price:449, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/daisy-curtain-decor.jpeg"],
   desc:"A delicate daisy hanging strand to bring handmade charm to curtains and windows.", materials:"Cotton yarn, hanging cord", size:"Approx. 60cm", colors:["#F5D547"]},
  {id:"ganpati-door-hanging", name:"Ganpati Door Hanging", cat:"decor", price:599, mrp:699, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/ganpati-door-hanging.jpeg"],
   desc:"A festive crochet Ganpati hanging made to add warmth and character to your entrance.", materials:"Cotton yarn, hanging cord", size:"Approx. 30cm", colors:["#E85D4A"]},
  {id:"nazar-charm", name:"Nazar Crochet Charm", cat:"decor", price:199, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/nazar-charm.jpeg"],
   desc:"A handmade nazar-inspired crochet hanging for a playful decorative touch.", materials:"Cotton yarn, hanging cord", size:"Approx. 12cm", colors:["#2F6FC0"]},
  {id:"sunflower-car-charm", name:"Sunflower Car Charm", cat:"decor", price:299, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/sunflower-car-charm.jpeg"],
   desc:"A sunny crochet sunflower charm for your rear-view mirror.", materials:"Cotton yarn, hanging cord", size:"Approx. 12cm", colors:["#F2B705"]},
  {id:"sunflower-car-decor", name:"Sunflower Car Decor", cat:"decor", price:349, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/sunflower-car-decor.jpeg"],
   desc:"A crochet sunflower hanging designed to make your car feel more personal.", materials:"Cotton yarn, hanging cord", size:"Approx. 13cm", colors:["#F2B705"]},
  {id:"sunflower-table-decor", name:"Sunflower Table Decor", cat:"decor", price:449, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/sunflower-table-decor.jpeg"],
   desc:"A cheerful crochet sunflower in a tiny pot for desks, shelves and tables.", materials:"Cotton yarn, pot, stuffing", size:"Approx. 18cm", colors:["#F2B705"]},
  {id:"sunflower-hanging-charm", name:"Sunflower Hanging Charm", cat:"decor", price:249, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/sunflower-hanging-charm.jpeg"],
   desc:"A small crochet sunflower charm for doors, walls, mirrors or other spaces.", materials:"Cotton yarn, hanging cord", size:"Approx. 12cm", colors:["#F2B705"]},
  {id:"tulip-curtain-decor", name:"Tulip Curtain Decor", cat:"decor", price:449, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/tulip-curtain-decor.jpeg"],
   desc:"A soft crochet tulip strand that adds a floral accent to curtains and windows.", materials:"Cotton yarn, hanging cord", size:"Approx. 60cm", colors:["#E6338C"]},
  {id:"tulip-table-decor", name:"Tulip Table Decor", cat:"decor", price:449, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/tulip-table-decor.jpeg"],
   desc:"A tiny crochet tulip pot that looks lovely on a desk, shelf or table.", materials:"Cotton yarn, pot, stuffing", size:"Approx. 18cm", colors:["#E6338C"]},
  {id:"crochet-wall-decor", name:"Crochet Wall Decor", cat:"decor", price:499, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/crochet-wall-decor.jpeg"],
   desc:"A handmade floral wall hanging to add texture and color to your space.", materials:"Cotton yarn, hanging cord", size:"Approx. 50cm", colors:["#E98A45"]},
  {id:"white-flower-car-decor", name:"White Flower Car Decor", cat:"decor", price:299, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/white-flower-car-decor.jpeg"],
   desc:"A soft white crochet flower hanging for a clean, elegant car interior.", materials:"Cotton yarn, hanging cord", size:"Approx. 12cm", colors:["#F4F1E8"]},
  {id:"letter-keychain", name:"Letter Crochet Keychain", cat:"gift", price:199, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/letter-keychain.png"],
   desc:"A cute personalized-style crochet letter keychain for bags, keys and gifts.", materials:"Cotton yarn, keyring", size:"Approx. 7cm", colors:["#F08BAA"]},
  {id:"pink-flower-keychain", name:"Pink Flower Keychain", cat:"gift", price:199, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/pink-flower-keychain.png"],
   desc:"A cheerful crochet flower keychain that makes a sweet little gift.", materials:"Cotton yarn, keyring", size:"Approx. 7cm", colors:["#F3A1BD"]},
  {id:"rose-keychain", name:"Rose Crochet Keychain", cat:"gift", price:199, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/rose-keychain.png"],
   desc:"A tiny crochet rose keychain with a leafy finish.", materials:"Cotton yarn, keyring", size:"Approx. 7cm", colors:["#B83A4B"]},
  {id:"sunflower-keychain", name:"Sunflower Keychain", cat:"gift", price:199, mrp:null, rating:4.8, reviews:0, bestseller:true,
   images:["/assets/products/sunflower-keychain.jpeg"],
   desc:"A tiny crochet sunflower on a keyring \u2014 a cheerful little gift.", materials:"Cotton yarn, keyring", size:"Approx. 6cm", colors:["#F2B705"]},
  {id:"sunflower-mini-gift", name:"Sunflower Mini Gift", cat:"gift", price:249, mrp:null, rating:4.8, reviews:0, bestseller:false,
   images:["/assets/products/sunflower-mini-gift.jpeg"],
   desc:"A small handmade sunflower keepsake, perfect for gifting or adding to a hamper.", materials:"Cotton yarn, gift wrap", size:"Approx. 8cm", colors:["#F2B705"]},
];

const REVIEWS = [
  {name:'Ananya R.', stars:5, text:'The sunflower bouquet is even more beautiful in person. You can feel the care in every stitch.', prod:'Sunflower Crochet Bouquet'},
  {name:'Meera K.', stars:5, text:'Ordered the sunflower claw clip as a gift for my sister — she loved it! Packaging was so thoughtful too.', prod:'Sunflower Claw Clip'},
  {name:'Farah S.', stars:4, text:'The scrunchie is so soft and the colours are exactly as shown. Delivery took a little longer but it was worth the wait.', prod:'Ruffled Pink Scrunchie'},
];

/* ============ STATE ============ */
const savedCustomerDetails = (function(){
  try { return JSON.parse(localStorage.getItem('suja_customer_details') || '{}'); } catch(e){ return {}; }
})();

const state = {
  route: 'home',
  params: {},
  cart: [], // {id, qty, color}
  saved: [], // saved for later
  wishlist: [],
  orders: [],
  checkoutStep: 1,
  customerDetails: {
    name: savedCustomerDetails.name || '',
    mobile: savedCustomerDetails.mobile || '',
    email: savedCustomerDetails.email || '',
    address: savedCustomerDetails.address || '',
    city: savedCustomerDetails.city || '',
    state: savedCustomerDetails.state || '',
    pincode: savedCustomerDetails.pincode || '',
  },
  accountTab: 'orders',
  adminView: 'dashboard',
  filters: {cats:new Set(), sort:'recommended', maxPrice:2000, minRating:0},
  searchQuery: '',
};

function findProduct(id){ return PRODUCTS.find(p=>String(p.id)===String(id)); }
function fmt(n){ return '₹'+n.toLocaleString('en-IN'); }
// Used by footer/static links: guarantees a click always lands on the right
// page, even if the hash happens to be unchanged (browsers don't fire
// 'hashchange' in that case, which could otherwise look like "nothing happened").
function go(path){
  if(location.hash.replace('#','')===path){ route(); } else { location.hash = path; }
  return false;
}
function toast(msg){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(window._toastTimer); window._toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ============ ROUTER ============ */
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

function route(){
  let hash = location.hash.replace('#','') || 'home';
  let [rawPath, param] = hash.split('/');
  let [path, query] = rawPath.split('?');
  state.route = path; state.params.id = param;
  if(query){
    const qs = new URLSearchParams(query);
    const cat = qs.get('cat');
    if(cat) state.filters.cats = new Set([cat]);
  }
  document.getElementById('mobileNav').classList.remove('open');
  document.querySelectorAll('.mainnav a').forEach(a=>a.classList.toggle('active', a.dataset.route===path));
  window.scrollTo(0,0);
  render();
  updateBadges();
}

function updateBadges(){
  const cartCount = state.cart.reduce((s,i)=>s+i.qty,0);
  const cb=document.getElementById('cartBadge'), wb=document.getElementById('wishBadge');
  cb.textContent=cartCount; cb.classList.toggle('hide', cartCount===0);
  wb.textContent=state.wishlist.length; wb.classList.toggle('hide', state.wishlist.length===0);
}

document.getElementById('hamburgerBtn').addEventListener('click',()=>{
  document.getElementById('mobileNav').classList.toggle('open');
});
function handleSearch(val){
  state.searchQuery = val.trim();
  document.getElementById('mobileNav').classList.remove('open');
  location.hash = 'shop';
  if(state.route === 'shop') render();
}

document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch(e.target.value);
});

document.getElementById('mobileSearchInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch(e.target.value);
});

/* ============ RENDER DISPATCH ============ */
function render(){
  const app=document.getElementById('app');
  const routes={
    home: renderHome, shop: renderShop, product: renderProduct, cart: renderCart,
    checkout: renderCheckout, confirmation: renderConfirmation, account: renderAccount,
    wishlist: renderWishlist, custom: renderCustom, about: renderAbout, categories: renderCategories,
    contact: renderContact, admin: renderAdmin,
    shipping: renderShipping, returns: renderReturns, terms: renderTerms, privacy: renderPrivacy,
    cancellation: renderCancellation, paymentpolicy: renderPaymentPolicy,
  };
  app.innerHTML = (routes[state.route]||renderHome)();
  attachGlobalHandlers();
}

/* ============ SHARED PARTIALS ============ */
function productCard(p){
  const wished = state.wishlist.includes(p.id);
  const photo = p.images && p.images[0]
    ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">`
    : `<span class="emoji">🧶</span>`;
  
  const isOut = p.stock !== undefined && p.stock <= 0;
  const isLow = p.stock !== undefined && p.stock > 0 && p.stock <= 5;
  const isCustom = p.cat === 'custom';

  let badgeHtml = '';
  if (isOut) {
    badgeHtml = '<span class="tag tag-out">Out of Stock</span>';
  } else if (isLow) {
    badgeHtml = `<span class="tag tag-low">Only ${p.stock} left</span>`;
  } else if (isCustom) {
    badgeHtml = '<span class="tag tag-custom">Made to Order</span>';
  } else if (p.bestseller) {
    badgeHtml = '<span class="tag">Bestseller</span>';
  }

  return `
  <div class="card ${isOut ? 'card-out-of-stock' : ''}">
    <div class="card-photo" onclick="location.hash='product/${p.id}'">
      ${badgeHtml}
      <span class="wish-btn ${wished?'active':''}" onclick="event.stopPropagation();toggleWishlist('${p.id}')">${wished?'♥':'♡'}</span>
      ${photo}
    </div>
    <div class="card-body">
      <span class="card-cat">${catName(p.cat)}</span>
      <span class="card-name" onclick="location.hash='product/${p.id}'">${p.name}</span>
      <span class="card-desc">${p.desc.slice(0,46)}…</span>
      <span class="card-rating">★ ${p.rating || 4.8} (${p.reviews || 0})</span>
      <div class="card-price-row">
        <span class="price">${fmt(p.price)}</span>
        ${p.mrp?`<span class="price-strike">${fmt(p.mrp)}</span>`:''}
      </div>
      <div class="card-actions">
        ${isOut
          ? `<button class="btn btn-outline" disabled style="opacity:0.6;cursor:not-allowed;">Sold Out</button>`
          : `<button class="btn btn-outline" onclick="quickAdd('${p.id}')">Quick Add</button>`}
        <button class="btn btn-primary" onclick="location.hash='product/${p.id}'">View</button>
      </div>
    </div>
  </div>`;
}
function catName(id){ return (CATEGORIES.find(c=>c.id===id)||{}).name || id; }

function footerHTML(){
  return `
  <footer>
  <div class="wrap">
    <div class="foot-grid"><div>
        <div class="foot-logo">suja.crochet</div>
        <p class="foot-desc">
          Handmade crochet creations, made with patience, care and love.
          Every piece is crafted individually for you.
        </p>

        <div class="footer-social">
          <a
            href="https://www.instagram.com/suja.crochet?igsh=cXN1N3E1bGhsbGlk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.5" cy="6.5" r="1"></circle>
            </svg>
          </a>

          <a
            href="https://youtube.com/@suja.crochet?si=6NAUpYkqWLefkLOM"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            title="YouTube"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C1.9 8.9 1.9 12 1.9 12s0 3.1.5 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8Z"></path>
              <path class="youtube-play" d="m10 9 5 3-5 3V9Z"></path>
            </svg>
          </a>
        </div>
      </div>

      <div class="foot-col">
        <h4>Shop</h4>
        <a href="#shop" onclick="return go('shop')">All Products</a>
        <a href="#shop/bouquets" onclick="return go('shop/bouquets')">Crochet Bouquets</a>
        <a href="#shop/hair" onclick="return go('shop/hair')">Hair Accessories</a>
        <a href="#shop/gift" onclick="return go('shop/gift')">Keychains &amp; Gifts</a>
        <a href="#shop/decor" onclick="return go('shop/decor')">Decor Items</a>
        <a href="#custom" onclick="return go('custom')">Custom Orders</a>
      </div>

      <div class="foot-col">
        <h4>Policies</h4>
        <a href="#shipping" onclick="return go('shipping')">Shipping Policy</a>
        <a href="#returns" onclick="return go('returns')">Return &amp; Refund</a>
        <a href="#cancellation" onclick="return go('cancellation')">Cancellation Policy</a>
        <a href="#paymentpolicy" onclick="return go('paymentpolicy')">Payment &amp; Security</a>
        <a href="#terms" onclick="return go('terms')">Terms &amp; Conditions</a>
        <a href="#privacy" onclick="return go('privacy')">Privacy Policy</a>
      </div>

      <div class="foot-col">
        <h4>Contact</h4>
        <a href="#contact" onclick="return go('contact')">Contact Us</a>
        <a href="mailto:sujacrochet@gmail.com">sujacrochet@gmail.com</a>
        <a href="https://wa.me/919561742713" target="_blank">+91 9561742713</a>
        <p class="footer-contact-text">
          Handmade with care in India.
        </p>
      </div>

    </div>

    <div class="foot-bottom">
      © 2026 Suja Crochet · Handmade with love
    </div>
  </div>
</footer>`;
}
function renderPolicyPage(title, bodyHtml){
  return `
  <div class="page-head wrap"><span class="eyebrow">Policies</span><h1>${title}</h1></div>
  <div class="wrap section" style="max-width:760px;line-height:1.7;">${bodyHtml}</div>
  ${footerHTML()}`;
}
function renderShipping(){
  return renderPolicyPage('Shipping Policy', `
    <p>Every piece on suja.crochet is <b>handmade to order</b> — nothing sits pre-made in a warehouse, so please allow <b>20–25 days</b> for preparation before your order ships.</p>
    <p>Once shipped, you'll receive a tracking number by us updating your order status — check it any time under <a href="#account">Account → My Orders</a> and click "Refresh Status".</p>
    <p>Delivery typically takes an additional 3–7 business days depending on your location, handled by our courier partner.</p>
    <p>Shipping is free on orders above ₹999; otherwise a flat delivery fee of ₹79 applies and is shown before you pay.</p>
  `);
}
function renderReturns(){
  return renderPolicyPage('Return &amp; Defect Policy', `
    <p>Because every item is custom handmade, we're unable to accept general returns or exchanges for change-of-mind.</p>
    <p>If your order arrives <b>damaged or defective</b>, contact us within 48 hours of delivery with your Order ID and clear photos/video of the issue via <a href="#account">Account → My Orders → Report an Issue</a>, or email <a href="mailto:sujacrochet@gmail.com">sujacrochet@gmail.com</a>.</p>
    <p>Approved defect claims are resolved with a free replacement or repair — no refunds are issued for genuine defects, only replacement.</p>
  `);
}
function renderCancellation(){
  return renderPolicyPage('Cancellation Policy', `
    <p>Because every item at <b>suja.crochet</b> is handcrafted individually by hand with love, yarn preparation and crafting begin promptly after your order is confirmed.</p>
    <p><b>Cancellation Window:</b> You may request an order cancellation within <b>12 hours</b> of placing the order by messaging us on WhatsApp at <a href="https://wa.me/919561742713">+91 9561742713</a> or emailing <a href="mailto:sujacrochet@gmail.com">sujacrochet@gmail.com</a> with your Order ID.</p>
    <p>Once handcrafting or packaging has commenced after 12 hours, orders cannot be cancelled. For defective or damaged deliveries, please refer to our <a href="#returns">Return &amp; Defect Policy</a>.</p>
  `);
}
function renderPaymentPolicy(){
  return renderPolicyPage('Payment &amp; Security Policy', `
    <p>All payments on <b>suja.crochet</b> are processed securely using <b>Razorpay</b>, India's leading payment gateway provider.</p>
    <p>We support all major payment methods including <b>UPI (Google Pay, PhonePe, Paytm, BHIM)</b>, Credit/Debit Cards (Visa, MasterCard, RuPay), and Net Banking across all Indian banks.</p>
    <p><b>Security &amp; Encryption:</b> All transactions are protected using end-to-end 256-bit SSL encryption and strict server-side signature verification (HMAC-SHA256). We do not store or have access to your card details or banking passwords.</p>
    <p>For any transaction queries or assistance, contact us at <a href="mailto:sujacrochet@gmail.com">sujacrochet@gmail.com</a> or WhatsApp <a href="https://wa.me/919561742713">+91 9561742713</a>.</p>
  `);
}
function renderTerms(){
  return renderPolicyPage('Terms &amp; Conditions', `
    <p>By placing an order on suja.crochet, you agree to our handmade production timelines, shipping, cancellation and return/defect policies described on this site.</p>
    <p>Colours and sizes may vary slightly from photos since every piece is hand-crafted individually.</p>
    <p>Prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. Payments are processed securely via Razorpay; we never store your card details.</p>
    <p>Questions? Reach us at <a href="mailto:sujacrochet@gmail.com">sujacrochet@gmail.com</a>.</p>
  `);
}
function renderPrivacy(){
  return renderPolicyPage('Privacy Policy', `
    <p>At <b>suja.crochet</b>, your privacy is deeply important to us. We only collect details necessary to process and ship your orders (name, shipping address, contact phone number, and email address).</p>
    <p>Payment information is processed securely through Razorpay; we never see or store your credit card, debit card, or banking credentials.</p>
    <p>We will never sell or share your personal information with third parties. For any data or account queries, contact us at <a href="mailto:sujacrochet@gmail.com">sujacrochet@gmail.com</a> or via WhatsApp at <a href="https://wa.me/919561742713">+91 9561742713</a>.</p>
  `);
}

function categoryIllustration(type){

  const icons = {

    gift: `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M20 42h60v42H20z"/>
        <path d="M16 34h68v12H16z"/>
        <path d="M50 34v50"/>
        <path d="M50 34c-5-18-25-21-29-10-3 9 8 12 29 10Z"/>
        <path d="M50 34c5-18 25-21 29-10 3 9-8 12-29 10Z"/>
      </svg>
    `,

    hair: `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 82C50 62 24 62 24 45c0-11 9-19 20-19 9 0 15 5 20 12"/>
        <path d="M50 82c0-20 26-20 26-37 0-11-9-19-20-19-9 0-15 5-20 12"/>
        <path d="M50 43c-7-8-16-11-23-7"/>
        <path d="M50 43c7-8 16-11 23-7"/>
        <path d="M43 56c5 5 9 7 14 0"/>
      </svg>
    `,

    flower: `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 82V48"/>
        <path d="M50 60c-10-5-18-4-25 2"/>
        <path d="M50 68c10-5 18-4 25 2"/>
        <circle cx="50" cy="34" r="9"/>
        <path d="M50 25c-4-14-18-17-22-8-3 7 5 13 14 17"/>
        <path d="M58 28c9-12 23-9 24-1 1 8-8 12-19 12"/>
        <path d="M58 40c12 2 19 13 13 18-6 5-15-2-19-12"/>
        <path d="M42 40c-12 2-19 13-13 18 6 5 15-2 19-12"/>
      </svg>
    `,

    home: `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M16 47 50 19l34 28"/>
        <path d="M24 42v39h52V42"/>
        <path d="M42 81V58h16v23"/>
        <path d="M35 48c4-8 11-11 15-11s11 3 15 11"/>
        <circle cx="50" cy="35" r="3"/>
      </svg>
    `,

    custom: `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M28 72 67 33"/>
        <path d="m23 77 10-3-7-7-3 10Z"/>
        <path d="M62 28 72 18l10 10-10 10"/>
        <path d="M57 23c-8-8-18-5-22 1"/>
        <path d="M43 77c12 2 23-4 28-14"/>
        <path d="M32 48c-7 3-10 10-8 17"/>
      </svg>
    `
  };

  return icons[type] || icons.custom;
}
/* ============ HOME ============ */
function renderHome(){
  const bestsellers = PRODUCTS.filter(p=>p.bestseller);
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Small batch • Handmade in India</span>
        <h1>Made by Hand.<br>Made with Love.</h1>
        <p class="lead">Handmade crochet gifts, accessories, bouquets and little things made specially for you.</p>
        <div class="hero-btns">
          <a href="#shop" class="btn btn-primary">Shop Now</a>
          <a href="#custom" class="btn btn-outline">Custom Order</a>
        </div>
      </div>
<div class="hero-photo">
  <img src="/assets/homepage/hero.jpeg.png" alt="Suja Crochet handmade creations">
</div>    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Browse</span>
        <h2>Featured Categories</h2>
        <div class="stitch center"><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="cat-grid">
        ${CATEGORIES.map(c=>`
          <a class="cat-card" href="#shop/${c.id}" onclick="setCategoryFilter('${c.id}')">
            <div class="cat-illustration">${categoryIllustration(c.icon)}</div>
            <div class="cat-name">${c.name}</div>
            <p class="cat-desc">${c.desc}</p>
            <span class="cat-action">Explore &rarr;</span>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--offwhite);">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Loved by customers</span>
        <h2>Best Sellers</h2>
        <div class="stitch center"><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="prod-grid">${bestsellers.map(productCard).join('')}</div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Why suja.crochet</span>
        <h2>Small Things, Made Well</h2>
      </div>
      <div class="why-grid">
        <div class="why-item"><div class="why-icon">🧵</div><h3>Handmade with Care</h3><p>Every piece is carefully handmade and packed with love.</p></div>
        <div class="why-item"><div class="why-icon">🎨</div><h3>Made for You</h3><p>Choose from our collections or request something customised.</p></div>
        <div class="why-item"><div class="why-icon">💛</div><h3>Small Business, Happy Customers</h3><p>What started as gifting has grown through the love and support of our customers.</p></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--offwhite);">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Reviews</span>
        <h2>Customer Reviews</h2>
      </div>
      <div class="rev-grid">
        ${REVIEWS.map(r=>`
          <div class="rev-card">
            <div class="rev-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
            <p class="rev-text">"${r.text}"</p>
            <div class="rev-name">${r.name}</div>
            <div class="rev-prod">Purchased: ${r.prod}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>
  ${footerHTML()}`;
}

/* ============ CATEGORIES PAGE ============ */
function renderCategories(){
  return `
  <div class="page-head wrap">
    <span class="eyebrow">Browse by</span>
    <h1>Categories</h1>
    <p>Find exactly what you're looking for, from gifts to made-to-order pieces.</p>
  </div>
  <div class="wrap section" style="padding-top:10px;">
    <div class="cat-grid">
      ${CATEGORIES.map(c=>`
        <a class="cat-card" href="#shop/${c.id}" onclick="setCategoryFilter('${c.id}')">
          <div class="cat-illustration">${categoryIllustration(c.icon)}</div>
          <div class="cat-name">${c.name}</div>
          <p class="cat-desc">${c.desc}</p>
          <span class="cat-action">Explore &rarr;</span>
        </a>`).join('')}
    </div>
  </div>
  ${footerHTML()}`;
}
function setCategoryFilter(id){ state.filters.cats=new Set([id]); }

/* ============ SHOP ============ */
function renderShop(){
  if(state.params.id) state.filters.cats = new Set([state.params.id]);
  let list = PRODUCTS.slice();
  if(state.searchQuery){
    const q=state.searchQuery.toLowerCase();
    list = list.filter(p=>p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)||catName(p.cat).toLowerCase().includes(q));
  }
  if(state.filters.cats.size) list = list.filter(p=>state.filters.cats.has(p.cat));
  list = list.filter(p=>p.price<=state.filters.maxPrice);
  if(state.filters.minRating && state.filters.minRating > 0){
    list = list.filter(p=>(Number(p.rating)||4.8) >= state.filters.minRating);
  }
  switch(state.filters.sort){
    case 'newest': list = list.slice().reverse(); break;
    case 'low': list.sort((a,b)=>a.price-b.price); break;
    case 'high': list.sort((a,b)=>b.price-a.price); break;
    case 'rated': list.sort((a,b)=>b.rating-a.rating); break;
  }
  const catBoxes = CATEGORIES.map(c=>`
    <label class="filter-opt"><input type="checkbox" onchange="toggleCatFilter('${c.id}')" ${state.filters.cats.has(c.id)?'checked':''}> ${c.emoji||'🧶'} ${c.name}</label>`).join('');

  return `
  <div class="page-head wrap">
    <span class="eyebrow">Shop</span>
    <h1>${state.searchQuery? `Results for "${state.searchQuery}"` : 'All Products'}</h1>
  </div>
  <div class="wrap section" style="padding-top:6px;">
    <div class="shop-toolbar">
      <button class="btn btn-outline btn-sm mobile-filter-toggle" onclick="document.getElementById('filtersPanel').classList.toggle('open')">Filters ⚙</button>
      <span style="font-size:13.5px;color:var(--ink-soft);">${list.length} products</span>
      <select onchange="state.filters.sort=this.value; render()">
        <option value="recommended" ${state.filters.sort==='recommended'?'selected':''}>Recommended</option>
        <option value="newest" ${state.filters.sort==='newest'?'selected':''}>Newest</option>
        <option value="low" ${state.filters.sort==='low'?'selected':''}>Price: Low to High</option>
        <option value="high" ${state.filters.sort==='high'?'selected':''}>Price: High to Low</option>
        <option value="rated" ${state.filters.sort==='rated'?'selected':''}>Best Rated</option>
      </select>
    </div>
    <div class="shop-layout">
      <aside class="filters" id="filtersPanel">
        <div class="filter-group">
          <h4>Category</h4>
          ${catBoxes}
        </div>
        <div class="filter-group">
          <h4>Max Price: ${fmt(state.filters.maxPrice)}</h4>
          <input type="range" min="150" max="2000" step="50" value="${state.filters.maxPrice}" style="width:100%" oninput="state.filters.maxPrice=Number(this.value); render()">
        </div>
        <div class="filter-group">
          <h4>Availability</h4>
          <label class="filter-opt"><input type="checkbox" checked disabled> In Stock</label>
        </div>
        <div class="filter-group">
          <h4>Rating</h4>
          <label class="filter-opt"><input type="checkbox" onchange="state.filters.minRating=this.checked?4:0; render()" ${state.filters.minRating>=4?'checked':''}> 4★ &amp; above</label>
        </div>
        <button class="btn btn-outline btn-sm btn-full" onclick="clearFilters()">Clear Filters</button>
      </aside>
      <div>
        ${list.length? `<div class="prod-grid">${list.map(productCard).join('')}</div>` :
        `<div class="empty-state"><div class="emoji">🧶</div><h3>No products found</h3><p>Try a different search term or clear your filters.</p></div>`}
      </div>
    </div>
  </div>
  ${footerHTML()}`;
}
function toggleCatFilter(id){
  if(state.filters.cats.has(id)) state.filters.cats.delete(id); else state.filters.cats.add(id);
  render();
}
function clearFilters(){ state.filters={cats:new Set(), sort:'recommended', maxPrice:2000, minRating:0}; state.searchQuery=''; render(); }

/* ============ PRODUCT DETAIL ============ */
function renderProduct(){
  const p = findProduct(state.params.id);
  if(!p) return `<div class="wrap section"><h2>Product not found</h2><a href="#shop" class="btn btn-primary" style="margin-top:16px;">Back to Shop</a></div>`;
  const wished = state.wishlist.includes(p.id);
  const images = (p.images && p.images.length) ? p.images : [];
  const mainPhoto = images.length
    ? `<img id="pdMainImg" src="${images[0]}" alt="${p.name}">`
    : `<span class="emoji">🧶</span>`;
  const thumbsHTML = images.length > 1
    ? `<div class="pd-thumbs">
        ${images.map((src,i)=>`<div class="pd-thumb ${i===0?'active':''}" onclick="setMainImage('${src}', this)"><img src="${src}" alt="${p.name} view ${i+1}"></div>`).join('')}
      </div>`
    : '';
  const colorSection = (p.colors && p.colors.length > 1)
    ? `<div>
        <b style="font-size:13px;color:var(--brown-dark);">Choose Your Colour</b>
        <div class="color-row" id="colorRow">
          ${p.colors.map((c,i)=>`<span class="color-dot ${i===0?'active':''}" style="background:${c}" onclick="selectColor(this)"></span>`).join('')}
        </div>
      </div>`
    : `<p style="font-size:12.5px;color:var(--ink-soft);margin-bottom:6px;">Made in the colour shown. Want a different colour? <a href="#custom" style="text-decoration:underline;color:var(--accent-dark);">Send a custom request</a>.</p>`;
  return `
  <div class="wrap section">
    <div class="pd-grid">
      <div>
        <div class="pd-main-photo">${mainPhoto}</div>
        ${thumbsHTML}
      </div>
      <div>
        <span class="pd-cat">${catName(p.cat)}</span>
        <h1 class="pd-title">${p.name}</h1>
        <div class="pd-rating">★★★★★ ${p.rating} · ${p.reviews} reviews</div>
        <div class="pd-price-row">
          <span class="pd-price">${fmt(p.price)}</span>
          ${p.mrp?`<span class="price-strike">${fmt(p.mrp)}</span>`:''}
        </div>
        <p class="pd-desc">${p.desc}</p>

        <div class="pd-facts">
          <div class="pd-fact"><b>Availability</b>${
            p.stock !== undefined && p.stock <= 0
              ? '<span style="color:#b71c1c;font-weight:700;">Out of Stock</span>'
              : (p.stock !== undefined && p.stock <= 5
                  ? `<span style="color:#e65100;font-weight:700;">Only ${p.stock} left in stock!</span>`
                  : (p.cat === 'custom'
                      ? '<span style="color:#5a7350;font-weight:600;">Handcrafted to Order</span>'
                      : `<span style="color:#2e7d32;font-weight:600;">In Stock (${p.stock || 20} available)</span>`))
          }</div>
          <div class="pd-fact"><b>Materials</b><span>${p.materials}</span></div>
          <div class="pd-fact"><b>Approx. size</b><span>${p.size}</span></div>
          <div class="pd-fact"><b>Handmade</b><span>Yes — allow 20–25 days for preparation &amp; delivery</span></div>
        </div>

        ${colorSection}

        <label class="field">
          <span>Add Custom Note (optional)</span>
          <textarea id="customNote" rows="2" placeholder="e.g. Please add a small tag that says 'Happy Birthday'"></textarea>
        </label>

        <div class="qty-row">
          <span style="font-weight:700;font-size:13px;color:var(--brown-dark);">Quantity</span>
          <div class="qty-box">
            <button onclick="stepQty(-1)">−</button><span id="pdQty">1</span><button onclick="stepQty(1)">+</button>
          </div>
        </div>

        <div class="pd-btnrow">
          ${p.stock !== undefined && p.stock <= 0
            ? `<button class="btn btn-outline" disabled style="flex:1;opacity:0.6;cursor:not-allowed;">Out of Stock</button>
               <button class="btn btn-primary" disabled style="flex:1;opacity:0.6;cursor:not-allowed;">Sold Out</button>`
            : `<button class="btn btn-outline" style="flex:1;" onclick="addToCartFromPD('${p.id}')">Add to Cart</button>
               <button class="btn btn-primary" style="flex:1;" onclick="buyNow('${p.id}')">Buy Now</button>`}
          <button class="btn btn-outline btn-sm" onclick="toggleWishlist('${p.id}')" style="padding:13px 16px;">${wished?'♥':'♡'}</button>
        </div>
      </div>
    </div>
  </div>
  ${footerHTML()}`;
}
let _pdQty=1, _pdColor=null;
function stepQty(d){ _pdQty=Math.max(1,_pdQty+d); document.getElementById('pdQty').textContent=_pdQty; }
function selectColor(el){ document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active')); el.classList.add('active'); _pdColor=el.style.background; }
function setMainImage(src, thumbEl){
  document.getElementById('pdMainImg').src = src;
  document.querySelectorAll('.pd-thumb').forEach(t=>t.classList.remove('active'));
  thumbEl.classList.add('active');
}
function addToCartFromPD(id, silent){
  const existing = state.cart.find(i=>i.id===id && i.color===(_pdColor||'default'));
  if(existing) existing.qty += _pdQty; else state.cart.push({id, qty:_pdQty, color:_pdColor||'default', note:(document.getElementById('customNote')||{}).value||''});
  _pdQty=1; updateBadges();
  if(!silent) toast('Added to cart 🧺');
}
function buyNow(id){ addToCartFromPD(id,true); location.hash='checkout'; }
function quickAdd(id){
  const existing = state.cart.find(i=>i.id===id && i.color==='default');
  if(existing) existing.qty+=1; else state.cart.push({id, qty:1, color:'default', note:''});
  updateBadges(); toast('Added to cart 🧺');
}
function toggleWishlist(id){
  if(state.wishlist.includes(id)) state.wishlist = state.wishlist.filter(x=>x!==id);
  else { state.wishlist.push(id); toast('Saved to wishlist ♥'); }
  updateBadges(); render();
}

/* ============ WISHLIST ============ */
function renderWishlist(){
  const items = PRODUCTS.filter(p=>state.wishlist.includes(p.id));
  return `
  <div class="page-head wrap"><span class="eyebrow">Saved</span><h1>Your Wishlist</h1></div>
  <div class="wrap section" style="padding-top:6px;">
    ${items.length? `<div class="prod-grid">${items.map(productCard).join('')}</div>` :
    `<div class="empty-state"><div class="emoji">♡</div><h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it here.</p><a href="#shop" class="btn btn-primary" style="margin-top:16px;">Browse Shop</a></div>`}
  </div>
  ${footerHTML()}`;
}

/* ============ CART ============ */
function renderCart(){
  if(!state.cart.length){
    return `<div class="wrap section"><div class="empty-state"><div class="emoji">🧺</div><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><a href="#shop" class="btn btn-primary" style="margin-top:16px;">Continue Shopping</a></div></div>${footerHTML()}`;
  }
  const lines = state.cart.map((item,idx)=>{
    const p=findProduct(item.id);
    return {item, p, idx, total:p.price*item.qty};
  });
  const subtotal = lines.reduce((s,l)=>s+l.total,0);
  const delivery = subtotal>999? 0 : 79;
  const discount = 0;
  const total = subtotal+delivery-discount;
  return `
  <div class="page-head wrap"><span class="eyebrow">Your Bag</span><h1>Shopping Cart</h1></div>
  <div class="wrap section" style="padding-top:6px;">
    <div class="cart-layout">
      <div>
        ${lines.map(l=>`
          <div class="cart-item">
            <div class="cart-photo">${l.p.images && l.p.images[0] ? `<img src="${l.p.images[0]}" alt="${l.p.name}">` : "🧶"}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${l.p.name}</div>
              <div class="cart-item-meta">Colour: ${l.item.color==='default'?'Standard':'Selected'} ${l.item.note?`· Note: "${l.item.note}"`:''}</div>
              <div class="cart-item-meta">${fmt(l.p.price)} each</div>
              <div class="cart-item-actions">
                <div class="qty-box"><button onclick="changeCartQty(${l.idx},-1)">−</button><span>${l.item.qty}</span><button onclick="changeCartQty(${l.idx},1)">+</button></div>
                <button class="link-btn" onclick="removeFromCart(${l.idx})">Remove</button>
                <button class="link-btn" onclick="saveForLater(${l.idx})">Save for later</button>
              </div>
            </div>
            <div style="font-weight:700;color:var(--brown-dark);">${fmt(l.total)}</div>
          </div>`).join('')}
        ${state.saved.length? `
          <h4 style="margin:26px 0 12px;">Saved for later</h4>
          ${state.saved.map((item,i)=>{const p=findProduct(item.id);return `
            <div class="cart-item">
              <div class="cart-photo">${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}">` : "🧶"}</div>
              <div class="cart-item-info">
                <div class="cart-item-name">${p.name}</div>
                <div class="cart-item-meta">${fmt(p.price)}</div>
                <button class="link-btn" onclick="moveBackToCart(${i})">Move to cart</button>
              </div>
            </div>`;}).join('')}` : ''}
      </div>
      <div class="summary-box">
        <h3 style="margin-bottom:16px;">Order Summary</h3>
        <div class="sum-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="sum-row"><span>Delivery</span><span>${delivery===0?'Free':fmt(delivery)}</span></div>
        <div class="sum-row"><span>Discount</span><span>−${fmt(discount)}</span></div>
        <div class="sum-row total"><span>Total</span><span>${fmt(total)}</span></div>
        <a href="#checkout" class="btn btn-primary btn-full" style="margin-top:14px;">Proceed to Checkout</a>
        <a href="#shop" class="btn btn-outline btn-full" style="margin-top:10px;">Continue Shopping</a>
        <div class="policy-box">Handmade with care — please allow 20–25 days for preparation &amp; delivery. General returns aren't accepted; only genuine defects are covered. <a href="#returns" style="text-decoration:underline;">Read full policy</a>.</div>
      </div>
    </div>
  </div>
  ${footerHTML()}`;
}
function changeCartQty(idx,d){ state.cart[idx].qty=Math.max(1,state.cart[idx].qty+d); updateBadges(); render(); }
function removeFromCart(idx){ state.cart.splice(idx,1); updateBadges(); render(); toast('Removed from cart'); }
function saveForLater(idx){ state.saved.push(state.cart[idx]); state.cart.splice(idx,1); updateBadges(); render(); }
function moveBackToCart(i){ state.cart.push(state.saved[i]); state.saved.splice(i,1); updateBadges(); render(); }

/* ============ CHECKOUT ============ */
function renderCheckout(){
  if(!state.cart.length){ location.hash='cart'; return ''; }
  const step = state.checkoutStep;
  const subtotal = state.cart.reduce((s,i)=>s+findProduct(i.id).price*i.qty,0);
  const delivery = subtotal>999?0:79;
  const total = subtotal+delivery;
  const cd = state.customerDetails;

  const stepsBar = `
  <div class="steps-row">
    ${['Customer Details','Delivery','Payment'].map((label,i)=>`
      <div class="step-pill ${step===i+1?'active':''}"><span class="step-num">${i+1}</span> ${label}</div>`).join('')}
  </div>`;

  let body='';
  if(step===1){
    body = `
    <div class="form-grid">
      <label class="field"><span>Full Name</span><input type="text" id="cf_name" value="${cd.name}"></label>
      <label class="field"><span>Mobile Number</span><input type="tel" id="cf_mobile" value="${cd.mobile}"></label>
      <label class="field full"><span>Email</span><input type="email" id="cf_email" value="${cd.email}"></label>
      <label class="field full"><span>Address</span><input type="text" id="cf_address" value="${cd.address}"></label>
      <label class="field"><span>City</span><input type="text" id="cf_city" value="${cd.city}"></label>
      <label class="field"><span>State</span><input type="text" id="cf_state" value="${cd.state}"></label>
      <label class="field"><span>Pincode</span><input type="text" id="cf_pincode" value="${cd.pincode}"></label>
    </div>
    <button class="btn btn-primary btn-full" onclick="submitStep1()">Continue to Delivery</button>`;
  } else if(step===2){
    body = `
    <div class="notice-box">🧶 Every piece is handmade to order. <b>Estimated delivery: 20–25 days</b> from the order date, to allow time for careful preparation and stitching.</div>
    <div class="order-card">
      <div class="order-row"><span>Delivering to</span><b>${cd.name}, ${cd.city}</b></div>
      <div class="order-row"><span>Address</span><b>${cd.address}, ${cd.state} - ${cd.pincode}</b></div>
      <div class="order-row"><span>Estimated delivery</span><b>20–25 days</b></div>
    </div>
    <div class="policy-box">By continuing, you acknowledge our <a href="#returns" style="text-decoration:underline;">Return &amp; Defect Policy</a>: general returns are not accepted; replacements are only offered for genuine defects or damage, with photo/video proof.</div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn btn-outline" style="flex:1;" onclick="state.checkoutStep=1; render()">Back</button>
      <button class="btn btn-primary" style="flex:2;" onclick="state.checkoutStep=3; render()">Continue to Payment</button>
    </div>`;
  } else {
    body = `
    <div class="pay-option active">💳 <div><b>Card / UPI / Netbanking</b><br><span style="font-size:12px;color:var(--ink-soft);">Secured by Razorpay</span></div></div>
    <div class="order-card">
      <div class="order-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      <div class="order-row"><span>Delivery</span><span>${delivery===0?'Free':fmt(delivery)}</span></div>
      <div class="order-row" style="border-top:1px solid var(--beige);padding-top:8px;"><b>Total</b><b>${fmt(total)}</b></div>
    </div>
    <div class="policy-box">🔒 You'll be asked to pay <b>${fmt(total)}</b> securely via the Razorpay checkout window (card, UPI or netbanking). Your order is only confirmed once payment succeeds.</div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn btn-outline" style="flex:1;" onclick="state.checkoutStep=2; render()">Back</button>
      <button class="btn btn-primary" style="flex:2;" id="payBtn" onclick="processPayment(${total})">Pay ${fmt(total)}</button>
    </div>`;
  }

  return `
  <div class="wrap section checkout-box">
    ${stepsBar}
    <h2 style="text-align:center;margin-bottom:26px;">${['Your Details','Delivery Estimate','Payment'][step-1]}</h2>
    ${body}
  </div>`;
}
function submitStep1(){
  const ids=['name','mobile','email','address','city','state','pincode'];
  for(const id of ids){
    const val=document.getElementById('cf_'+id).value.trim();
    if(!val){ toast('Please fill in all fields'); return; }
    state.customerDetails[id]=val;
  }
  state.checkoutStep=2; render();
}
const ORDER_STAGES = ['order_placed','handmade_preparation','packed','shipped','out_for_delivery','delivered'];
const ORDER_STAGE_LABELS = ['Order Placed','Handmade Preparation','Packed','Shipped','Out for Delivery','Delivered'];
function stageIndexFor(status){ const i=ORDER_STAGES.indexOf(status); return i<0?0:i; }

// Guest order tracking: since there's no login flow in this storefront yet,
// we remember order IDs placed from this browser in localStorage so the
// "My Orders" tab can re-fetch their *real* live status from the database
// (see refreshMyOrders() below), even after the page is reloaded.
function rememberGuestOrder(dbId, orderNumber){
  try{
    const list = JSON.parse(localStorage.getItem('suja_guest_orders')||'[]');
    if(!list.find(o=>o.dbId===dbId)) list.unshift({dbId, orderNumber});
    localStorage.setItem('suja_guest_orders', JSON.stringify(list.slice(0,50)));
  }catch(e){ /* localStorage unavailable — orders still work, just won't persist across reloads */ }
}
function guestOrderIds(){
  try{ return JSON.parse(localStorage.getItem('suja_guest_orders')||'[]'); }catch(e){ return []; }
}

function mapBackendOrder(o){
  return {
    id: o.orderNumber, dbId: o.id,
    date: new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
    items: (o.items||[]).map(it=>({ id:it.productId, name: it.product?.name || 'Item', qty: it.quantity, price: it.unitPrice, color: it.selectedColor })),
    total: o.total,
    address: {
      name: o.customerName,
      address: o.shippingLine1 || o.address?.line1 || '',
      city: o.shippingCity || o.address?.city || '',
      state: o.shippingState || o.address?.state || '',
      pincode: o.shippingPincode || o.address?.pincode || '',
    },
    payment: o.payments?.[0]?.status==='paid' ? 'Paid via Razorpay'
      : (o.payments?.[0]?.provider==='cod' ? 'Cash on Delivery' : 'Payment pending'),
    status: o.status,
    stage: stageIndexFor(o.status),
    trackingNumber: o.trackingNumber || null,
    estimatedDeliveryDate: o.estimatedDeliveryDate || null,
  };
}

// Pulls the real, current status/tracking number for every order placed from
// this browser straight from the database — this is what powers "track your
// delivery" for customers without needing a login system.
async function refreshMyOrders(){
  const ids = guestOrderIds();
  for(const g of ids){
    try{
      const o = await api.getOrder(g.dbId);
      const mapped = mapBackendOrder(o);
      const idx = state.orders.findIndex(x=>x.dbId===o.id);
      if(idx>=0) state.orders[idx]=mapped; else state.orders.push(mapped);
    }catch(e){ /* couldn't refresh this one — keep whatever we already have locally */ }
  }
  state.orders.sort((a,b)=> new Date(b.date)-new Date(a.date));
}
async function refreshMyOrdersAndRender(){ await refreshMyOrders(); render(); toast('Order status refreshed'); }

async function processPayment(total){
  const btn=document.getElementById('payBtn');
  const resetBtn=()=>{ btn.disabled=false; btn.textContent = 'Pay '+fmt(total); };
  btn.disabled=true; btn.textContent='Processing…';

  const cd = state.customerDetails;
  const orderPayload = {
    customer: { name: cd.name, email: cd.email, phone: cd.mobile },
    address: { line1: cd.address, city: cd.city, state: cd.state, pincode: cd.pincode },
    items: state.cart.map(i=>({ productId: i.id, quantity: i.qty, color: i.color!=='default'?i.color:null, note: i.note||null })),
    paymentMethod: 'razorpay',
  };

  // Step 1 — always create the real order in the database first. This is
  // what makes the order show up in the admin dashboard and the customer's
  // "My Orders" tracking, before we even ask for payment.
  let order;
  try{
    order = await api.createOrder(orderPayload);
  }catch(e){
    toast(e.message || "Couldn't reach the server — please check your connection and try again.");
    resetBtn();
    return;
  }

  function finalizeOrder(paymentLabel){
    rememberGuestOrder(order.id, order.orderNumber);
    const localOrder = mapBackendOrder(order);
    // The create-order response doesn't include product names — fill them
    // in from the cart (still available here, before we clear it below).
    localOrder.items = state.cart.map(i=>{ const p=findProduct(i.id); return { id:i.id, name:p?p.name:'Item', qty:i.qty, price:p?p.price:0, color:i.color }; });
    localOrder.payment = paymentLabel;
    state.orders.unshift(localOrder);
    state.cart=[]; updateBadges();
    state.checkoutStep=1;
    location.hash='confirmation/'+order.orderNumber;
  }

  // Step 2 — online payment via Razorpay.
  try{
    const created = await api.createPaymentOrder({ amountInRupees: order.total, localOrderId: order.id });

    if(created.mock){
      // PAYMENTS_MODE=mock in backend/.env — simulates a successful payment
      // so the whole flow is testable before you have real Razorpay keys.
      const verified = await api.verifyPayment({
        razorpay_order_id: created.razorpayOrderId,
        razorpay_payment_id: 'mock_payment_id',
        razorpay_signature: 'mock_signature',
        localOrderId: order.id,
      });
      if(verified && verified.verified){ finalizeOrder('Paid (test mode)'); }
      else { toast('Payment could not be verified. Please try again.'); resetBtn(); }
      return;
    }

    if(typeof window.Razorpay==='undefined'){
      toast('Payment widget failed to load — check your internet connection and try again.');
      resetBtn();
      return;
    }

    // Real Razorpay Checkout widget.
    const rzp = new window.Razorpay({
      key: created.keyId,
      amount: created.amount,
      currency: 'INR',
      name: 'suja.crochet',
      description: 'Order '+order.orderNumber,
      order_id: created.razorpayOrderId,
      prefill: { name: cd.name, email: cd.email, contact: cd.mobile },
      theme: { color: '#8b5e3c' },
      handler: async function(response){
        try{
          const verified = await api.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            localOrderId: order.id,
          });
          if(verified && verified.verified){ finalizeOrder('Paid via Razorpay'); }
          else {
            toast('Payment could not be verified. Contact us with order ID '+order.orderNumber+'.');
            resetBtn();
          }
        }catch(e){
          toast('Payment verification failed. Contact us with order ID '+order.orderNumber+'.');
          resetBtn();
        }
      },
      modal: { ondismiss: function(){ toast('Payment cancelled.'); resetBtn(); } },
    });
    rzp.on('payment.failed', function(resp){
      toast('Payment failed: '+(resp.error?.description || 'please try again.'));
      resetBtn();
    });
    rzp.open();
  }catch(e){
    toast(e.message || 'Could not start payment. Please try again.');
    resetBtn();
  }
}

/* ============ CONFIRMATION & INVOICE ============ */
function renderConfirmation(){
  const order = state.orders.find(o=>o.id===state.params.id || o.orderNumber===state.params.id) || state.orders[0];
  if(!order) return `<div class="wrap section"><h2>No recent order found.</h2><a href="#shop" class="btn btn-primary" style="margin-top:16px;">Shop Now</a></div>`;
  
  const itemsHtml = (order.items || []).map(i => `
    <div class="invoice-item-row">
      <div style="display:flex;align-items:center;gap:12px;">
        <div>
          <div style="font-weight:600;color:var(--brown-dark);">${i.name || 'Handmade Item'}</div>
          <div style="font-size:12px;color:var(--ink-soft);">${i.color ? `Colour: ${i.color} · ` : ''}Qty: ${i.qty || 1}</div>
        </div>
      </div>
      <div style="font-weight:600;color:var(--brown-dark);">${fmt((i.price || 0) * (i.qty || 1))}</div>
    </div>
  `).join('');

  const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : (order.total > 999 ? 0 : 79);
  const subtotal = order.subtotal || (order.total - deliveryFee);

  return `
  <div class="wrap confirm-wrap">
    <div class="confirm-icon">🎉</div>
    <span class="eyebrow" style="color:#2e7d32;">Payment Verified &amp; Order Placed</span>
    <h1 style="margin:6px 0 10px;">Order Confirmation</h1>
    <p style="margin-top:4px;color:var(--ink-soft);">Thank you for supporting our small handmade business! A copy has been saved to your account.</p>
    
    <div class="invoice-card" id="invoiceCard">
      <div class="invoice-header">
        <div>
          <div style="font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--brown-dark);">suja.crochet</div>
          <div style="font-size:12px;color:var(--ink-soft);">Handmade in India · GST Exempt Small Business</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:700;color:var(--accent-dark);">INVOICE / RECEIPT</div>
          <div style="font-size:12px;color:var(--ink-soft);">Order: <b>#${order.orderNumber || order.id}</b></div>
          <div style="font-size:12px;color:var(--ink-soft);">${order.date || new Date().toLocaleDateString('en-IN')}</div>
        </div>
      </div>

      <div class="invoice-grid">
        <div>
          <div class="invoice-label">Customer Details</div>
          <div class="invoice-val"><b>${order.customerName || state.customerDetails.name || 'Valued Customer'}</b></div>
          <div class="invoice-val" style="font-size:12.5px;color:var(--ink-soft);">${order.customerEmail || state.customerDetails.email || ''}</div>
          <div class="invoice-val" style="font-size:12.5px;color:var(--ink-soft);">${order.customerPhone || state.customerDetails.mobile || ''}</div>
        </div>
        <div>
          <div class="invoice-label">Shipping Destination</div>
          <div class="invoice-val"><b>${order.address?.line1 || state.customerDetails.address || 'Standard Delivery'}</b></div>
          <div class="invoice-val" style="font-size:12.5px;color:var(--ink-soft);">${order.address?.city || state.customerDetails.city || ''}, ${order.address?.state || state.customerDetails.state || ''} - ${order.address?.pincode || state.customerDetails.pincode || ''}</div>
        </div>
      </div>

      <div class="invoice-items-box">
        <div class="invoice-items-head">
          <span>Item</span>
          <span>Amount</span>
        </div>
        ${itemsHtml}
      </div>

      <div class="invoice-summary">
        <div class="order-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="order-row"><span>Handmade Delivery</span><span>${deliveryFee === 0 ? '<b style="color:#2e7d32;">FREE</b>' : fmt(deliveryFee)}</span></div>
        <div class="order-row total" style="font-size:16px;font-weight:700;border-top:1px solid var(--beige);padding-top:8px;margin-top:8px;">
          <span>Grand Total</span>
          <span style="color:var(--brown-dark);">${fmt(order.total)}</span>
        </div>
        <div class="order-row" style="margin-top:6px;font-size:12.5px;">
          <span>Payment Status</span>
          <span class="status-chip" style="background:#e8f5e9;color:#2e7d32;font-size:11.5px;">${order.payment || 'Paid via Razorpay'}</span>
        </div>
        <div class="order-row" style="margin-top:4px;font-size:12.5px;">
          <span>Estimated Handcrafting Lead</span>
          <span><b>20–25 days</b></span>
        </div>
      </div>

      <div class="invoice-footer-note">
        🧵 Every piece is crafted individually with care. For updates or custom requests, WhatsApp us at <b>+91 9561742713</b> with your Order ID.
      </div>
    </div>

    <div class="invoice-actions no-print" style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Download Invoice</button>
      <a href="#account" class="btn btn-outline" onclick="setAccountTab('orders')">📦 Track Order</a>
      <a href="#shop" class="btn btn-outline">🛍️ Continue Shopping</a>
    </div>
  </div>
  ${footerHTML()}`;
}

/* ============ CUSTOMER AUTH & ACCOUNT ============ */
const customerAuth = {
  token: (function(){ try{ return localStorage.getItem('suja_customer_token'); }catch(e){ return null; } })(),
  user: (function(){ try{ return JSON.parse(localStorage.getItem('suja_customer_user')||'null'); }catch(e){ return null; } })(),
  tab: 'signin', // 'signin' | 'signup'
};

async function customerLogin(){
  const email = document.getElementById('cust_login_email')?.value.trim();
  const password = document.getElementById('cust_login_password')?.value;
  const errEl = document.getElementById('custAuthErr');
  if(!email || !password){ if(errEl) errEl.textContent='Please fill in both email and password.'; return; }
  try{
    const res = await api.login({ email, password });
    customerAuth.token = res.token;
    customerAuth.user = res.user;
    localStorage.setItem('suja_customer_token', res.token);
    localStorage.setItem('suja_customer_user', JSON.stringify(res.user));
    state.customerDetails.name = res.user.name || '';
    state.customerDetails.email = res.user.email || '';
    toast(`Welcome back, ${res.user.name}!`);
    await refreshMyOrders();
    render();
  }catch(e){
    if(errEl) errEl.textContent = e.message || 'Invalid credentials.';
  }
}

async function customerSignup(){
  const name = document.getElementById('cust_reg_name')?.value.trim();
  const email = document.getElementById('cust_reg_email')?.value.trim();
  const phone = document.getElementById('cust_reg_phone')?.value.trim();
  const password = document.getElementById('cust_reg_password')?.value;
  const errEl = document.getElementById('custAuthErr');
  if(!name || !email || !password){ if(errEl) errEl.textContent='Please fill in name, email and password.'; return; }
  try{
    const res = await api.signup({ name, email, phone, password });
    customerAuth.token = res.token;
    customerAuth.user = res.user;
    localStorage.setItem('suja_customer_token', res.token);
    localStorage.setItem('suja_customer_user', JSON.stringify(res.user));
    state.customerDetails.name = res.user.name;
    state.customerDetails.email = res.user.email;
    state.customerDetails.mobile = phone || '';
    toast(`Account created! Welcome, ${res.user.name}!`);
    render();
  }catch(e){
    if(errEl) errEl.textContent = e.message || 'Registration failed.';
  }
}

function customerLogout(){
  customerAuth.token = null;
  customerAuth.user = null;
  try{ localStorage.removeItem('suja_customer_token'); localStorage.removeItem('suja_customer_user'); }catch(e){}
  toast('Signed out successfully.');
  render();
}

let _accountTab='orders';
function setAccountTab(t){
  state.accountTab = t;
  _accountTab = t;
  render();
}

function saveAccountProfile(){
  const name = document.getElementById('acc_prof_name')?.value.trim();
  const email = document.getElementById('acc_prof_email')?.value.trim();
  const phone = document.getElementById('acc_prof_phone')?.value.trim();
  if(!name || !email){ toast('Please provide both name and email.'); return; }

  state.customerDetails.name = name;
  state.customerDetails.email = email;
  state.customerDetails.mobile = phone || '';

  if(customerAuth.user){
    customerAuth.user.name = name;
    customerAuth.user.email = email;
    customerAuth.user.phone = phone || '';
    try{ localStorage.setItem('suja_customer_user', JSON.stringify(customerAuth.user)); }catch(e){}
  }
  try{ localStorage.setItem('suja_customer_details', JSON.stringify(state.customerDetails)); }catch(e){}
  toast('Profile details updated!');
  render();
}

function saveAccountAddress(){
  const address = document.getElementById('acc_addr_line')?.value.trim();
  const city = document.getElementById('acc_addr_city')?.value.trim();
  const stateVal = document.getElementById('acc_addr_state')?.value.trim();
  const pincode = document.getElementById('acc_addr_pincode')?.value.trim();

  if(!address || !city || !stateVal || !pincode){ toast('Please complete all address fields.'); return; }

  state.customerDetails.address = address;
  state.customerDetails.city = city;
  state.customerDetails.state = stateVal;
  state.customerDetails.pincode = pincode;

  try{ localStorage.setItem('suja_customer_details', JSON.stringify(state.customerDetails)); }catch(e){}
  toast('Address saved successfully!');
  render();
}

function renderAccount(){
  // If not logged in, render the Auth / Guest Portal
  if(!customerAuth.token){
    return `
    <div class="page-head wrap"><span class="eyebrow">Customer Portal</span><h1>Sign In or Create Account</h1></div>
    <div class="wrap section" style="padding-top:6px;max-width:480px;">
      <div class="admin-nav" style="margin-bottom:20px;justify-content:center;">
        <button class="${customerAuth.tab==='signin'?'active':''}" onclick="customerAuth.tab='signin'; render()">Sign In</button>
        <button class="${customerAuth.tab==='signup'?'active':''}" onclick="customerAuth.tab='signup'; render()">Create Account</button>
        <button class="${customerAuth.tab==='guest'?'active':''}" onclick="customerAuth.tab='guest'; render()">Guest Order Lookup</button>
      </div>

      <div class="admin-card">
        ${customerAuth.tab==='signin' ? `
          <h3 style="margin-bottom:14px;">Sign In to Your Account</h3>
          <label class="field full"><span>Email</span><input type="email" id="cust_login_email" placeholder="your@email.com"></label>
          <label class="field full"><span>Password</span><input type="password" id="cust_login_password" placeholder="••••••••"></label>
          <p id="custAuthErr" style="color:#c0392b;font-size:13px;min-height:18px;margin-top:4px;"></p>
          <button class="btn btn-primary btn-full" onclick="customerLogin()">Sign In</button>
        ` : customerAuth.tab==='signup' ? `
          <h3 style="margin-bottom:14px;">Create a New Account</h3>
          <label class="field full"><span>Full Name</span><input type="text" id="cust_reg_name" placeholder="Your Name"></label>
          <label class="field full"><span>Email</span><input type="email" id="cust_reg_email" placeholder="your@email.com"></label>
          <label class="field full"><span>Mobile Number</span><input type="tel" id="cust_reg_phone" placeholder="10-digit mobile"></label>
          <label class="field full"><span>Password</span><input type="password" id="cust_reg_password" placeholder="Choose a password"></label>
          <p id="custAuthErr" style="color:#c0392b;font-size:13px;min-height:18px;margin-top:4px;"></p>
          <button class="btn btn-primary btn-full" onclick="customerSignup()">Create Account</button>
        ` : `
          <h3 style="margin-bottom:14px;">Track Guest Order</h3>
          <p style="font-size:13px;color:var(--ink-soft);margin-bottom:14px;">Placed an order without an account? Enter your Order Number or ID below.</p>
          <label class="field full"><span>Order Number / ID</span><input type="text" id="guest_order_input" placeholder="e.g. SUJA482913"></label>
          <button class="btn btn-primary btn-full" onclick="lookupGuestOrder()">Track Order</button>
        `}
      </div>
    </div>
    ${footerHTML()}`;
  }

  const currentTab = state.accountTab || _accountTab || 'orders';
  const tabs=[['orders','📦 My Orders'],['wishlist','♡ Wishlist'],['profile','👤 Profile'],['addresses','📍 Saved Address']];
  let content='';
  if(currentTab==='orders'){
    content = state.orders.length? `
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
        <button class="btn btn-outline btn-sm" onclick="refreshMyOrdersAndRender()">🔄 Refresh Status</button>
      </div>
      ${state.orders.map(o=>{
      const cancelled = o.status==='cancelled';
      return `
      <div class="order-list-item">
        <div class="olist-top">
          <div><b>${o.id || o.orderNumber}</b> · ${o.date || new Date().toLocaleDateString('en-IN')}</div>
          <span class="status-chip">${cancelled?'Cancelled':ORDER_STAGE_LABELS[o.stage||0]}</span>
        </div>
        <div style="font-size:13.5px;color:var(--ink-soft);margin-bottom:4px;">${o.items?.length||1} item(s) · ${fmt(o.total)} · ${o.payment||'Paid'}</div>
        ${o.trackingNumber?`<div style="font-size:13.5px;color:var(--ink-soft);margin-bottom:10px;">📦 Courier Tracking: <b>${o.trackingNumber}</b></div>`:'<div style="margin-bottom:10px;"></div>'}
        ${!cancelled?`<div class="track-row">
          ${ORDER_STAGE_LABELS.map((s,i)=>`<div class="track-step ${i<=(o.stage||0)?'done':''}"><div class="track-dot"></div><div class="track-label">${s}</div></div>`).join('')}
        </div>`:''}
        <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="location.hash='confirmation/'+(o.orderNumber||o.id)">View Invoice</button>
          <button class="btn btn-outline btn-sm" onclick="openReportIssue('${o.id || o.orderNumber}')">Report an Issue</button>
        </div>
      </div>`;
    }).join('')}` : `<div class="empty-state"><div class="emoji">📦</div><h3>No orders yet</h3><p>Your placed orders will show up here.</p><a href="#shop" class="btn btn-primary" style="margin-top:14px;">Browse Products</a></div>`;
  } else if(currentTab==='wishlist'){
    const items=PRODUCTS.filter(p=>state.wishlist.includes(p.id));
    content = items.length? `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3 style="margin:0;">Saved Items (${items.length})</h3>
        <a href="#shop" class="link-btn">Explore More</a>
      </div>
      <div class="prod-grid">${items.map(productCard).join('')}</div>
    ` : `
      <div class="empty-state" style="padding:40px 20px;">
        <div class="emoji">♡</div>
        <h3>Your wishlist is empty</h3>
        <p>Tap the heart icon on any product in our shop to save it here.</p>
        <a href="#shop" class="btn btn-primary" style="margin-top:16px;">Explore Collections</a>
      </div>
    `;
  } else if(currentTab==='profile'){
    const u = customerAuth.user || {};
    const name = u.name || state.customerDetails.name || '';
    const email = u.email || state.customerDetails.email || '';
    const mobile = u.phone || state.customerDetails.mobile || '';
    content = `
      <div class="admin-card" style="max-width:560px;">
        <h3 style="margin-bottom:16px;">Account Profile</h3>
        <div class="form-grid">
          <label class="field full">
            <span>Full Name</span>
            <input type="text" id="acc_prof_name" value="${name}" placeholder="Your Name">
          </label>
          <label class="field full">
            <span>Email Address</span>
            <input type="email" id="acc_prof_email" value="${email}" placeholder="your@email.com">
          </label>
          <label class="field full">
            <span>Mobile Phone</span>
            <input type="tel" id="acc_prof_phone" value="${mobile}" placeholder="10-digit mobile number">
          </label>
        </div>
        <div style="display:flex;gap:12px;margin-top:14px;flex-wrap:wrap;align-items:center;">
          <button class="btn btn-primary btn-sm" onclick="saveAccountProfile()">Save Profile</button>
          <button class="btn btn-outline btn-sm" onclick="customerLogout()">Sign Out</button>
        </div>
      </div>`;
  } else if(currentTab==='addresses'){
    const cd=state.customerDetails;
    const hasAddr = Boolean(cd.address && cd.city && cd.state && cd.pincode);
    content = `
      <div class="admin-card" style="max-width:580px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="margin:0;">Shipping Address</h3>
          ${hasAddr ? `<span class="status-chip" style="background:#e8f5e9;color:#2e7d32;">Saved Default</span>` : ''}
        </div>
        <div class="form-grid">
          <label class="field full">
            <span>Street Address / House / Flat</span>
            <input type="text" id="acc_addr_line" value="${cd.address||''}" placeholder="House no., Building, Street area">
          </label>
          <label class="field">
            <span>City</span>
            <input type="text" id="acc_addr_city" value="${cd.city||''}" placeholder="City">
          </label>
          <label class="field">
            <span>State</span>
            <input type="text" id="acc_addr_state" value="${cd.state||''}" placeholder="State">
          </label>
          <label class="field full">
            <span>PIN Code</span>
            <input type="text" id="acc_addr_pincode" value="${cd.pincode||''}" placeholder="6-digit PIN code">
          </label>
        </div>
        <div style="margin-top:14px;">
          <button class="btn btn-primary btn-sm" onclick="saveAccountAddress()">Save Address</button>
        </div>
        <p style="font-size:12.5px;color:var(--ink-soft);margin-top:14px;">
          ✨ Saved address is automatically applied when placing future orders.
        </p>
      </div>`;
  }

  return `
  <div class="page-head wrap">
    <span class="eyebrow">Customer Account</span>
    <h1>Welcome, ${customerAuth.user?.name || state.customerDetails.name || 'Friend'}</h1>
    <p style="margin-top:4px;">Signed in as <b>${customerAuth.user?.email || state.customerDetails.email || ''}</b> · <a href="#" onclick="customerLogout();return false;" style="text-decoration:underline;">Sign Out</a></p>
  </div>
  <div class="wrap section" style="padding-top:6px;">
    <div class="acc-layout">
      <div class="acc-nav">
        ${tabs.map(([id,label])=>`<button class="${currentTab===id?'active':''}" onclick="setAccountTab('${id}')">${label}</button>`).join('')}
      </div>
      <div>${content}</div>
    </div>
  </div>
  ${footerHTML()}`;
}

async function lookupGuestOrder(){
  const input = document.getElementById('guest_order_input')?.value.trim();
  if(!input){ toast('Please enter an order number or ID.'); return; }
  try{
    const order = await api.getOrder(input);
    rememberGuestOrder(order.id, order.orderNumber);
    await refreshMyOrders();
    location.hash = 'confirmation/' + (order.orderNumber || order.id);
  }catch(e){
    toast('Order not found. Please verify the ID.');
  }
}

/* ============ DEFECT / RETURN REQUEST MODAL ============ */
let _issueOrderId = null;
let _returnProofUrls = [];

function openReportIssue(orderId){
  _issueOrderId = orderId;
  _returnProofUrls = [];
  const modal = document.createElement('div');
  modal.id = 'issueModal';
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h3>Report Order Issue (Defect Claim)</h3>
        <button style="font-size:20px;cursor:pointer;" onclick="document.getElementById('issueModal').remove()">×</button>
      </div>
      <p style="font-size:13px;color:var(--ink-soft);margin-bottom:14px;">Order: <b>#${orderId}</b> · Please describe the defect and upload clear unboxing photos/video proof.</p>
      
      <label class="field full"><span>Description of Defect</span><textarea id="issue_desc" rows="3" placeholder="Describe the damage, flaw, or issue in detail…"></textarea></label>
      
      <label class="field full">
        <span>Upload Photos / Unboxing Proof (Required)</span>
        <input type="file" id="issue_file" accept="image/png,image/jpeg,image/webp" onchange="uploadReturnProof(this)" style="margin-top:6px;">
        <div id="issue_proof_preview" style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;"></div>
      </label>

      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
        <button class="btn btn-outline" onclick="document.getElementById('issueModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitReturnIssue()">Submit Report</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function uploadReturnProof(input){
  if(!input.files || !input.files[0]) return;
  const file = input.files[0];
  try{
    toast('Uploading proof photo…');
    const res = await api.uploadFile(file);
    _returnProofUrls.push(res.url);
    const container = document.getElementById('issue_proof_preview');
    if(container){
      container.innerHTML = _returnProofUrls.map(u => `<img src="${u}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--beige);">`).join('');
    }
    toast('Photo uploaded successfully!');
  }catch(e){
    toast(e.message || 'Upload failed');
  }
}

async function submitReturnIssue(){
  const desc = document.getElementById('issue_desc')?.value.trim();
  if(!desc){ toast('Please describe the issue.'); return; }
  if(!_returnProofUrls.length){ toast('Please upload at least one defect proof image.'); return; }

  try{
    // Submit report to backend
    await api.submitReturnRequest({
      orderId: _issueOrderId,
      description: desc,
      proofUrls: _returnProofUrls,
    });
    document.getElementById('issueModal')?.remove();
    toast('Defect report submitted. Our team will review it shortly.');
  }catch(e){
    toast(e.message || 'Failed to submit report. Please contact us via WhatsApp.');
  }
}

/* ============ CUSTOM ORDERS ============ */
let _uploadedCustomImageUrl = null;

function renderCustom(){
  return `
  <div class="wrap section">
    <div class="custom-hero">
      <span class="eyebrow">Personalised for you</span>
      <h1 style="margin:10px 0 12px;">Made Just for You</h1>
      <p style="max-width:520px;margin:0 auto;">Tell us what you're imagining — a birthday gift, a wedding bouquet, a custom hair accessory — and we'll bring it to life, stitch by stitch.</p>
    </div>
    <div style="max-width:640px;margin:0 auto;" id="customFormWrap">
      <div class="form-grid">
        <label class="field"><span>Name</span><input type="text" id="co_name" value="${state.customerDetails.name||''}"></label>
        <label class="field"><span>Email</span><input type="email" id="co_email" value="${state.customerDetails.email||''}"></label>
        <label class="field"><span>Mobile Number</span><input type="tel" id="co_mobile" value="${state.customerDetails.mobile||''}"></label>
        <label class="field"><span>Product Type</span>
          <select id="co_type"><option>Bouquet</option><option>Hair Accessory</option><option>Decor Item</option><option>Gift Hamper</option><option>Other</option></select>
        </label>
        <label class="field"><span>Preferred Colour</span><input type="text" id="co_color" placeholder="e.g. blush pink, cream"></label>
        <label class="field"><span>Size</span><input type="text" id="co_size" placeholder="e.g. small, medium"></label>
        <label class="field"><span>Quantity</span><input type="number" id="co_qty" min="1" value="1"></label>
        <label class="field"><span>Occasion</span><input type="text" id="co_occasion" placeholder="Birthday, anniversary, wedding…"></label>
        <label class="field full"><span>Budget</span><input type="text" id="co_budget" placeholder="e.g. ₹800–1200"></label>
        <label class="field full"><span>Custom Requirements</span><textarea id="co_reqs" rows="4" placeholder="Describe exactly what you'd like…"></textarea></label>
        
        <label class="field full">
          <span>Upload Reference Photo (Optional)</span>
          <input type="file" id="co_file_input" accept="image/png,image/jpeg,image/webp" style="display:none;" onchange="handleCustomOrderFileUpload(this)">
          <div class="upload-box" onclick="document.getElementById('co_file_input').click()" id="co_upload_box">
            📎 Click to upload a reference photo (JPG, PNG, WebP)
          </div>
          <div id="co_preview_box" style="margin-top:10px;"></div>
        </label>

        <label class="field full"><span>Preferred Delivery Date</span><input type="date" id="co_date"></label>
      </div>
      <button class="btn btn-primary btn-full" onclick="submitCustomOrder()">Send Custom Request</button>
    </div>
  </div>
  ${footerHTML()}`;
}

async function handleCustomOrderFileUpload(input){
  if(!input.files || !input.files[0]) return;
  const file = input.files[0];
  try{
    toast('Uploading reference photo…');
    const res = await api.uploadFile(file);
    _uploadedCustomImageUrl = res.url;
    const previewBox = document.getElementById('co_preview_box');
    if(previewBox){
      previewBox.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:8px 12px;background:var(--offwhite);border-radius:8px;border:1px solid var(--beige);">
          <img src="${res.url}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">
          <span style="font-size:12.5px;color:var(--brown-dark);">Photo attached: <b>${res.filename}</b></span>
          <button style="margin-left:auto;color:#c0392b;font-weight:700;cursor:pointer;" onclick="_uploadedCustomImageUrl=null;document.getElementById('co_preview_box').innerHTML='';">✕</button>
        </div>
      `;
    }
    toast('Reference photo attached!');
  }catch(e){
    toast(e.message || 'Photo upload failed');
  }
}

async function submitCustomOrder(){
  const name=document.getElementById('co_name').value.trim();
  const email=document.getElementById('co_email').value.trim();
  const mobile=document.getElementById('co_mobile').value.trim();
  const productType=document.getElementById('co_type').value;
  if(!name || !email || !mobile){ toast('Please add your name, email and mobile number'); return; }

  const payload = {
    name, email, phone: mobile, productType,
    preferredColor: document.getElementById('co_color').value.trim(),
    size: document.getElementById('co_size').value.trim(),
    quantity: Number(document.getElementById('co_qty').value)||1,
    occasion: document.getElementById('co_occasion').value.trim(),
    budget: document.getElementById('co_budget').value.trim(),
    requirements: document.getElementById('co_reqs').value.trim(),
    referenceImageUrl: _uploadedCustomImageUrl,
    preferredDeliveryDate: document.getElementById('co_date').value || null,
  };

  const btn=document.querySelector('#customFormWrap .btn-primary');
  if(btn){ btn.disabled=true; btn.textContent='Sending…'; }

  let saved;
  try{
    saved = await api.submitCustomOrder(payload);
    _uploadedCustomImageUrl = null;
  }catch(e){
    toast(e.message || "Couldn't send your request — please check your connection and try again.");
    if(btn){ btn.disabled=false; btn.textContent='Send Custom Request'; }
    return;
  }

  document.getElementById('customFormWrap').innerHTML = `
    <div class="thank-you">
      <div style="font-size:44px;margin-bottom:12px;">🧵</div>
      <h2>Thank you!</h2>
      <p style="margin-top:10px;">Your request has been received and saved to our system — reference <b>#${(saved.id||'').slice(-8).toUpperCase()}</b>.</p>
      <p style="margin-top:6px;color:var(--ink-soft);font-size:14px;">Our team reviews every custom request in the admin dashboard and will reach out to you at <b>${email}</b> or <b>${mobile}</b> within 24–48 hours to confirm details, pricing and delivery date before we start crocheting.</p>
      <a href="#shop" class="btn btn-primary" style="margin-top:20px;">Browse the Shop Meanwhile</a>
    </div>`;
}

/* ============ ABOUT ============ */
function renderAbout(){
  return `
  <div class="wrap section">
    <div class="about-grid">
      <div>
        <span class="eyebrow">Our Story</span>
        <h1 style="margin:10px 0 16px;">From Gifting to Something More</h1>
        <p style="margin-bottom:14px;">My mom started crochet simply because she loved making things with her hands. She would make little crochet pieces and gift them to family and friends.</p>
        <p style="margin-bottom:14px;">People started noticing them, appreciating the work, and asking if she could make something for them too. That small encouragement slowly turned into an idea — why not turn something she loved doing into a small business?</p>
        <p style="margin-bottom:14px;">And that's how <b style="color:var(--brown-dark);">suja.crochet</b> began.</p>
        <p style="margin-bottom:14px;">Today, every piece is still handmade with the same care, patience and love it started with. What makes us happiest is seeing our handmade pieces become gifts, decorations and little moments of happiness for our customers.</p>
        <p style="font-weight:700;color:var(--brown-dark);">Thank you for supporting our small business. ❤️</p>
      </div>
      <div class="about-photo"><img src="/assets/products/sunflower-keychain.jpeg" alt="Suja holding a handmade crochet sunflower"></div>
    </div>
  </div>
  <section class="section" style="background:var(--offwhite);">
    <div class="wrap">
      <div class="section-head"><span class="eyebrow">Community</span><h2>Loved by Our Customers</h2></div>
      <div class="rev-grid">
        ${REVIEWS.map(r=>`
          <div class="rev-card">
            <div class="rev-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
            <p class="rev-text">"${r.text}"</p>
            <div class="rev-name">${r.name}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>
  ${footerHTML()}`;
}

/* ============ CONTACT ============ */
function renderContact(){
  return `
  <div class="page-head wrap"><span class="eyebrow">Get in touch</span><h1>Contact Us</h1><p>Questions about an order or a custom piece? We'd love to hear from you.</p></div>
  <div class="wrap section" style="padding-top:6px;max-width:640px;" id="contactFormWrap">
    <div class="admin-card" style="margin-bottom:20px;display:flex;flex-direction:column;gap:10px;">
      <p>📧 <b>Email:</b> <a href="mailto:sujacrochet@gmail.com" style="text-decoration:underline;">sujacrochet@gmail.com</a></p>
      <p>📱 <b>WhatsApp / Phone:</b> <a href="https://wa.me/919561742713?text=Hi%20Suja%20Crochet,%20I%20have%20an%20inquiry" target="_blank" style="text-decoration:underline;">+91 9561742713</a></p>
      <p>📷 <b>Instagram:</b> <a href="https://www.instagram.com/suja.crochet?igsh=cXN1N3E1bGhsbGlk" target="_blank" style="text-decoration:underline;">@suja.crochet</a></p>
    </div>
    <label class="field"><span>Name</span><input type="text" id="ct_name" value="${state.customerDetails.name||''}"></label>
    <label class="field"><span>Email</span><input type="email" id="ct_email" value="${state.customerDetails.email||''}"></label>
    <label class="field"><span>Message</span><textarea id="ct_message" rows="4"></textarea></label>
    <button class="btn btn-primary btn-full" onclick="submitContactMessage()">Send Message</button>
  </div>
  ${footerHTML()}`;
}
async function submitContactMessage(){
  const name=document.getElementById('ct_name').value.trim();
  const email=document.getElementById('ct_email').value.trim();
  const message=document.getElementById('ct_message').value.trim();
  if(!name || !email || !message){ toast('Please fill in your name, email and message.'); return; }
  const btn=document.querySelector('#contactFormWrap .btn-primary');
  if(btn){ btn.disabled=true; btn.textContent='Sending…'; }
  try{
    await api.submitContactMessage({ name, email, message });
    document.getElementById('contactFormWrap').innerHTML = `
      <div class="thank-you">
        <div style="font-size:44px;margin-bottom:12px;">💌</div>
        <h2>Message received!</h2>
        <p style="margin-top:10px;color:var(--ink-soft);font-size:14px;">It's saved in our system and our team will reply to <b>${email}</b> within 24–48 hours.</p>
        <a href="#shop" class="btn btn-primary" style="margin-top:20px;">Browse the Shop Meanwhile</a>
      </div>`;
  }catch(e){
    toast(e.message || "Couldn't send your message — please check your connection and try again.");
    if(btn){ btn.disabled=false; btn.textContent='Send Message'; }
  }
}

/* ============ ADMIN PORTAL ============ */
const adminState = {
  token: (function(){ try{ return localStorage.getItem('suja_admin_token'); }catch(e){ return null; } })(),
  user: null, dashboard: null, products: [], orders: [], customOrders: null, contactMessages: null, returnRequests: null, reviews: null,
  loaded: false, loading: false,
};

async function adminLogin(){
  const email=document.getElementById('admin_email').value.trim();
  const password=document.getElementById('admin_password').value;
  const errEl=document.getElementById('adminLoginErr');
  try{
    const res = await api.login({ email, password });
    if(res.user.role!=='admin'){ errEl.textContent='This account does not have admin access.'; return; }
    adminState.token=res.token; adminState.user=res.user;
    try{ localStorage.setItem('suja_admin_token', res.token); }catch(e){}
    await loadAdminData();
    render();
  }catch(e){ errEl.textContent = e.message || 'Invalid email or password.'; }
}
function adminLogout(){
  adminState.token=null; adminState.user=null; adminState.dashboard=null; adminState.orders=[]; adminState.loaded=false;
  try{ localStorage.removeItem('suja_admin_token'); }catch(e){}
  render();
}
async function loadAdminData(){
  if(!adminState.token || adminState.loading) return;
  adminState.loading=true;
  try{
    const [dashboard, products, orders, customOrders, contactMessages, returnRequests, reviews] = await Promise.all([
      api.adminDashboard(adminState.token),
      api.adminGetProducts(adminState.token),
      api.adminGetOrders(adminState.token),
      api.adminGetCustomOrders(adminState.token),
      api.adminGetContactMessages(adminState.token),
      api.adminGetReturnRequests(adminState.token),
      api.adminGetReviews(adminState.token),
    ]);
    adminState.dashboard=dashboard; adminState.products=products; adminState.orders=orders; adminState.customOrders=customOrders;
    adminState.contactMessages=contactMessages; adminState.returnRequests=returnRequests; adminState.reviews=reviews;
    adminState.loaded=true;
  }catch(e){
    adminLogout();
    toast('Please sign in again.');
  }
  adminState.loading=false;
}

function getStockBadge(stock, isActive){
  if(!isActive) return `<span class="status-chip" style="background:#fbe9e7;color:#c62828;">Archived</span>`;
  if(stock <= 0) return `<span class="status-chip" style="background:#ffebee;color:#b71c1c;">Out of Stock</span>`;
  if(stock <= 5) return `<span class="status-chip" style="background:#fff3e0;color:#e65100;">Only ${stock} left</span>`;
  return `<span class="status-chip" style="background:#e8f5e9;color:#2e7d32;">In Stock (${stock})</span>`;
}

async function adminSaveProduct(id){
  const price = Number(document.getElementById('p_price_'+id)?.value);
  const mrp = Number(document.getElementById('p_mrp_'+id)?.value) || null;
  const stock = Number(document.getElementById('p_stock_'+id)?.value);
  const isActive = document.getElementById('p_active_'+id)?.checked;
  try{
    await api.adminUpdateProduct(adminState.token, id, { price, mrp, stock, isActive });
    toast('Product updated!');
    await loadAdminData();
    await loadFromBackend();
    render();
  }catch(e){ toast(e.message || 'Update failed'); }
}

async function adminUpdateOrderStatus(orderId){
  const status=document.getElementById('status_'+orderId).value;
  const trackingNumber=document.getElementById('track_'+orderId).value.trim();
  try{
    await api.adminUpdateOrder(adminState.token, orderId, { status, trackingNumber: trackingNumber||undefined });
    toast('Order updated');
    await loadAdminData(); render();
  }catch(e){ toast(e.message || 'Update failed'); }
}

async function adminUpdateCustomOrderStatus(id){
  const status=document.getElementById('custom_status_'+id).value;
  try{
    await api.adminUpdateCustomOrder(adminState.token, id, { status });
    toast('Custom request updated');
    await loadAdminData(); render();
  }catch(e){ toast(e.message || 'Update failed'); }
}

async function adminUpdateContactMessageStatus(id){
  const status=document.getElementById('msg_status_'+id).value;
  try{
    await api.adminUpdateContactMessage(adminState.token, id, { status });
    toast('Message updated');
    await loadAdminData(); render();
  }catch(e){ toast(e.message || 'Update failed'); }
}

async function adminUpdateReturnStatus(id){
  const status=document.getElementById('return_status_'+id).value;
  const adminNotes=document.getElementById('return_notes_'+id)?.value.trim();
  try{
    await api.adminUpdateReturnRequest(adminState.token, id, { status, adminNotes });
    toast('Return request updated');
    await loadAdminData(); render();
  }catch(e){ toast(e.message || 'Update failed'); }
}

async function adminUpdateReviewStatus(id, status){
  try{
    await api.adminUpdateReview(adminState.token, id, { status });
    toast('Review '+status);
    await loadAdminData(); render();
  }catch(e){ toast(e.message || 'Update failed'); }
}

const ADMIN_STATUS_OPTIONS = [...ORDER_STAGES, 'cancelled'];

function renderAdminLogin(){
  return `
  <div class="page-head wrap"><span class="eyebrow">Internal</span><h1>Admin Sign In</h1></div>
  <div class="wrap section" style="padding-top:6px;max-width:420px;">
    <label class="field full"><span>Email</span><input type="email" id="admin_email" value="admin@sujacrochet.com"></label>
    <label class="field full"><span>Password</span><input type="password" id="admin_password"></label>
    <p id="adminLoginErr" style="color:#c0392b;font-size:13px;min-height:18px;"></p>
    <button class="btn btn-primary btn-full" onclick="adminLogin()">Sign In</button>
    <p style="margin-top:14px;font-size:13px;color:var(--ink-soft);">Default admin account: <b>admin@sujacrochet.com</b> / <b>admin123</b>.</p>
  </div>
  ${footerHTML()}`;
}

function renderAdmin(){
  if(!adminState.token) return renderAdminLogin();
  if(!adminState.loaded && !adminState.loading){ loadAdminData().then(render); }

  const view=state.adminView;
  const nav=[['dashboard','Dashboard'],['products','Products & Stock'],['orders','Orders'],['custom','Custom Requests'],['messages','Messages'],['returns','Defects / Returns'],['reviews','Reviews']];
  let content='';
  const d = adminState.dashboard;

  if(view==='dashboard'){
    content = !d ? `<p>Loading…</p>` : `
    <div class="kpi-row">
      <div class="kpi"><div class="num">${d.productCount}</div><div class="lbl">Active Products</div></div>
      <div class="kpi"><div class="num">${d.orderCount}</div><div class="lbl">Total Orders</div></div>
      <div class="kpi"><div class="num">${fmt(d.revenue)}</div><div class="lbl">Total Revenue</div></div>
      <div class="kpi"><div class="num">${d.pendingCustomOrders}</div><div class="lbl">Pending Custom Requests</div></div>
    </div>
    <div class="admin-card"><p>Real-time database status from <code>backend/prisma/dev.db</code> via <code>/api/admin/*</code>. All changes saved directly to the database.</p></div>`;
  } else if(view==='products'){
    const prods = adminState.products.length ? adminState.products : PRODUCTS;
    content=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <h3>Product &amp; Stock Manager (${prods.length})</h3>
    </div>
    <div style="overflow-x:auto;">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price (₹)</th>
          <th>MRP (₹)</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Active</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${prods.map(p=>{
          const stock = p.stock !== undefined ? p.stock : 20;
          const isActive = p.isActive !== undefined ? p.isActive : true;
          return `
          <tr>
            <td style="max-width:200px;">
              <div style="font-weight:600;color:var(--brown-dark);">${p.name}</div>
            </td>
            <td>${catName(p.cat || p.categoryId)}</td>
            <td><input type="number" id="p_price_${p.id}" value="${p.price}" style="width:75px;padding:4px 6px;"></td>
            <td><input type="number" id="p_mrp_${p.id}" value="${p.mrp||''}" placeholder="—" style="width:75px;padding:4px 6px;"></td>
            <td><input type="number" id="p_stock_${p.id}" value="${stock}" style="width:65px;padding:4px 6px;"></td>
            <td>${getStockBadge(stock, isActive)}</td>
            <td><input type="checkbox" id="p_active_${p.id}" ${isActive?'checked':''}></td>
            <td><button class="btn btn-primary btn-sm" onclick="adminSaveProduct('${p.id}')">Save</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>`;
  } else if(view==='orders'){
    content = adminState.orders.length? `
    <div style="overflow-x:auto;">
    <table><thead><tr><th>Order</th><th>Customer</th><th>Delivery Address</th><th>Amount</th><th>Payment</th><th>Status</th><th>Courier AWB</th><th></th></tr></thead>
    <tbody>${adminState.orders.map(o=>{
      const payment = o.payments?.[0];
      const paymentLabel = payment?.status==='paid' ? 'Paid':'Pending';
      return `<tr>
        <td><b>${o.orderNumber}</b><br><span style="font-size:11.5px;color:var(--ink-soft);">${new Date(o.createdAt).toLocaleDateString('en-IN')}</span></td>
        <td>${o.customerName}<br><span style="font-size:11.5px;color:var(--ink-soft);">${o.customerEmail||''}<br>${o.customerPhone||''}</span></td>
        <td style="font-size:12px;max-width:180px;">${o.shippingLine1||''}, ${o.shippingCity||''}, ${o.shippingState||''} - ${o.shippingPincode||''}</td>
        <td><b>${fmt(o.total)}</b></td>
        <td><span class="status-chip" style="${paymentLabel==='Paid'?'background:#e8f5e9;color:#2e7d32;':'background:#fff3e0;color:#e65100;'}">${paymentLabel}</span></td>
        <td><select id="status_${o.id}">${ADMIN_STATUS_OPTIONS.map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s.replace(/_/g,' ')}</option>`).join('')}</select></td>
        <td><input type="text" id="track_${o.id}" value="${o.trackingNumber||''}" placeholder="e.g. BlueDart 4892" style="width:120px;padding:4px 6px;"></td>
        <td><button class="btn btn-primary btn-sm" onclick="adminUpdateOrderStatus('${o.id}')">Update</button></td>
      </tr>`;
    }).join('')}</tbody></table></div>`
    : `<p>No orders in the database yet — place one from the storefront to see it appear here.</p>`;
  } else if(view==='custom'){
    content = !adminState.customOrders ? `<p>Loading…</p>` : (adminState.customOrders.length ? `
    <div style="overflow-x:auto;">
    <table><thead><tr><th>Received</th><th>Customer</th><th>Request Details</th><th>Reference Photo</th><th>Status</th><th></th></tr></thead>
    <tbody>${adminState.customOrders.map(c=>`<tr>
      <td>${new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
      <td><b>${c.name}</b><br><span style="font-size:11.5px;color:var(--ink-soft);">${c.email}<br>${c.phone}</span></td>
      <td style="max-width:260px;"><b>${c.productType}</b>${c.preferredColor?` · ${c.preferredColor}`:''}${c.budget?` · ${c.budget}`:''}<br><span style="font-size:11.5px;color:var(--ink-soft);">${(c.requirements||'').slice(0,80)}</span></td>
      <td>${c.referenceImageUrl ? `<a href="${c.referenceImageUrl}" target="_blank"><img src="${c.referenceImageUrl}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;border:1px solid var(--beige);"></a>` : 'None'}</td>
      <td><select id="custom_status_${c.id}">${['new','reviewing','accepted','in_progress','completed','rejected'].map(s=>`<option value="${s}" ${c.status===s?'selected':''}>${s.replace(/_/g,' ')}</option>`).join('')}</select></td>
      <td><button class="btn btn-primary btn-sm" onclick="adminUpdateCustomOrderStatus('${c.id}')">Update</button></td>
    </tr>`).join('')}</tbody></table></div>`
    : `<p>No custom requests yet.</p>`);
  } else if(view==='messages'){
    content = !adminState.contactMessages ? `<p>Loading…</p>` : (adminState.contactMessages.length ? `
    <div style="overflow-x:auto;">
    <table><thead><tr><th>Received</th><th>From</th><th>Message</th><th>Status</th><th></th></tr></thead>
    <tbody>${adminState.contactMessages.map(m=>`<tr>
      <td>${new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
      <td><b>${m.name}</b><br><span style="font-size:11.5px;color:var(--ink-soft);">${m.email}</span></td>
      <td style="max-width:320px;">${m.message}</td>
      <td><select id="msg_status_${m.id}">${['new','read','replied'].map(s=>`<option value="${s}" ${m.status===s?'selected':''}>${s}</option>`).join('')}</select></td>
      <td><button class="btn btn-primary btn-sm" onclick="adminUpdateContactMessageStatus('${m.id}')">Update</button></td>
    </tr>`).join('')}</tbody></table></div>`
    : `<p>No messages yet.</p>`);
  } else if(view==='returns'){
    content = !adminState.returnRequests ? `<p>Loading…</p>` : (adminState.returnRequests.length ? `
    <div style="overflow-x:auto;">
    <table><thead><tr><th>Date</th><th>Order ID</th><th>Customer Defect Description</th><th>Proof Photos</th><th>Status</th><th>Admin Notes</th><th></th></tr></thead>
    <tbody>${adminState.returnRequests.map(r=>{
      let proofs = [];
      try{ proofs = JSON.parse(r.proofUrlsJson || '[]'); }catch(e){}
      return `<tr>
        <td>${new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
        <td><b>#${r.order?.orderNumber || r.orderId}</b></td>
        <td style="max-width:240px;">${r.description}</td>
        <td>${proofs.map(u=>`<a href="${u}" target="_blank"><img src="${u}" style="width:36px;height:36px;object-fit:cover;border-radius:4px;margin-right:4px;"></a>`).join('') || '—'}</td>
        <td><select id="return_status_${r.id}">${['submitted','approved','rejected','more_info_needed','resolved'].map(s=>`<option value="${s}" ${r.status===s?'selected':''}>${s.replace(/_/g,' ')}</option>`).join('')}</select></td>
        <td><input type="text" id="return_notes_${r.id}" value="${r.adminNotes||''}" placeholder="notes" style="width:100px;"></td>
        <td><button class="btn btn-primary btn-sm" onclick="adminUpdateReturnStatus('${r.id}')">Update</button></td>
      </tr>`;
    }).join('')}</tbody></table></div>` : `<p>No defect claims submitted.</p>`);
  } else {
    content = !adminState.reviews ? `<p>Loading…</p>` : (adminState.reviews.length ? `
    <div style="overflow-x:auto;">
    <table><thead><tr><th>Date</th><th>Rating</th><th>Review</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${adminState.reviews.map(rv=>`<tr>
      <td>${new Date(rv.createdAt).toLocaleDateString('en-IN')}</td>
      <td>${'★'.repeat(rv.rating)}</td>
      <td style="max-width:280px;">"${rv.text}"</td>
      <td><span class="status-chip">${rv.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="adminUpdateReviewStatus('${rv.id}','approved')">Approve</button>
        <button class="btn btn-outline btn-sm" onclick="adminUpdateReviewStatus('${rv.id}','hidden')">Hide</button>
      </td>
    </tr>`).join('')}</tbody></table></div>` : `<p>No reviews submitted yet.</p>`);
  }

  return `
  <div class="page-head wrap"><span class="eyebrow">Internal</span><h1>Admin Dashboard</h1>
    <p style="margin-top:6px;">Signed in as <b>${adminState.user?.name||'Admin'}</b> · <a href="#" onclick="adminLogout();return false;" style="text-decoration:underline;">Sign out</a></p>
  </div>
  <div class="wrap section" style="padding-top:6px;">
    <div class="admin-shell">
      <div class="admin-nav">${nav.map(([id,label])=>`<button class="${view===id?'active':''}" onclick="state.adminView='${id}'; render()">${label}</button>`).join('')}</div>
      <div>${content}</div>
    </div>
  </div>
  ${footerHTML()}`;
}

/* ============ BACKEND SYNC ============ */
async function loadFromBackend(){
  try{
    const live = await api.getProducts();
    if(Array.isArray(live) && live.length){
      PRODUCTS.length = 0;
      live.forEach(p=>PRODUCTS.push({
        id:p.id, name:p.name, cat:p.categoryId||p.cat, price:p.price, mrp:p.mrp,
        rating:p.rating||4.8, reviews:p.reviewsCount||0, images:p.images||[],
        bestseller:!!p.isBestseller, desc:p.description||'', materials:p.materials||'',
        size:p.sizeInfo||'', colors:p.colors||[], stock:p.stock, isActive:p.isActive,
      }));
      render();
    }
  }catch(e){ /* backend not running — mock data stays in use */ }
}

/* ============ GLOBAL ============ */
function attachGlobalHandlers(){}

Object.assign(window, {
  render, toast, go,
  setCategoryFilter, toggleCatFilter, clearFilters,
  quickAdd, toggleWishlist,
  selectColor, stepQty, addToCartFromPD, buyNow, setMainImage,
  changeCartQty, removeFromCart, saveForLater, moveBackToCart,
  submitStep1, processPayment,
  setAccountTab, saveAccountProfile, saveAccountAddress, refreshMyOrdersAndRender,
  customerLogin, customerSignup, customerLogout, lookupGuestOrder,
  openReportIssue, uploadReturnProof, submitReturnIssue,
  handleCustomOrderFileUpload, submitCustomOrder, submitContactMessage,
  adminLogin, adminLogout, adminSaveProduct, adminUpdateOrderStatus, adminUpdateCustomOrderStatus,
  adminUpdateContactMessageStatus, adminUpdateReturnStatus, adminUpdateReviewStatus,
  state, customerAuth, adminState,
});

loadFromBackend();
refreshMyOrders().then(render);

