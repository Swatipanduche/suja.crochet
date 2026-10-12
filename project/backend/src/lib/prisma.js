const { PrismaClient } = require('@prisma/client');

// A single shared Prisma Client instance, reused across all route modules.
const prisma = new PrismaClient();

module.exports = prisma;
