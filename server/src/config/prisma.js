import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// نسخة واحدة من PrismaClient في كل التطبيق
// (لتجنب فتح اتصالات كثيرة بقاعدة البيانات)

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isProduction ? ["error"] : ["query", "error", "warn"],
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}
