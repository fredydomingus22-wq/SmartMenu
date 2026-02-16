import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    const tenant = await prisma.tenant.findFirst({
      select: { slug: true }
    })
    if (tenant) {
      console.log('VALID_TENANT_SLUG:' + tenant.slug)
    } else {
      console.log('NO_TENANTS_FOUND')
    }
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
