
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Orders ---');
    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, total: true, userId: true, customerProfileId: true, createdAt: true }
    });
    console.log(JSON.stringify(orders, null, 2));

    console.log('\n--- Loyalty Configs ---');
    const configs = await prisma.loyaltyConfig.findMany();
    console.log(JSON.stringify(configs, null, 2));

    console.log('\n--- Customer Profiles ---');
    const profiles = await prisma.customerProfile.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' }
    });
    console.log(JSON.stringify(profiles, null, 2));

    console.log('\n--- Transactions ---');
    const txs = await prisma.pointsTransaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(txs, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
