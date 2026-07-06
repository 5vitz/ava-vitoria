const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const fs = require("fs/promises");
const path = require("path");

const connectionString = "postgresql://neondb_owner:npg_iEOv0Bq7uDlx@ep-noisy-bread-ahmqztgd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== INICIANDO REDEFINIÇÃO DE MÍDIAS NO NEON (PRODUÇÃO) ===");

  // 1. Obter a coleção Sem Limites no Neon
  const semLimites = await prisma.collection.findFirst({
    where: { slug: "sem-limites" }
  });

  if (!semLimites) {
    throw new Error("Coleção 'Sem Limites' não encontrada no banco Neon.");
  }
  const collectionId = semLimites.id;

  // 2. Ler os arquivos reais na pasta local public/imagens/VITRINE/SemLimites
  const vitrineDir = path.join(process.cwd(), "public", "imagens", "VITRINE", "SemLimites");
  const files = await fs.readdir(vitrineDir);
  console.log(`Arquivos encontrados localmente para associar ao Neon:`, files);

  // 3. Buscar produtos no Neon ordenados por display_order
  const products = await prisma.product.findMany({
    where: { collection_id: collectionId },
    orderBy: { display_order: "asc" }
  });
  console.log(`Encontrados ${products.length} produtos no banco Neon.`);

  // 4. Mapear cada produto para seu respectivo arquivo com base no índice
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const prefix = (i + 1).toString().padStart(3, "0"); // "001", "002", etc.
    
    // Achar o arquivo correspondente na pasta
    const matchedFile = files.find(f => f.startsWith(prefix));

    if (!matchedFile) {
      console.warn(`⚠️ Nenhum arquivo encontrado para o prefixo ${prefix} (Produto: ${product.name})`);
      continue;
    }

    const fileUrl = `/imagens/VITRINE/SemLimites/${matchedFile}`;

    // Deletar imagens antigas deste produto no Neon
    await prisma.productImage.deleteMany({
      where: { product_id: product.id }
    });

    // Criar nova imagem principal no Neon
    await prisma.productImage.create({
      data: {
        product_id: product.id,
        image_url: fileUrl,
        display_order: 0
      }
    });

    console.log(`✅ [Neon - Produto: ${product.name}] Vinculada imagem: ${fileUrl}`);
  }

  // 5. Atualizar a tabela de biblioteca geral (media_assets) no Neon
  console.log("\nAtualizando biblioteca de mídias (MediaAsset) no Neon...");
  await prisma.mediaAsset.deleteMany({
    where: { collection_id: collectionId }
  });

  for (const file of files) {
    const fileUrl = `/imagens/VITRINE/SemLimites/${file}`;
    const ext = path.extname(file).toLowerCase();
    const mimeType = ext === ".png" ? "image/png" : (ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream");

    await prisma.mediaAsset.create({
      data: {
        filename: file,
        file_url: fileUrl,
        mime_type: mimeType,
        collection_id: collectionId
      }
    });
    console.log(`✅ [Neon - MediaAsset] Adicionado: ${file} (${mimeType})`);
  }

  console.log("\n=== REDEFINIÇÃO DE VITRINE NO NEON CONCLUÍDA COM SUCESSO! ===");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
