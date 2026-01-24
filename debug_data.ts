import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Tenants ---');
    const tenants = await prisma.tenant.findMany({
        select: { id: true, name: true, slug: true }
    });
    console.log(JSON.stringify(tenants, null, 2));

    console.log('\n--- Categories ---');
    const categories = await prisma.category.findMany();
    console.log(JSON.stringify(categories, null, 2));

    console.log('\n--- Products ---');
    const products = await prisma.product.findMany({
        take: 5
    });
    console.log(JSON.stringify(products, null, 2));

    console.log('\n--- User Profiles ---');
    const profiles = await prisma.userProfile.findMany();
    console.log(JSON.stringify(profiles, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
