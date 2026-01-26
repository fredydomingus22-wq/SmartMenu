'use server';

import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

interface OnboardingData {
    companyName: string;
    nif?: string;
    restaurantName: string;
    restaurantAddress?: string;
    restaurantPhone?: string;
    province?: string;
    municipality?: string;
    latitude?: number;
    longitude?: number;
    tableCount: string;
}

export async function createOnboardingData(data: OnboardingData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: 'Unauthorized' };
    }

    try {
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Create Organization
            const organization = await tx.organization.create({
                data: {
                    name: data.companyName,
                    taxId: data.nif,
                    email: user.email,
                },
            });

            // 2. Create First Tenant (Restaurant)
            const slug = data.restaurantName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

            const tenant = await tx.tenant.create({
                data: {
                    name: data.restaurantName,
                    organizationId: organization.id,
                    slug: slug,
                    address: data.restaurantAddress,
                    city: data.municipality ? `${data.municipality}, ${data.province}` : undefined,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    phone: data.restaurantPhone,
                },
            });

            // 3. Link User to Organization and Tenant in Postgres
            // Note: We might need to ensure UserProfile exists first. 
            // If handling existing auth users, we upsert.
            await tx.userProfile.upsert({
                where: { id: user.id },
                create: {
                    id: user.id,
                    email: user.email!,
                    role: 'OWNER',
                    organizationId: organization.id,
                    tenantId: tenant.id,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0],
                },
                update: {
                    organizationId: organization.id,
                    tenantId: tenant.id,
                    role: 'OWNER',
                },
            });

            // 4. Create Initial Tables
            const tableCount = parseInt(data.tableCount) || 5;
            const tables = [];
            for (let i = 1; i <= tableCount; i++) {
                tables.push({
                    number: i,
                    tenantId: tenant.id,
                    organizationId: organization.id
                });
            }

            if (tables.length > 0) {
                await tx.table.createMany({
                    data: tables,
                });
            }

            return { organization, tenant };
        }, {
            maxWait: 5000, // wait for 5s to start tx
            timeout: 10000 // allow tx to run for 10s
        });

        // 4. Update Supabase Metadata (so middleware stops redirecting)
        await supabase.auth.updateUser({
            data: {
                organization_id: result.organization.id,
                tenant_id: result.tenant.id,
                restaurant_name: result.tenant.name,
                role: 'OWNER',
            },
        });

        return { success: true };

    } catch (error) {
        console.error('Onboarding Transaction Error:', error);
        return { error: 'Failed to create account setup. Please try again.' };
    }
}
