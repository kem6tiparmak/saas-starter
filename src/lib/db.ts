import { PrismaClient } from "@prisma/client";

/**
 * Prisma client as a singleton. In Next.js dev (hot reload) a new connection
 * would otherwise be opened on every reload, exhausting the DB connection pool.
 * We attach the instance to globalThis so it survives reloads.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
