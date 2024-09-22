import { env } from "@/utils/env";
import { PrismaClient } from "@prisma/client";

const NODE_ENV = env.getSafe("NODE_ENV", "production");

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

export const db =
  globalForPrisma.db ||
  new PrismaClient({
    log:
      NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["warn", "error"],
  });

if (NODE_ENV !== "production") globalForPrisma.db = db;
