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
  const slug = "ava-streetwear-piece-17";
  const newImageUrl = "/imagens/colecao/Prontas/SolaDeTenis.png";

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    console.error(`Product not found: ${slug}`);
    return;
  }

  // Encontra a imagem correspondente a display_order 0
  const image = await prisma.productImage.findFirst({
    where: {
      product_id: product.id,
      display_order: 0,
    },
  });

  if (!image) {
    console.error(`No image found with display_order 0 for product ${slug}`);
    return;
  }

  await prisma.productImage.update({
    where: { id: image.id },
    data: { image_url: newImageUrl },
  });

  console.log(`Successfully updated Card 2 (${slug}) image_url to: ${newImageUrl}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
