import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const count = await prisma.mediaAsset.count();
  const assets = await prisma.mediaAsset.findMany();
  console.log("Local Database Media Assets Count:", count);
  console.log("Local Assets:", assets);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
