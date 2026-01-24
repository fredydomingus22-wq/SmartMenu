import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating GIST indexes for product search...');
    try {
        // Note: In public schema as per previous check
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gist (name gist_trgm_ops);');
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON public.products USING gist (description gist_trgm_ops);');
        console.log('GIST indexes created successfully.');
    } catch (error) {
        console.error('Error creating GIST indexes:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
