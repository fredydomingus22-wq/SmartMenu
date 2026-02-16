import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantId = '2e79b0a4-e03a-45cd-8ee4-2f2651fa0da4';
  console.log(`Checking tenant: ${tenantId}`);

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      _count: {
        select: {
          categories: true,
          products: true,
        }
      }
    }
  });

  if (tenant) {
    console.log('✅ Tenant found:');
    console.log(JSON.stringify(tenant, null, 2));
  } else {
    console.log('❌ Tenant NOT found.');
    
    // Check all tenants to see what's available
    const allTenants = await prisma.tenant.findMany({
      take: 5,
      select: { id: true, name: true, slug: true }
    });
    console.log('Available tenants (first 5):');
    console.log(JSON.stringify(allTenants, null, 2));
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
