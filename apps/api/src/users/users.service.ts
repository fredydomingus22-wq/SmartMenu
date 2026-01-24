import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private supabaseAdmin!: SupabaseClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (supabaseUrl && supabaseServiceKey) {
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    }
  }

  async syncUser(userData: {
    id: string;
    email: string;
    name?: string;
    restaurantName?: string;
  }) {
    // 1. Check if user profile already exists
    let user = await this.prisma.userProfile.findUnique({
      where: { id: userData.id },
      include: {
        tenant: true,
        organization: true,
      },
    });

    if (user) {
      // If user exists, ensure metadata is correct (useful for fixing malformed metadata)
      if (user.tenantId && user.organizationId) {
        await this.updateSupabaseMetadata(
          user.id,
          user.tenantId,
          user.organizationId,
        );
      }
      return user;
    }

    // 2. If not, create a new Organization, Tenant, and UserProfile
    try {
      user = await this.prisma.$transaction(
        async (tx) => {
          const restaurantName = userData.restaurantName || 'Meu Restaurante';

          // Create Organization (The Company)
          const organization = await tx.organization.create({
            data: {
              name: restaurantName, // Initially same as restaurant name
            },
          });

          // Create Tenant (The First Branch/Restaurant)
          const slug =
            restaurantName.toLowerCase().replace(/\s+/g, '-') +
            '-' +
            Math.random().toString(36).substring(2, 7);

          const tenant = await tx.tenant.create({
            data: {
              name: restaurantName,
              slug,
              organizationId: organization.id,
            },
          });

          // Create UserProfile linked to both
          return tx.userProfile.create({
            data: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: 'OWNER',
              organizationId: organization.id,
              tenantId: tenant.id,
            },
            include: {
              tenant: true,
              organization: true,
            },
          });
        },
        { timeout: 30000 },
      );

      // 3. Update Supabase Auth metadata using service role key
      if (user && user.tenantId && user.organizationId) {
        await this.updateSupabaseMetadata(
          user.id,
          user.tenantId,
          user.organizationId,
        );
      }

      return user;
    } catch (error) {
      console.error('Failed to sync user:', error);
      throw new InternalServerErrorException('Failed to generate user record');
    }
  }

  async findById(id: string) {
    return this.prisma.userProfile.findUnique({
      where: { id },
      include: {
        tenant: true,
        organization: true,
      },
    });
  }

  private async updateSupabaseMetadata(
    userId: string,
    tenantId: string,
    organizationId: string,
  ) {
    if (!this.supabaseAdmin) return;

    try {
      console.log(`Updating Supabase metadata for user ${userId}...`);
      const { error } = await this.supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          app_metadata: {
            tenant_id: tenantId,
            organization_id: organizationId,
          },
        },
      );

      if (error) {
        console.error('Error updating Supabase auth metadata:', error);
      } else {
        console.log('Successfully updated Supabase auth metadata.');
      }
    } catch (e) {
      console.error('Exception during metadata update:', e);
    }
  }
}
