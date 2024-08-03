import { PrismaClient } from "@prisma/client";
import { env } from "@/utils/env";

const globalForDb = globalThis as unknown as { db: PrismaClient };

const NODE_ENV = env.getSafe("NODE_ENV", "production");

export const db =
  globalForDb.db ||
  new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (NODE_ENV !== "production") globalForDb.db = db;

export { type Prisma } from "@prisma/client";
