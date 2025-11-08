import { PrismaClient } from "@prisma/client";
import { env } from "./env";

/**
 * Global Prisma instance to prevent hot-reload issues in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma Client instance with logging configuration
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Helper to ensure database connection
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Database connected successfully");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

/**
 * Graceful shutdown handler
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}

// Register shutdown handlers only in Node.js runtime (not Edge)
if (typeof window === "undefined" && typeof process !== "undefined" && typeof process.on === "function") {
  process.on("beforeExit", disconnectDatabase);
  process.on("SIGINT", disconnectDatabase);
  process.on("SIGTERM", disconnectDatabase);
}
