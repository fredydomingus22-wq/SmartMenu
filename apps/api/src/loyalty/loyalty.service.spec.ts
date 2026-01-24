import { Test, TestingModule } from '@nestjs/testing';
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
            loyaltyConfig: { findUnique: jest.fn(), create: jest.fn(), upsert: jest.fn() },
            loyaltyReward: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
            customerProfile: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
            pointsTransaction: { create: jest.fn(), findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
