import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetId = 'a48dd09e-9355-4394-aa8b-f37d50ddcf7c';

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { tenantId: targetId },
                { organizationId: targetId }
            ]
        }
    });

    console.log('Products for ID:', JSON.stringify(products, null, 2));

    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { tenantId: targetId },
                { organizationId: targetId }
            ]
        }
    });
    console.log('Categories for ID:', JSON.stringify(categories, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
