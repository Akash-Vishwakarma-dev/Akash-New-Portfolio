/**
 * Script to make a user an admin
 * Usage: npx tsx scripts/make-admin.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = "yuvrajsoni411@gmail.com";

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log("✅ User updated successfully!");
    console.log(`User: ${user.name || user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Email: ${user.email}`);
  } catch (error) {
    console.error("❌ Error updating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
