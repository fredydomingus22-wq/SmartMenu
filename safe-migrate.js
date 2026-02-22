const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("Creating contact_messages table safely...");
    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "public"."contact_messages" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "email" TEXT NOT NULL,
              "restaurant" TEXT NOT NULL,
              "phone" TEXT NOT NULL,
              "message" TEXT NOT NULL,
              "status" TEXT NOT NULL DEFAULT 'UNREAD',
              "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log("Success!");
    } catch (e) {
        console.error("Error creating table:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
