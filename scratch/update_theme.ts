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
  console.log("Atualizando o Design System para o Tema Claro (BG Branco)...");

  const designSystemConfig = {
    theme: "light",
    colors: {
      bg: "#FFFFFF",          // Branco
      accent: "#FF4D1C",      // Laranja Ferrugem / Acabamento
      text_primary: "#000000", // Preto
      text_secondary: "#666666", // Cinza Escuro
      border: "rgba(0, 0, 0, 0.1)", // Borda cinza suave
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

  await prisma.siteSettings.upsert({
    where: { config_key: "design_system" },
    update: { config_value: designSystemConfig },
    create: {
      config_key: "design_system",
      config_value: designSystemConfig,
    },
  });

  console.log("Tema claro configurado com sucesso no Banco de Dados!");
}

main()
  .catch((e) => {
    console.error("Erro ao atualizar o tema:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
