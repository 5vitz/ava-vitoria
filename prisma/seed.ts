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

  // 3. Cadastrar 18 produtos baseados nas imagens da pasta COLECAO (01.jpg a 18.jpg)
  const colors = ["Vinho", "Preto", "Branco"];
  const sizes = ["P", "M", "G", "GG"];

  for (let i = 1; i <= 18; i++) {
    const numStr = i.toString().padStart(2, "0");
    const productName = `AVA Streetwear Piece ${numStr}`;
    const productSlug = `ava-streetwear-piece-${numStr}`;

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: productSlug,
        description: `Peça conceitual exclusiva da marca AVA Vitória. Desenvolvida sob o manifesto da alta-costura streetwear com corte oversized e algodão premium de alta gramatura.`,
        price: 399.00 + (i * 20), // Preços variando de R$419,00 a R$759,00
        is_active: true,
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

  console.log("18 produtos e suas variantes de tamanho/cor foram inseridos com sucesso.");
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
