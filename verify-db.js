const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    console.log("Checking DB connection...");
    try {
        await prisma.$connect();
        console.log("DB connected!");

        const tenantId = 'd6e0a41e-0b1c-4c9e-ba07-98ec5e0128f6';
        const organizationId = 'cff7a479-6b83-4645-ab71-e133cb04fb67';
        // Use a known user ID or null
        const userId = '3480da25-5509-4323-977c-f785e6a7183f';

        console.log(`Attempting to find customer profile for ${userId}...`);
        const profile = await prisma.customerProfile.findUnique({
            where: { userId_tenantId: { userId, tenantId } }
        });
        console.log("Profile found:", profile);

        console.log("Verifying product counts...");
        const productsCount = await prisma.product.count({ where: { tenantId } });
        console.log(`Found ${productsCount} products for tenant.`);

    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
