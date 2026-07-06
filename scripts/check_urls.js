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
    },
    orderBy: {
      product: {
        display_order: "asc"
      }
    }
  });

  console.log("=== PRODUCT IMAGES IN DB ===");
  images.forEach(img => {
    console.log(`Product: "${img.product.name}" (Display Order: ${img.product.display_order})`);
    console.log(`  - Image URL: "${img.image_url}"`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
