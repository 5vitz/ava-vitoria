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
  console.log("=== INICIANDO MIGRAÇÃO DOS LINKS DE IMAGENS NO BANCO ===");

  // 1. Atualizar ProductImage (Imagens dos produtos na vitrine)
  const productImages = await prisma.productImage.findMany({
    include: {
      product: {
        include: {
          collection: true
        }
      }
    }
  });

  console.log(`Encontradas ${productImages.length} imagens de produtos.`);
  let productImagesUpdated = 0;

  for (const img of productImages) {
    const product = img.product;
    const collection = product.collection;

    if (!collection) {
      console.log(`  - Pula imagem ID ${img.id}: Produto não está em nenhuma coleção.`);
      continue;
    }

    const currentUrl = img.image_url;
    // Extrai o nome do arquivo (ex: "01.jpg")
    const filename = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    
    // Nova URL baseada na pasta VITRINE e no slug da coleção
    const newUrl = `/imagens/VITRINE/${collection.slug}/${filename}`;

    if (currentUrl !== newUrl) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { image_url: newUrl }
      });
      console.log(`  - Atualizado [ProductImage]: "${currentUrl}" -> "${newUrl}"`);
      productImagesUpdated++;
    }
  }

  // 2. Atualizar MediaAsset (Imagens da biblioteca geral)
  const mediaAssets = await prisma.mediaAsset.findMany({
    include: {
      collection: true
    }
  });

  console.log(`\nEncontradas ${mediaAssets.length} mídias na Biblioteca Geral.`);
  let mediaAssetsUpdated = 0;

  for (const asset of mediaAssets) {
    const collection = asset.collection;

    if (!collection) {
      console.log(`  - Pula mídia ID ${asset.id}: Mídia não associada a nenhuma coleção.`);
      continue;
    }

    const currentUrl = asset.file_url;
    const filename = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    const newUrl = `/imagens/VITRINE/${collection.slug}/${filename}`;

    if (currentUrl !== newUrl) {
      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: { file_url: newUrl }
      });
      console.log(`  - Atualizado [MediaAsset]: "${currentUrl}" -> "${newUrl}"`);
      mediaAssetsUpdated++;
    }
  }

  console.log(`\n=== MIGRAÇÃO CONCLUÍDA ===`);
  console.log(`- Imagens de produtos atualizadas: ${productImagesUpdated}`);
  console.log(`- Mídias de biblioteca atualizadas: ${mediaAssetsUpdated}`);
}

main()
  .catch((err) => {
    console.error("Erro na migração de links:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
