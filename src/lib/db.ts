import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  pool?: pg.Pool;
};

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({ connectionString });
}

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma;
export const pool = globalForPrisma.pool;
