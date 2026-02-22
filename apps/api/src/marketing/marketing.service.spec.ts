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
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    productGroup: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    promotionalSchedule: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    event: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    marketingCampaign: { create: vi.fn() },
    notification: { create: vi.fn() },
  };

  const mockSupabaseService = {
    broadcast: vi.fn(),
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
      (prisma.banner.findMany as vi.Mock).mockResolvedValue(mockBanners);

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
      (prisma.promotionalSchedule.findMany as vi.Mock).mockResolvedValue(
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
