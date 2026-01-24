import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Enabling pg_trgm extension...');
    try {
        await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
        console.log('pg_trgm extension enabled successfully.');
    } catch (error) {
        console.error('Error enabling pg_trgm:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
