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
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LoyaltyService = class LoyaltyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateConfig(tenantId) {
        if (!tenantId || tenantId === 'undefined') {
            throw new common_1.BadRequestException('Invalid tenant ID');
        }
        let config = await this.prisma.loyaltyConfig.findUnique({
            where: { tenantId },
        });
        if (!config) {
            config = await this.prisma.loyaltyConfig.create({
                data: { tenantId },
            });
        }
        return config;
    }
    async updateConfig(tenantId, dto) {
        return this.prisma.loyaltyConfig.upsert({
            where: { tenantId },
            update: dto,
            create: { ...dto, tenantId },
        });
    }
    async getRewards(tenantId, onlyActive = true) {
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        return this.prisma.loyaltyReward.findMany({
            where: {
                tenantId,
                ...(onlyActive ? { isActive: true } : {}),
            },
        });
    }
    async createReward(tenantId, dto) {
        return this.prisma.loyaltyReward.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }
    async updateReward(id, tenantId, dto) {
        return this.prisma.loyaltyReward.update({
            where: { id },
            data: dto,
        });
    }
    async deleteReward(id, tenantId) {
        return this.prisma.loyaltyReward.delete({
            where: { id, tenantId },
        });
    }
    async getCustomerProfile(userId, tenantId) {
        let profile = await this.prisma.customerProfile.findUnique({
            where: { userId_tenantId: { userId, tenantId } },
        });
        if (!profile) {
            profile = await this.prisma.customerProfile.create({
                data: { userId, tenantId },
            });
        }
        return profile;
    }
    async getCustomerPoints(userId, tenantId) {
        const profile = await this.getCustomerProfile(userId, tenantId);
        return profile.pointsBalance;
    }
    async earnPoints(userId, tenantId, orderTotal, orderId) {
        const config = await this.getOrCreateConfig(tenantId);
        if (!config.isActive)
            return null;
        const pointsToEarn = Math.floor((orderTotal / Number(config.currencyUnit)) * Number(config.pointsPerUnit));
        if (pointsToEarn <= 0)
            return null;
        const profile = await this.getCustomerProfile(userId, tenantId);
        return this.prisma.$transaction(async (tx) => {
            await tx.customerProfile.update({
                where: { id: profile.id },
                data: { pointsBalance: { increment: pointsToEarn } },
            });
            return tx.pointsTransaction.create({
                data: {
                    customerProfileId: profile.id,
                    tenantId,
                    amount: pointsToEarn,
                    type: client_1.TransactionType.EARNED,
                    orderId,
                    description: `Pontos ganhos no pedido #${orderId.slice(0, 8)}`,
                },
            });
        });
    }
    async redeemReward(userId, tenantId, rewardId) {
        const reward = await this.prisma.loyaltyReward.findFirst({
            where: { id: rewardId, tenantId, isActive: true },
        });
        if (!reward)
            throw new common_1.NotFoundException('Recompensa não encontrada ou inativa');
        const profile = await this.getCustomerProfile(userId, tenantId);
        if (profile.pointsBalance < reward.pointsRequired) {
            throw new common_1.BadRequestException('Pontos insuficientes para este resgate');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.customerProfile.update({
                where: { id: profile.id },
                data: { pointsBalance: { decrement: reward.pointsRequired } },
            });
            return tx.pointsTransaction.create({
                data: {
                    customerProfileId: profile.id,
                    tenantId,
                    amount: -reward.pointsRequired,
                    type: client_1.TransactionType.REDEEMED,
                    description: `Resgate de recompensa: ${reward.name}`,
                },
            });
        });
    }
    async getTransactions(userId, tenantId) {
        const profile = await this.getCustomerProfile(userId, tenantId);
        return this.prisma.pointsTransaction.findMany({
            where: { customerProfileId: profile.id },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoyaltyService);
//# sourceMappingURL=loyalty.service.js.map