import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

const globalForPrisma = globalThis;

// فعّل عرض SQL فقط لو DEBUG=true في .env
const logLevels = env.isProduction
  ? ["error"]
  : process.env.DEBUG_SQL === "true"
    ? ["query", "error", "warn"]
    : ["error", "warn"];

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: logLevels });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}
