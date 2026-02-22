import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SupabaseService } from '../common/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockPrismaService = {
    tenant: { findUnique: vi.fn() },
    product: { findMany: vi.fn() },
    productOptionValue: { findMany: vi.fn() },
    loyaltyReward: { findUnique: vi.fn() },
    order: { create: vi.fn() },
    table: { findFirst: vi.fn() },
  };

  const mockConfigService = {
    get: vi.fn((key: string) => {
      if (key === 'SUPABASE_URL') return 'http://mock';
      if (key === 'SUPABASE_ANON_KEY') return 'mock-key';
      return null;
    }),
  };

  const mockLoyaltyService = {
    getCustomerPoints: vi.fn(),
    getCustomerProfile: vi.fn(),
    redeemReward: vi.fn(),
  };

  const mockEventEmitter = {
    emit: vi.fn(),
  };

  const mockSupabaseService = {
    broadcast: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoyaltyService, useValue: mockLoyaltyService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if tenant not found', async () => {
      mockPrismaService.tenant.findUnique.mockResolvedValue(null);
      await expect(
        service.create({} as unknown as CreateOrderDto, 'invalid', 'org'),
      ).rejects.toThrow('Restaurant not found');
    });

    it('should calculate correct total for simple items', async () => {
      const tenantId = 't1';
      mockPrismaService.tenant.findUnique.mockResolvedValue({
        organizationId: 'o1',
      });
      mockPrismaService.product.findMany.mockResolvedValue([
        { id: 'p1', price: 10, isAvailable: true, tenantId },
      ]);

      const mockOrder = {
        id: 'order1',
        total: 20,
        items: [{ productId: 'p1', quantity: 2 }],
      };
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.create(
        {
          items: [{ productId: 'p1', quantity: 2 }],
          orderType: 'DINE_IN',
        } as unknown as CreateOrderDto,
        tenantId,
        'o1',
      );

      expect(result.total).toBe(20);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            total: 20,
          }),
        }),
      );
    });
  });
});
