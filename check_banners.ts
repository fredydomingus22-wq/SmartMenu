
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany({
    take: 5,
    include: {
      _count: {
        select: {
          banners: true,
          productGroups: true,
          marketingCampaigns: true
        }
      }
    }
  });
  console.log("Tenants sample:", JSON.stringify(tenants, null, 2));

  const banners = await prisma.banner.findMany();
  console.log("All Banners:", JSON.stringify(banners, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
