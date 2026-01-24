
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DEFINITIVE DATABASE AUDIT (JS) ---');

    const tenants = await prisma.tenant.findMany();
    console.log(`\nFound ${tenants.length} tenants:`);

    for (const t of tenants) {
        const products = await prisma.product.count({ where: { tenantId: t.id } });
        const users = await prisma.userProfile.count({ where: { tenantId: t.id } });
        console.log(`- [${t.id}] ${t.name}: Products=${products}, Users=${users}`);
    }

    const userProfiles = await prisma.userProfile.findMany();
    console.log('\nUser-Tenant Links:');
    userProfiles.forEach(u => {
        console.log(`- ${u.email} -> Tenant ID: ${u.tenantId}`);
    });

    const allProducts = await prisma.product.count();
    const orphanedProducts = await prisma.product.count({
        where: {
            tenantId: { notIn: tenants.map(t => t.id) }
        }
    });
    console.log(`\nTotal Products in DB: ${allProducts}`);
    console.log(`Orphaned Products (wrong tenantId): ${orphanedProducts}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
