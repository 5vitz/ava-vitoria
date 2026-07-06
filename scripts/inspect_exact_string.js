const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const images = await prisma.productImage.findMany({
    include: {
      product: true
    }
  });

  for (const img of images) {
    const url = img.image_url;
    console.log(`Product: "${img.product.name}"`);
    console.log(`  - URL: "${url}"`);
    console.log(`  - Length: ${url.length}`);
    console.log(`  - Char codes:`, Array.from(url).map(c => c.charCodeAt(0)));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
