
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- CATEGORY & VISIBILITY AUDIT ---');

    const populatedTenantId = 'd6e0a41e-0b1c-4c9e-ba07-98ec5e0128f6';

    const categories = await prisma.category.findMany({
        where: { tenantId: populatedTenantId },
        include: { products: true }
    });

    console.log(`\nTenant: Pague Com BB (${populatedTenantId})`);
    for (const c of categories) {
        console.log(`- Category: ${c.name.pt || c.name} (ID: ${c.id})`);
        console.log(`  Products in this category: ${c.products.length}`);
        c.products.forEach(p => {
            console.log(`    * ${p.name.pt || p.name}: Available=${p.isAvailable}, OrgId=${p.organizationId}`);
        });
    }

    const productsWithoutCategory = await prisma.product.count({
        where: { tenantId: populatedTenantId, categoryId: null }
    });
    console.log(`\nProducts without category: ${productsWithoutCategory}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
