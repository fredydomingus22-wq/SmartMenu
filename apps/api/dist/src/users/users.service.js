"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    configService;
    supabaseAdmin;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseServiceKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (supabaseUrl && supabaseServiceKey) {
            this.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
        }
    }
    async syncUser(userData) {
        let user = await this.prisma.userProfile.findUnique({
            where: { id: userData.id },
            include: {
                tenant: true,
                organization: true,
            },
        });
        if (user) {
            if (user.tenantId && user.organizationId) {
                await this.updateSupabaseMetadata(user.id, user.tenantId, user.organizationId);
            }
            return user;
        }
        try {
            user = await this.prisma.$transaction(async (tx) => {
                const restaurantName = userData.restaurantName || 'Meu Restaurante';
                const organization = await tx.organization.create({
                    data: {
                        name: restaurantName,
                    },
                });
                const slug = restaurantName.toLowerCase().replace(/\s+/g, '-') +
                    '-' +
                    Math.random().toString(36).substring(2, 7);
                const tenant = await tx.tenant.create({
                    data: {
                        name: restaurantName,
                        slug,
                        organizationId: organization.id,
                    },
                });
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
            });
            if (user && user.tenantId && user.organizationId) {
                await this.updateSupabaseMetadata(user.id, user.tenantId, user.organizationId);
            }
            return user;
        }
        catch (error) {
            console.error('Failed to sync user:', error);
            throw new common_1.InternalServerErrorException('Failed to generate user record');
        }
    }
    async findById(id) {
        return this.prisma.userProfile.findUnique({
            where: { id },
            include: {
                tenant: true,
                organization: true,
            },
        });
    }
    async updateSupabaseMetadata(userId, tenantId, organizationId) {
        if (!this.supabaseAdmin)
            return;
        try {
            console.log(`Updating Supabase metadata for user ${userId}...`);
            const { error } = await this.supabaseAdmin.auth.admin.updateUserById(userId, {
                app_metadata: {
                    tenant_id: tenantId,
                    organization_id: organizationId,
                },
            });
            if (error) {
                console.error('Error updating Supabase auth metadata:', error);
            }
            else {
                console.log('Successfully updated Supabase auth metadata.');
            }
        }
        catch (e) {
            console.error('Exception during metadata update:', e);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map