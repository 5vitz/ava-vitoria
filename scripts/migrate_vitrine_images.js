const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== INICIANDO REDEFINIÇÃO DE MÍDIAS DA VITRINE ===");

  // 1. Obter a coleção Sem Limites
  const semLimites = await prisma.collection.findFirst({
    where: { slug: "sem-limites" }
  });

  if (!semLimites) {
    throw new Error("Coleção 'Sem Limites' não encontrada no banco. Rode o seed antes.");
  }
  const collectionId = semLimites.id;

  // 2. Ler os arquivos reais na pasta public/imagens/VITRINE/SemLimites
  const vitrineDir = path.join(process.cwd(), "public", "imagens", "VITRINE", "SemLimites");
  const files = await fs.readdir(vitrineDir);
  console.log(`Arquivos encontrados em ${vitrineDir}:`, files);

  // 3. Buscar produtos ordenados por display_order
  const products = await prisma.product.findMany({
    where: { collection_id: collectionId },
    orderBy: { display_order: "asc" }
  });
  console.log(`Encontrados ${products.length} produtos no banco de dados.`);

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

    // Deletar imagens antigas deste produto
    await prisma.productImage.deleteMany({
      where: { product_id: product.id }
    });

    // Criar nova imagem principal
    await prisma.productImage.create({
      data: {
        product_id: product.id,
        image_url: fileUrl,
        display_order: 0
      }
    });

    console.log(`✅ [Produto: ${product.name}] Vinculada imagem: ${fileUrl}`);
  }

  // 5. Atualizar a tabela de biblioteca geral (media_assets)
  console.log("\nAtualizando biblioteca de mídias (MediaAsset)...");
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
    console.log(`✅ [MediaAsset] Adicionado: ${file} (${mimeType})`);
  }

  console.log("\n=== REDEFINIÇÃO DE VITRINE CONCLUÍDA COM SUCESSO! ===");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
