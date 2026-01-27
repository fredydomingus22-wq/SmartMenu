import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLoyaltyConfigDto } from './dto/update-loyalty-config.dto';
import { CreateLoyaltyRewardDto } from './dto/create-loyalty-reward.dto';
import { TransactionType, Prisma } from '@prisma/client';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) { }

  async getOrCreateConfig(tenantId: string, externalTx?: Prisma.TransactionClient) {
    if (!tenantId || tenantId === 'undefined') {
      throw new BadRequestException('Invalid tenant ID');
    }
    const tx = externalTx || this.prisma;
    let config = await tx.loyaltyConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      config = await tx.loyaltyConfig.create({
        data: { tenantId },
      });
    }

    return config;
  }

  async updateConfig(tenantId: string, dto: UpdateLoyaltyConfigDto) {
    return this.prisma.loyaltyConfig.upsert({
      where: { tenantId },
      update: dto,
      create: { ...dto, tenantId },
    });
  }

  async getRewards(tenantId: string, onlyActive = true) {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.prisma.loyaltyReward.findMany({
      where: {
        tenantId,
        ...(onlyActive ? { isActive: true } : {}),
      },
    });
  }

  async createReward(tenantId: string, dto: CreateLoyaltyRewardDto) {
    return this.prisma.loyaltyReward.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async updateReward(
    id: string,
    tenantId: string,
    dto: Partial<CreateLoyaltyRewardDto>,
  ) {
    return this.prisma.loyaltyReward.update({
      where: { id },
      data: dto,
    });
  }

  async deleteReward(id: string, tenantId: string) {
    return this.prisma.loyaltyReward.delete({
      where: { id, tenantId },
    });
  }

  async getCustomerProfile(userId: string, tenantId: string, externalTx?: Prisma.TransactionClient) {
    const tx = externalTx || this.prisma;
    try {
      let profile = await tx.customerProfile.findUnique({
        where: { userId_tenantId: { userId, tenantId } },
      });

      if (!profile) {
        profile = await tx.customerProfile.create({
          data: { userId, tenantId },
        });
      }

      return profile;
    } catch (error) {
      console.error(`[LoyaltyService] Error in getCustomerProfile:`, error);
      throw error;
    }
  }

  async getCustomerPoints(userId: string, tenantId: string, externalTx?: Prisma.TransactionClient) {
    const profile = await this.getCustomerProfile(userId, tenantId, externalTx);
    return profile.pointsBalance;
  }

  async earnPoints(
    userId: string,
    tenantId: string,
    orderTotal: number,
    orderId: string,
    externalTx?: Prisma.TransactionClient,
  ) {
    const tx = externalTx || this.prisma;
    const config = await this.getOrCreateConfig(tenantId, tx);
    if (!config.isActive) return null;

    const pointsToEarn = Math.floor(
      (orderTotal / Number(config.currencyUnit)) * Number(config.pointsPerUnit),
    );

    if (pointsToEarn <= 0) return null;

    const profile = await this.getCustomerProfile(userId, tenantId, tx);

    await tx.customerProfile.update({
      where: { id: profile.id },
      data: { pointsBalance: { increment: pointsToEarn } },
    });

    // Link the order to the customer profile for history
    await tx.order.update({
      where: { id: orderId },
      data: { customerProfileId: profile.id },
    });

    return tx.pointsTransaction.create({
      data: {
        customerProfileId: profile.id,
        tenantId,
        amount: pointsToEarn,
        type: TransactionType.EARNED,
        orderId,
        description: `Pontos ganhos no pedido #${orderId.slice(0, 8)}`,
      },
    });
  }

  async redeemReward(
    userId: string,
    tenantId: string,
    rewardId: string,
    externalTx?: Prisma.TransactionClient,
  ) {
    const tx = externalTx || this.prisma;
    const reward = await tx.loyaltyReward.findFirst({
      where: { id: rewardId, tenantId, isActive: true },
    });

    if (!reward)
      throw new NotFoundException('Recompensa não encontrada ou inativa');

    const profile = await this.getCustomerProfile(userId, tenantId, tx);

    if (profile.pointsBalance < reward.pointsRequired) {
      throw new BadRequestException('Pontos insuficientes para este resgate');
    }

    await tx.customerProfile.update({
      where: { id: profile.id },
      data: { pointsBalance: { decrement: reward.pointsRequired } },
    });

    return tx.pointsTransaction.create({
      data: {
        customerProfileId: profile.id,
        tenantId,
        amount: -reward.pointsRequired,
        type: TransactionType.REDEEMED,
        description: `Resgate de recompensa: ${reward.name}`,
      },
    });
  }

  async getTransactions(userId: string, tenantId: string) {
    const profile = await this.getCustomerProfile(userId, tenantId);
    return this.prisma.pointsTransaction.findMany({
      where: { customerProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getGlobalSummary(userId: string) {
    const profiles = await this.prisma.customerProfile.findMany({
      where: { userId },
      select: { pointsBalance: true },
    });

    const totalPoints = profiles.reduce((sum, p) => sum + p.pointsBalance, 0);
    const restaurantsCount = profiles.length;

    return {
      points: totalPoints,
      restaurantsCount,
    };
  }

  async getMyGlobalProfiles(userId: string) {
    return this.prisma.customerProfile.findMany({
      where: { userId },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: { pointsBalance: 'desc' },
    });
  }
}
