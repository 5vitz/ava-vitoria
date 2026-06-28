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
  const settings = await prisma.siteSettings.findUnique({
    where: { config_key: "design_system" },
  });

  if (settings) {
    const val = settings.config_value as any;
    val.colors.bg = "#17060b";
    await prisma.siteSettings.update({
      where: { config_key: "design_system" },
      data: { config_value: val },
    });
    console.log("Local database background color updated to #17060b");
  } else {
    console.log("Design system config not found in database.");
  }
}

main()
  .catch((err) => console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
