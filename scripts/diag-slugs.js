
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- TENANT SLUG AUDIT ---');

    const tenants = await prisma.tenant.findMany({
        select: { id: true, name: true, slug: true }
    });

    for (const t of tenants) {
        const products = await prisma.product.count({ where: { tenantId: t.id } });
        console.log(`- [${t.id}] Name: ${t.name}, Slug: ${t.slug}, Products: ${products}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
