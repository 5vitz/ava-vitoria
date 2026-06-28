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
  console.log("Iniciando migração de dados...");

  // 1. Achar ou criar a coleção Sem Limites
  let semLimites = await prisma.collection.findFirst({
    where: { slug: "sem-limites" },
  });

  if (!semLimites) {
    console.log("Coleção Sem Limites não encontrada. Criando nova coleção...");
    semLimites = await prisma.collection.create({
      data: {
        name: "Sem Limites",
        slug: "sem-limites",
        year: 2026,
        season: "Outono",
      },
    });
  }

  const targetCollectionId = semLimites.id;
  console.log(`Coleção Sem Limites ativa: ID ${targetCollectionId}`);

  // 2. Mover todos os produtos para a coleção Sem Limites
  const updatedProductsCount = await prisma.product.updateMany({
    data: {
      collection_id: targetCollectionId,
    },
  });
  console.log(`Produtos vinculados à coleção: ${updatedProductsCount.count}`);

  // 3. Atualizar display_order incrementalmente para todos os produtos
  const allProducts = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  for (let i = 0; i < allProducts.length; i++) {
    await prisma.product.update({
      where: { id: allProducts[i].id },
      data: { display_order: i },
    });
  }
  console.log(`Ordenação display_order recalculada para ${allProducts.length} produtos.`);

  // 4. Mover todas as mídias de biblioteca para a coleção Sem Limites (se existirem)
  const updatedMedias = await prisma.mediaAsset.updateMany({
    data: {
      collection_id: targetCollectionId,
    },
  });
  console.log(`Mídias de biblioteca migradas: ${updatedMedias.count} registros.`);

  // 5. Remover coleções vazias redundantes
  const deletedCollections = await prisma.collection.deleteMany({
    where: {
      id: {
        not: targetCollectionId,
      },
    },
  });
  console.log(`Coleções adicionais removidas: ${deletedCollections.count}`);

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
