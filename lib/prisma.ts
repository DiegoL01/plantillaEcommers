// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const isValidPostgresUrl = (value?: string) =>
  !!value &&
  (value.startsWith("postgresql://") || value.startsWith("postgres://"));

// Usa DIRECT_URL para seed/migraciones, DATABASE_URL para la app
const connectionString = isValidPostgresUrl(process.env.DIRECT_URL)
  ? process.env.DIRECT_URL!
  : isValidPostgresUrl(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL!
    : "";

if (!connectionString) {
  throw new Error("❌ ❌ Invalid or missing database URL. Set DATABASE_URL or DIRECT_URL with postgresql:// (or postgres://).");
}
const adapter = new PrismaPg({ connectionString, });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined; };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;