import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const inputId = process.argv[2];
  if (!inputId) {
    console.error('Usage: npx ts-node check-id.ts <id>');
    process.exit(1);
  }
  console.log(`Checking ID: ${inputId}`);

  const tenant = await prisma.tenant.findUnique({
    where: { id: inputId }
  });

  if (tenant) {
    console.log('✅ Tenant found by ID:');
    console.log(JSON.stringify(tenant, null, 2));
  } else {
    const order = await prisma.order.findUnique({
        where: { id: inputId },
        include: { tenant: true }
    });

    if (order) {
        console.log('✅ Order found by ID:');
        console.log(JSON.stringify(order, null, 2));
        console.log(`Associated Tenant ID: ${order.tenantId}`);
    } else {
        console.log('❌ Neither Tenant nor Order found by ID.');
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
