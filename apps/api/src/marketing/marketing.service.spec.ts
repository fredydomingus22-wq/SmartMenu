import { Test, TestingModule } from '@nestjs/testing';
import { MarketingService } from './marketing.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../common/supabase.service';

describe('MarketingService', () => {
  let service: MarketingService;
  let prisma: PrismaService;
  let supabase: SupabaseService;

  const mockPrismaService = {
    banner: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    productGroup: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    promotionalSchedule: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    event: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    marketingCampaign: { create: jest.fn() },
    notification: { create: jest.fn() },
  };

  const mockSupabaseService = {
    broadcast: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<MarketingService>(MarketingService);
    prisma = module.get<PrismaService>(PrismaService);
    supabase = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendCampaign', () => {
    it('should create campaign, notifications and broadcast', async () => {
      const tenantId = 't1';
      const orgId = 'o1';
      const payload = {
        customerIds: ['c1', 'c2'],
        title: 'Title',
        message: 'Msg',
      };

      mockPrismaService.marketingCampaign.create.mockResolvedValue({
        id: 'camp1',
      });
      mockPrismaService.notification.create.mockResolvedValue({});

      const result = await service.sendCampaign(tenantId, orgId, payload);

      expect(mockPrismaService.marketingCampaign.create).toHaveBeenCalled();
      expect(mockPrismaService.notification.create).toHaveBeenCalledTimes(2);
      expect(mockSupabaseService.broadcast).toHaveBeenCalledWith(
        `marketing:${tenantId}`,
        'MARKETING_CAMPAIGN',
        expect.anything(),
      );
      expect(result.success).toBe(true);
    });
  });

  describe('findAllBanners', () => {
    it('should return all banners for a tenant', async () => {
      const tenantId = 'tenant-1';
      const mockBanners = [{ id: '1', tenantId }];
      (prisma.banner.findMany as jest.Mock).mockResolvedValue(mockBanners);

      const result = await service.findAllBanners(tenantId);
      expect(result).toEqual(mockBanners);
      expect(prisma.banner.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('findActivePromotions', () => {
    it('should return only active promotions', async () => {
      const tenantId = 'tenant-1';
      const mockPromos = [{ id: 'p1', tenantId }];
      (prisma.promotionalSchedule.findMany as jest.Mock).mockResolvedValue(
        mockPromos,
      );

      const result = await service.findActivePromotions(tenantId);
      expect(result).toEqual(mockPromos);
      expect(prisma.promotionalSchedule.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenantId,
          }),
        }),
      );
    });
  });
});
