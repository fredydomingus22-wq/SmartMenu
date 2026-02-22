import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoyaltyService } from './loyalty.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LoyaltyService', () => {
  let service: LoyaltyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        {
          provide: PrismaService,
          useValue: {
            loyaltyConfig: {
              findUnique: vi.fn(),
              create: vi.fn(),
              upsert: vi.fn(),
            },
            loyaltyReward: {
              findMany: vi.fn(),
              create: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
              findFirst: vi.fn(),
            },
            customerProfile: {
              findUnique: vi.fn(),
              create: vi.fn(),
              update: vi.fn(),
            },
            pointsTransaction: { create: vi.fn(), findMany: vi.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('earnPoints', () => {
    it('should calculate and add points correctly', async () => {
      const tenantId = 't1';
      const userId = 'u1';
      const orderTotal = 100;
      const orderId = 'o1';

      const mockConfig = {
        isActive: true,
        currencyUnit: 1,
        pointsPerUnit: 10,
        tenantId,
      };

      const mockProfile = { id: 'prof1', pointsBalance: 50, userId, tenantId };

      const mockTx = {
        loyaltyConfig: { findUnique: vi.fn().mockResolvedValue(mockConfig) },
        customerProfile: {
          findUnique: vi.fn().mockResolvedValue(mockProfile),
          update: vi
            .fn()
            .mockResolvedValue({ ...mockProfile, pointsBalance: 1050 }),
        },
        order: { update: vi.fn() },
        pointsTransaction: { create: vi.fn() },
      };

      // @ts-expect-error - hacking prisma service for test
      service['prisma'] = mockTx;

      await service.earnPoints(userId, tenantId, orderTotal, orderId);

      expect(mockTx.customerProfile.update).toHaveBeenCalledWith({
        where: { id: 'prof1' },
        data: { pointsBalance: { increment: 1000 } },
      });
    });
  });

  describe('redeemReward', () => {
    it('should throw error if insufficient points', async () => {
      const tenantId = 't1';
      const userId = 'u1';
      const rewardId = 'r1';

      const mockReward = { id: 'r1', pointsRequired: 100, isActive: true };
      const mockProfile = { id: 'prof1', pointsBalance: 50 };

      const mockTx = {
        loyaltyReward: { findFirst: vi.fn().mockResolvedValue(mockReward) },
        customerProfile: {
          findUnique: vi.fn().mockResolvedValue(mockProfile),
        },
      };

      // @ts-expect-error - hacking prisma service for test
      service['prisma'] = mockTx;

      await expect(
        service.redeemReward(userId, tenantId, rewardId),
      ).rejects.toThrow('Pontos insuficientes para este resgate');
    });
  });
});
