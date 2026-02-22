import { Test, TestingModule } from '@nestjs/testing';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';

describe('RiderController', () => {
  let controller: RiderController;

  const mockRiderService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    findMyJobs: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiderController],
      providers: [{ provide: RiderService, useValue: mockRiderService }],
    }).compile();

    controller = module.get<RiderController>(RiderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
