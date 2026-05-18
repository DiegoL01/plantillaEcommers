// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const isValidPostgresUrl = (value?: string): value is string =>
  typeof value === "string" &&
  (value.startsWith("postgresql://") || value.startsWith("postgres://"));

// Usa DATABASE_URL por defecto; DIRECT_URL queda como respaldo si existe.
let connectionString = "";

if (isValidPostgresUrl(process.env.DATABASE_URL)) {
  connectionString = process.env.DATABASE_URL;
} else if (isValidPostgresUrl(process.env.DIRECT_URL)) {
  connectionString = process.env.DIRECT_URL;
}

if (!connectionString) {
  throw new Error(
    "Invalid or missing database URL. Set DATABASE_URL or DIRECT_URL with postgresql:// or postgres://."
  );
}
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined; };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
