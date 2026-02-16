import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await (prisma as any).tenant.findFirst();
  const org = await (prisma as any).organization.findFirst();
  const product = await (prisma as any).product.findFirst();
  const rider = await (prisma as any).rider.findFirst({ include: { user: true } });

  console.log('TEST_DATA:', JSON.stringify({
    tenantId: tenant?.id,
    organizationId: org?.id,
    productId: product?.id,
    riderId: rider?.id,
    riderEmail: rider?.email
  }));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
