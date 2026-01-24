
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- TARGETED USER-TENANT AUDIT ---');

    const userProfiles = await prisma.userProfile.findMany({
        include: { tenant: true }
    });

    console.log('\nUser Associations:');
    userProfiles.forEach(u => {
        console.log(`- User: ${u.email}`);
        console.log(`  Tenant: ${u.tenant?.name || 'NONE'} (${u.tenantId})`);
        console.log(`  Role: ${u.role}`);
    });

    const productCounts = await prisma.product.groupBy({
        by: ['tenantId'],
        _count: { id: true }
    });

    console.log('\nPopulated Tenants:');
    for (const pc of productCounts) {
        if (pc._count.id > 0) {
            const t = await prisma.tenant.findUnique({ where: { id: pc.tenantId } });
            console.log(`- [${pc.tenantId}] ${t?.name}: ${pc._count.id} products`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
