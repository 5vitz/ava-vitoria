const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

// Use the Neon connection string directly
const connectionString = "postgresql://neondb_owner:npg_iEOv0Bq7uDlx@ep-noisy-bread-ahmqztgd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== INSPECTING NEON PRODUCTION DATABASE ===");
  const products = await prisma.product.findMany({
    include: {
      images: true
    },
    orderBy: {
      display_order: "asc"
    }
  });

  for (const p of products) {
    console.log(`Product: "${p.name}" (Active: ${p.is_active})`);
    p.images.forEach(img => {
      console.log(`  - Image URL: "${img.image_url}"`);
    });
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
