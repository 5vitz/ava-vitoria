const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.count();
  const collections = await prisma.collection.findMany();
  const products = await prisma.product.count();
  const mediaAssets = await prisma.mediaAsset.findMany();
  const productImages = await prisma.productImage.count();

  console.log("=== DATABASE INSPECTION ===");
  console.log(`Users: ${users}`);
  console.log(`Collections (${collections.length}):`);
  collections.forEach(c => console.log(`  - [${c.id}] name: "${c.name}", year: ${c.year}, season: "${c.season}"`));
  console.log(`Products: ${products}`);
  console.log(`Media Assets (${mediaAssets.length}):`);
  mediaAssets.forEach(m => console.log(`  - [${m.id}] filename: "${m.filename}", url: "${m.file_url}", collection_id: "${m.collection_id}"`));
  console.log(`Product Images: ${productImages}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
