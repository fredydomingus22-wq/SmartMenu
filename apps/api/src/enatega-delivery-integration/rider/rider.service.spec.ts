import { Test, TestingModule } from '@nestjs/testing';
import { RiderService } from './rider.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../common/supabase.service';

describe('RiderService', () => {
  let service: RiderService;

  const mockPrismaService = {
    rider: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    deliveryAssignment: { findMany: jest.fn() },
  };

  const mockSupabaseService = {
    broadcast: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiderService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<RiderService>(RiderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if rider exists', async () => {
      const dto = { email: 'test@test.com', phone: '123456', name: 'Rider' };
      mockPrismaService.rider.findFirst.mockResolvedValue({ id: 'r1' });

      await expect(service.create(dto as any)).rejects.toThrow(
        'Rider with this email or phone already exists',
      );
    });

    it('should create rider if not exists', async () => {
      const dto = { email: 'new@test.com', phone: '999', name: 'New' };
      mockPrismaService.rider.findFirst.mockResolvedValue(null);
      mockPrismaService.rider.create.mockResolvedValue({ id: 'r2', ...dto });

      const result = await service.create(dto as any);
      expect(result.id).toBe('r2');
      expect(mockPrismaService.rider.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should broadcast update if status changes', async () => {
      const riderId = 'r1';
      const dto = { status: 'ONLINE' };
      const updatedRider = { id: riderId, status: 'ONLINE' };

      mockPrismaService.rider.update.mockResolvedValue(updatedRider);

      await service.update(riderId, dto as any);

      expect(mockSupabaseService.broadcast).toHaveBeenCalledWith(
        `riders:${riderId}`,
        'RIDER_UPDATE',
        updatedRider,
      );
    });
  });
});
