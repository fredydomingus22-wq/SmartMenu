import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tables = await prisma.table.findMany({
        include: {
            tenant: {
                select: { id: true, name: true, slug: true }
            }
        }
    });

    console.log('Tables Data:', JSON.stringify(tables, null, 2));

    // Check if any table is associated with the user ID by mistake
    const targetId = 'a48dd09e-9355-4394-aa8b-f37d50ddcf7c';
    const tablesWithUserId = await prisma.table.findMany({
        where: {
            OR: [
                { tenantId: targetId },
                { id: targetId }
            ]
        }
    });
    console.log('Tables matching Target ID:', JSON.stringify(tablesWithUserId, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
