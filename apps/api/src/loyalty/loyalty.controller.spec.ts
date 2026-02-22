import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';

describe('LoyaltyController', () => {
  let controller: LoyaltyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyController],
      providers: [
        {
          provide: LoyaltyService,
          useValue: {
            getOrCreateConfig: vi.fn(),
            updateConfig: vi.fn(),
            getRewards: vi.fn(),
            createReward: vi.fn(),
            updateReward: vi.fn(),
            deleteReward: vi.fn(),
            getCustomerPoints: vi.fn(),
            getTransactions: vi.fn(),
            redeemReward: vi.fn(),
          },
        },
        // Also needs to mock guards if they are global, but SupabaseAuthGuard might need mock too
      ],
    }).compile();

    controller = module.get<LoyaltyController>(LoyaltyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
