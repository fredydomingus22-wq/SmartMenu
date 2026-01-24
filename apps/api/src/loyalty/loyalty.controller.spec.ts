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
            getOrCreateConfig: jest.fn(),
            updateConfig: jest.fn(),
            getRewards: jest.fn(),
            createReward: jest.fn(),
            updateReward: jest.fn(),
            deleteReward: jest.fn(),
            getCustomerPoints: jest.fn(),
            getTransactions: jest.fn(),
            redeemReward: jest.fn(),
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
