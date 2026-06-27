import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando semeadura do banco de dados (Seed)...");

  // 1. Limpar tabelas existentes para evitar duplicidade
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.stockVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  // Inserir Usuário Administrador
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      username: "admin",
      password: passwordHash,
    },
  });
  console.log("Usuário administrador padrão criado (admin / admin123).");

  // 2. Inserir configurações do Design System (Camada 1: Alma)
  const designSystemConfig = {
    theme: "dark",
    colors: {
      bg: "#000000",          // Preto
      accent: "#D1D1D6",      // Prata / Silver
      text_primary: "#FFFFFF",
      text_secondary: "#A0A0A0",
      border: "rgba(255, 255, 255, 0.1)",
    },
    fonts: {
      title_family: "Outfit",
      body_family: "Plus Jakarta Sans",
      title_weight: "700",
      body_weight: "300",
    },
    effects: {
      border_width: "1px",
      backdrop_blur: "12px",
    },
  };

  await prisma.siteSettings.create({
    data: {
      config_key: "design_system",
      config_value: designSystemConfig,
    },
  });
  console.log("Configurações padrão do Design System inseridas com sucesso.");

  // 3. Inserir Coleções de Teste (Projetos)
  const collectionSemLimites = await prisma.collection.create({
    data: {
      name: "Sem Limites",
      slug: "sem-limites",
      year: 2026,
      season: "Outono",
    },
  });

  const collectionNoGame = await prisma.collection.create({
    data: {
      name: "No Game No Drama",
      slug: "no-game-no-drama",
      year: 2026,
      season: "Inverno",
    },
  });
  console.log("Coleções de teste criadas.");

  // Tabela de medidas padrão (Camisa)
  const defaultSizeChart = [
    { size: "P", metrics: { Largura: "53 cm", Comprimento: "72,05 cm" } },
    { size: "M", metrics: { Largura: "56 cm", Comprimento: "76 cm" } },
    { size: "G", metrics: { Largura: "58 cm", Comprimento: "78 cm" } },
    { size: "GG", metrics: { Largura: "62 cm", Comprimento: "82 cm" } },
    { size: "XG", metrics: { Largura: "64 cm", Comprimento: "84 cm" } }
  ];

  // 4. Cadastrar 18 produtos baseados nas imagens da pasta COLECAO (01.jpg a 18.jpg)
  const colors = ["Vinho", "Preto", "Branco"];
  const sizes = ["P", "M", "G", "GG", "XG"];

  for (let i = 1; i <= 18; i++) {
    const numStr = i.toString().padStart(2, "0");
    const productName = `AVA Streetwear Piece ${numStr}`;
    const productSlug = `ava-streetwear-piece-${numStr}`;
    const isOdd = i % 2 === 1;

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: productSlug,
        description: `Peça conceitual exclusiva da marca AVA Vitória. Desenvolvida sob o manifesto da alta-costura streetwear com corte oversized e algodão premium de alta gramatura.`,
        price: 399.00 + (i * 20), // Preços variando de R$419,00 a R$759,00
        is_active: true,
        display_order: i - 1,
        size_chart: defaultSizeChart as any,
        collection_id: isOdd ? collectionSemLimites.id : collectionNoGame.id,
      },
    });

    // Vincular 3 imagens 9:16 da pasta static de forma rotativa para testar o hover carrossel
    for (let j = 0; j < 3; j++) {
      const imgIndex = ((i - 1 + j) % 18) + 1;
      const imgNumStr = imgIndex.toString().padStart(2, "0");
      await prisma.productImage.create({
        data: {
          product_id: product.id,
          image_url: `/imagens/COLECAO/${imgNumStr}.jpg`,
          display_order: j,
        },
      });
    }

    // Gerar as variantes de estoque por cor e tamanho
    for (const color of colors) {
      for (const size of sizes) {
        // Quantidade em estoque aleatória entre 5 e 20 unidades
        const quantity = Math.floor(Math.random() * 16) + 5;
        await prisma.stockVariant.create({
          data: {
            product_id: product.id,
            size,
            color,
            quantity,
          },
        });
      }
    }
  }

  // 5. Inserir Mídias de Teste na Biblioteca de Mídias
  for (let i = 1; i <= 18; i++) {
    const numStr = i.toString().padStart(2, "0");
    const isOdd = i % 2 === 1;
    await prisma.mediaAsset.create({
      data: {
        filename: `${numStr}.jpg`,
        file_url: `/imagens/COLECAO/${numStr}.jpg`,
        mime_type: "image/jpeg",
        collection_id: isOdd ? collectionSemLimites.id : collectionNoGame.id,
      },
    });
  }

  console.log("18 produtos e 18 mídias de biblioteca cadastrados nas coleções com sucesso.");
  console.log("Semeadura concluída!");
}

main()
  .catch((e) => {
    console.error("Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Fechar o pool de conexões do pg
  });
