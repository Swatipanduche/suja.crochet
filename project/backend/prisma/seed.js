// Seeds the suja.crochet catalogue with the supplied product photography.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { id: 'gift', name: 'Gift Collection', emoji: '🎁', description: 'Cute handmade keychains and little gifts.' },
  { id: 'hair', name: 'Hair Accessories', emoji: '🎀', description: 'Crochet bows, clips, hair ties, sticks and scrunchies.' },
  { id: 'bouquets', name: 'Crochet Bouquets', emoji: '🌸', description: 'Handmade flower bouquets and single stems that never wilt.' },
  { id: 'decor', name: 'Decor Items', emoji: '🏠', description: 'Beautiful crochet pieces for cars, curtains, tables, walls and home.' },
  { id: 'custom', name: 'Custom Orders', emoji: '✨', description: 'Made exactly to your request.' },
];

const products = [
  { name: "Crochet Flower Bouquet", categoryId: "bouquets", price: 899, mrp: null, description: "A handmade crochet flower bouquet, wrapped beautifully for gifting.", materials: "Acrylic yarn, wire stems, wrap, ribbon", sizeInfo: "Approx. 30cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: false, images: ["/assets/products/crochet-bouquet.jpeg"] },
  { name: "Red Rose Crochet Bouquet", categoryId: "bouquets", price: 999, mrp: 1199, description: "A rich red crochet rose bouquet made to last and never wilt.", materials: "Acrylic yarn, wire stems, wrap, ribbon", sizeInfo: "Approx. 30cm", colorsJson: JSON.stringify(["#C6284B"]), isBestseller: true, images: ["/assets/products/red-rose-bouquet.jpeg"] },
  { name: "Single Crochet Rose Stem", categoryId: "bouquets", price: 249, mrp: null, description: "One elegant crochet rose on a stem \u2014 sweet on its own or as part of a bouquet.", materials: "Acrylic yarn, wire stem", sizeInfo: "Approx. 22cm", colorsJson: JSON.stringify(["#D83A67"]), isBestseller: false, images: ["/assets/products/single-rose.jpeg"] },
  { name: "Sunflower Crochet Bouquet", categoryId: "bouquets", price: 899, mrp: 1099, description: "A cheerful hand-stitched sunflower bouquet, wrapped ready for gifting.", materials: "Acrylic yarn, wire stem, wrap, ribbon", sizeInfo: "Approx. 30cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: true, images: ["/assets/products/sunflower-bouquet.jpeg"] },
  { name: "Tulip Crochet Bouquet", categoryId: "bouquets", price: 799, mrp: null, description: "A crochet tulip in full bloom, gift-wrapped and tied with a ribbon.", materials: "Acrylic yarn, wire stem, wrap, ribbon", sizeInfo: "Approx. 28cm", colorsJson: JSON.stringify(["#E6338C"]), isBestseller: true, images: ["/assets/products/tulip-bouquet.jpeg","/assets/products/tulip-bouquet-alt.png"] },
  { name: "Crochet Bow Hair Clip", categoryId: "hair", price: 299, mrp: 399, description: "A soft crochet bow clip that adds a playful handmade touch to any hairstyle.", materials: "Cotton-blend yarn, hair clip base", sizeInfo: "Approx. 8cm", colorsJson: JSON.stringify(["#D81B60"]), isBestseller: true, images: ["/assets/products/crochet-bow-clip.jpeg"] },
  { name: "Blue Flower Claw Clip", categoryId: "hair", price: 349, mrp: 449, description: "A floral crochet claw clip for a cheerful everyday updo.", materials: "Cotton-blend yarn, acrylic claw clip base", sizeInfo: "Approx. 9cm", colorsJson: JSON.stringify(["#4A90E2"]), isBestseller: false, images: ["/assets/products/blue-flower-claw-clip.png"] },
  { name: "Daisy Hair Stick", categoryId: "hair", price: 399, mrp: null, description: "A statement daisy hair stick with a handmade crochet flower.", materials: "Cotton yarn, wooden hair stick", sizeInfo: "Flower approx. 10cm", colorsJson: JSON.stringify(["#F5D547"]), isBestseller: false, images: ["/assets/products/daisy-hair-stick.png"] },
  { name: "Pink Crochet Hair Bow", categoryId: "hair", price: 299, mrp: 399, description: "A delicate pink crochet bow for half-up styles and ponytails.", materials: "Acrylic yarn, hair clip base", sizeInfo: "Approx. 9cm", colorsJson: JSON.stringify(["#F3A1BD"]), isBestseller: true, images: ["/assets/products/pink-hair-bow.jpeg"] },
  { name: "Floral Crochet Hair Claw", categoryId: "hair", price: 349, mrp: 449, description: "A pretty floral claw clip designed to hold a bun or half-up hairstyle.", materials: "Cotton-blend yarn, acrylic claw clip base", sizeInfo: "Approx. 9cm", colorsJson: JSON.stringify(["#B96B8B"]), isBestseller: true, images: ["/assets/products/floral-hair-claw.jpeg"] },
  { name: "Red Crochet Hair Bow", categoryId: "hair", price: 299, mrp: null, description: "A bold red crochet bow that turns a simple hairstyle into a statement look.", materials: "Acrylic yarn, hair clip base", sizeInfo: "Approx. 10cm", colorsJson: JSON.stringify(["#B51245"]), isBestseller: true, images: ["/assets/products/red-crochet-hair-bow.jpeg"] },
  { name: "Pink Blossom Hair Tie", categoryId: "hair", price: 249, mrp: null, description: "A soft crochet flower hair tie that dresses up a simple ponytail.", materials: "Acrylic yarn, elastic band", sizeInfo: "Flower approx. 6cm", colorsJson: JSON.stringify(["#F4A6C1"]), isBestseller: false, images: ["/assets/products/pink-flower-hair-tie.png"] },
  { name: "Lotus Hair Stick", categoryId: "hair", price: 399, mrp: null, description: "A handcrafted lotus hair stick for an elegant traditional-inspired style.", materials: "Cotton yarn, wooden hair stick", sizeInfo: "Flower approx. 10cm", colorsJson: JSON.stringify(["#E91E63"]), isBestseller: false, images: ["/assets/products/lotus-hair-stick.jpeg"] },
  { name: "Rose Hair Tie", categoryId: "hair", price: 249, mrp: null, description: "A crochet rose hair tie with a rich handmade texture.", materials: "Acrylic yarn, elastic band", sizeInfo: "One size", colorsJson: JSON.stringify(["#B83A4B"]), isBestseller: false, images: ["/assets/products/rose-hair-tie.png"] },
  { name: "Small Flower Claw Clip", categoryId: "hair", price: 299, mrp: null, description: "A compact floral claw clip for an easy everyday hairstyle.", materials: "Cotton-blend yarn, acrylic claw clip base", sizeInfo: "Approx. 7cm", colorsJson: JSON.stringify(["#F1D36B"]), isBestseller: false, images: ["/assets/products/small-flower-claw-clip.png"] },
  { name: "Flower Crochet Scrunchie", categoryId: "hair", price: 299, mrp: null, description: "A soft textured crochet scrunchie finished with a pretty flower detail.", materials: "Acrylic yarn, elastic band", sizeInfo: "One size", colorsJson: JSON.stringify(["#F2A6C6"]), isBestseller: false, images: ["/assets/products/flower-scrunchie.jpeg"] },
  { name: "Sunflower Claw Clip", categoryId: "hair", price: 349, mrp: 449, description: "A sunny crochet sunflower claw clip with a sturdy base.", materials: "Cotton-blend yarn, acrylic claw clip base", sizeInfo: "Approx. 9cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: true, images: ["/assets/products/sunflower-claw-clip.jpeg"] },
  { name: "Sunflower Hair Clutch", categoryId: "hair", price: 399, mrp: 499, description: "A bright sunflower crochet hair accessory for a statement half-up look.", materials: "Cotton yarn, hair clip base", sizeInfo: "Flower approx. 10cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: false, images: ["/assets/products/sunflower-hair-clutch.jpeg"] },
  { name: "Sunflower Hair Stick", categoryId: "hair", price: 399, mrp: null, description: "A full crochet sunflower mounted on a hair stick for special occasions.", materials: "Cotton yarn, wooden hair stick", sizeInfo: "Flower approx. 10cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: false, images: ["/assets/products/sunflower-hair-stick.png"] },
  { name: "Tulip Claw Clip", categoryId: "hair", price: 349, mrp: 449, description: "A delicate crochet tulip claw clip for a fresh floral hairstyle.", materials: "Cotton-blend yarn, acrylic claw clip base", sizeInfo: "Approx. 8cm", colorsJson: JSON.stringify(["#E6338C"]), isBestseller: true, images: ["/assets/products/tulip-claw-clip-1.jpeg","/assets/products/tulip-claw-clip-2.jpeg"] },
  { name: "Rainbow Car Charm", categoryId: "decor", price: 299, mrp: null, description: "A cheerful crochet rainbow charm to brighten your car interior.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 12cm", colorsJson: JSON.stringify(["#E98A45"]), isBestseller: false, images: ["/assets/products/rainbow-car-charm.png"] },
  { name: "Crochet Coaster", categoryId: "decor", price: 149, mrp: null, description: "A handmade crochet coaster that adds a cozy touch to your coffee table.", materials: "Cotton yarn", sizeInfo: "Approx. 10cm diameter", colorsJson: JSON.stringify(["#C58A5B"]), isBestseller: false, images: ["/assets/products/crochet-coaster.jpeg"] },
  { name: "Daisy Curtain Decor", categoryId: "decor", price: 449, mrp: null, description: "A delicate daisy hanging strand to bring handmade charm to curtains and windows.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 60cm", colorsJson: JSON.stringify(["#F5D547"]), isBestseller: false, images: ["/assets/products/daisy-curtain-decor.jpeg"] },
  { name: "Ganpati Door Hanging", categoryId: "decor", price: 599, mrp: 699, description: "A festive crochet Ganpati hanging made to add warmth and character to your entrance.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 30cm", colorsJson: JSON.stringify(["#E85D4A"]), isBestseller: true, images: ["/assets/products/ganpati-door-hanging.jpeg"] },
  { name: "Nazar Crochet Charm", categoryId: "decor", price: 199, mrp: null, description: "A handmade nazar-inspired crochet hanging for a playful decorative touch.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 12cm", colorsJson: JSON.stringify(["#2F6FC0"]), isBestseller: false, images: ["/assets/products/nazar-charm.jpeg"] },
  { name: "Sunflower Car Charm", categoryId: "decor", price: 299, mrp: null, description: "A sunny crochet sunflower charm for your rear-view mirror.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 12cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: true, images: ["/assets/products/sunflower-car-charm.jpeg"] },
  { name: "Sunflower Car Decor", categoryId: "decor", price: 349, mrp: null, description: "A crochet sunflower hanging designed to make your car feel more personal.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 13cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: false, images: ["/assets/products/sunflower-car-decor.jpeg"] },
  { name: "Sunflower Table Decor", categoryId: "decor", price: 449, mrp: null, description: "A cheerful crochet sunflower in a tiny pot for desks, shelves and tables.", materials: "Cotton yarn, pot, stuffing", sizeInfo: "Approx. 18cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: true, images: ["/assets/products/sunflower-table-decor.jpeg"] },
  { name: "Sunflower Hanging Charm", categoryId: "decor", price: 249, mrp: null, description: "A small crochet sunflower charm for doors, walls, mirrors or other spaces.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 12cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: false, images: ["/assets/products/sunflower-hanging-charm.jpeg"] },
  { name: "Tulip Curtain Decor", categoryId: "decor", price: 449, mrp: null, description: "A soft crochet tulip strand that adds a floral accent to curtains and windows.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 60cm", colorsJson: JSON.stringify(["#E6338C"]), isBestseller: false, images: ["/assets/products/tulip-curtain-decor.jpeg"] },
  { name: "Tulip Table Decor", categoryId: "decor", price: 449, mrp: null, description: "A tiny crochet tulip pot that looks lovely on a desk, shelf or table.", materials: "Cotton yarn, pot, stuffing", sizeInfo: "Approx. 18cm", colorsJson: JSON.stringify(["#E6338C"]), isBestseller: true, images: ["/assets/products/tulip-table-decor.jpeg"] },
  { name: "Crochet Wall Decor", categoryId: "decor", price: 499, mrp: null, description: "A handmade floral wall hanging to add texture and color to your space.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 50cm", colorsJson: JSON.stringify(["#E98A45"]), isBestseller: false, images: ["/assets/products/crochet-wall-decor.jpeg"] },
  { name: "White Flower Car Decor", categoryId: "decor", price: 299, mrp: null, description: "A soft white crochet flower hanging for a clean, elegant car interior.", materials: "Cotton yarn, hanging cord", sizeInfo: "Approx. 12cm", colorsJson: JSON.stringify(["#F4F1E8"]), isBestseller: false, images: ["/assets/products/white-flower-car-decor.jpeg"] },
  { name: "Letter Crochet Keychain", categoryId: "gift", price: 199, mrp: null, description: "A cute personalized-style crochet letter keychain for bags, keys and gifts.", materials: "Cotton yarn, keyring", sizeInfo: "Approx. 7cm", colorsJson: JSON.stringify(["#F08BAA"]), isBestseller: true, images: ["/assets/products/letter-keychain.png"] },
  { name: "Pink Flower Keychain", categoryId: "gift", price: 199, mrp: null, description: "A cheerful crochet flower keychain that makes a sweet little gift.", materials: "Cotton yarn, keyring", sizeInfo: "Approx. 7cm", colorsJson: JSON.stringify(["#F3A1BD"]), isBestseller: false, images: ["/assets/products/pink-flower-keychain.png"] },
  { name: "Rose Crochet Keychain", categoryId: "gift", price: 199, mrp: null, description: "A tiny crochet rose keychain with a leafy finish.", materials: "Cotton yarn, keyring", sizeInfo: "Approx. 7cm", colorsJson: JSON.stringify(["#B83A4B"]), isBestseller: false, images: ["/assets/products/rose-keychain.png"] },
  { name: "Sunflower Keychain", categoryId: "gift", price: 199, mrp: null, description: "A tiny crochet sunflower on a keyring \u2014 a cheerful little gift.", materials: "Cotton yarn, keyring", sizeInfo: "Approx. 6cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: true, images: ["/assets/products/sunflower-keychain.jpeg"] },
  { name: "Sunflower Mini Gift", categoryId: "gift", price: 249, mrp: null, description: "A small handmade sunflower keepsake, perfect for gifting or adding to a hamper.", materials: "Cotton yarn, gift wrap", sizeInfo: "Approx. 8cm", colorsJson: JSON.stringify(["#F2B705"]), isBestseller: false, images: ["/assets/products/sunflower-mini-gift.jpeg"] },
];

async function main() {
  console.log('Seeding categories...');
  for (const c of categories) {
    await prisma.category.upsert({ where: { id: c.id }, update: c, create: c });
  }

  console.log('Seeding products...');
  const catalogNames = new Set(products.map((p) => p.name));
  const existingProducts = await prisma.product.findMany({ where: { isActive: true }, select: { id: true, name: true } });
  for (const oldProduct of existingProducts) {
    if (!catalogNames.has(oldProduct.name)) {
      await prisma.product.update({ where: { id: oldProduct.id }, data: { isActive: false } });
    }
  }

  for (const { images, ...p } of products) {
    let product = await prisma.product.findFirst({ where: { name: p.name } });
    if (product) {
      product = await prisma.product.update({ where: { id: product.id }, data: p });
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
    } else {
      product = await prisma.product.create({ data: p });
    }
    await prisma.productImage.createMany({
      data: images.map((url, i) => ({ productId: product.id, url, sortOrder: i })),
    });
  }

  console.log('Creating/updating default admin user...');
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@sujacrochet.com' },
    update: {},
    create: { name: 'Suja', email: 'admin@sujacrochet.com', passwordHash, role: 'admin' },
  });

  console.log(`Seed complete: ${products.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
