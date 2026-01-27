const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
    const tenantId = 'd6e0a41e-0b1c-4c9e-ba07-98ec5e0128f6';

    console.log('=== DATA INTEGRITY DIAGNOSIS ===');
    console.log('TenantId:', tenantId);

    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                id: true,
                name: true,
                organizationId: true,
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        console.log('\n=== TENANT INFO ===');
        console.log(JSON.stringify(tenant, null, 2));

        const products = await prisma.product.findMany({
            where: { tenantId },
            take: 1,
            select: {
                id: true,
                organizationId: true
            }
        });

        console.log('\n=== PRODUCT INFO (Sample) ===');
        console.log(JSON.stringify(products, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
