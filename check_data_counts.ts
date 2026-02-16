import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const orgCount = await prisma.organization.count();
    const tenantCount = await prisma.tenant.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const userCount = await prisma.userProfile.count();

    console.log('Database Row Counts:');
    console.log(`Organizations: ${orgCount}`);
    console.log(`Tenants: ${tenantCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);
    console.log(`UserProfiles: ${userCount}`);

    if (tenantCount > 0) {
      const tenants = await prisma.tenant.findMany({ take: 5 });
      console.log('\nSample Tenants:', tenants.map(t => ({ id: t.id, name: t.name, slug: t.slug })));
    }
  } catch (error) {
    console.error('Error counting rows:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
