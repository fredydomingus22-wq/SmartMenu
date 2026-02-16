import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'fredyus29@gmail.com';
    
    // 1. Get from UserProfile (Public)
    const profile = await prisma.userProfile.findUnique({
        where: { email },
    });

    // 2. Try to find the user in the auth schema
    const authUser = await (prisma as any).users?.findFirst({
        where: { email }
    });

    console.log('--- ID Comparison ---');
    console.log('Target Email:', email);
    console.log('UserProfile ID:', profile?.id);
    console.log('Auth Table ID: ', authUser?.id);
    console.log('Tenant ID:     ', profile?.tenantId);
    console.log('Match?         ', profile && authUser ? profile.id === authUser.id : 'N/A');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
