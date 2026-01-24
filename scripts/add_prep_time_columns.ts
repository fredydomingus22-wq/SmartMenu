import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Adding preparation time columns to public.products...');
    try {
        await prisma.$executeRawUnsafe(`
            ALTER TABLE public.products 
            ADD COLUMN IF NOT EXISTS min_prep_time INTEGER,
            ADD COLUMN IF NOT EXISTS max_prep_time INTEGER;
        `);
        console.log('Columns added successfully.');
    } catch (error) {
        console.error('Error adding columns:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
