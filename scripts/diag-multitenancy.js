
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DEEP MULTITENANCY AUDIT ---');

    const tenants = await prisma.tenant.findMany({
        include: { organization: true }
    });

    for (const t of tenants) {
        const products = await prisma.product.count({ where: { tenantId: t.id } });
        const categories = await prisma.category.count({ where: { tenantId: t.id } });
        const users = await prisma.userProfile.findMany({ where: { tenantId: t.id } });

        console.log(`\n[TENANT] ${t.name} (${t.id})`);
        console.log(`  Org: ${t.organization?.name} (${t.organizationId})`);
        console.log(`  Data: Products=${products}, Categories=${categories}`);
        console.log(`  Users: ${users.map(u => u.email).join(', ') || 'NONE'}`);

        if (products > 0) {
            const sampleProd = await prisma.product.findFirst({ where: { tenantId: t.id } });
            console.log(`  Sample Product OrgId: ${sampleProd.organizationId}`);
        }
    }

    const allUsers = await prisma.userProfile.findMany();
    console.log('\n--- ALL USERS ---');
    allUsers.forEach(u => {
        console.log(`- ${u.email}: tenantId=${u.tenantId}, orgId=${u.organizationId}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
