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
  console.log("Iniciando migração de dados locais (JS)...");

  // 1. Achar a coleção Sem Limites
  const semLimites = await prisma.collection.findFirst({
    where: { slug: "sem-limites" },
  });

  if (!semLimites) {
    console.error("Coleção Sem Limites não encontrada no banco. Por favor, rode o seed primeiro.");
    return;
  }

  const targetCollectionId = semLimites.id;
  console.log(`Coleção Sem Limites encontrada: ID ${targetCollectionId}`);

  // 2. Mover todos os produtos para a coleção Sem Limites
  const updatedProducts = await prisma.product.updateMany({
    data: {
      collection_id: targetCollectionId,
    },
  });
  console.log(`Produtos migrados: ${updatedProducts.count} registros atualizados.`);

  // 3. Mover todas as mídias de biblioteca para a coleção Sem Limites
  const updatedMedias = await prisma.mediaAsset.updateMany({
    data: {
      collection_id: targetCollectionId,
    },
  });
  console.log(`Mídias de biblioteca migradas: ${updatedMedias.count} registros atualizados.`);

  // 4. Remover coleções vazias (No Game No Drama)
  const deletedCollections = await prisma.collection.deleteMany({
    where: {
      id: {
        not: targetCollectionId,
      },
    },
  });
  console.log(`Coleções adicionais removidas: ${deletedCollections.count} registros deletados.`);

  console.log("Migração concluída com sucesso!");
}

main()
  .catch((err) => {
    console.error("Erro na migração:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
