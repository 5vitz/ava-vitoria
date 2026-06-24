import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    where: { is_active: true },
    include: {
      images: {
        orderBy: { display_order: "asc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  console.log("=== LISTA DE PRODUTOS (ORDEM DA VITRINE) ===");
  products.forEach((p, idx) => {
    console.log(`Card ${idx + 1}: ${p.name} (Slug: ${p.slug})`);
    p.images.forEach((img) => {
      console.log(`  - Order ${img.display_order}: ${img.image_url}`);
    });
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
