import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { UpdateLoyaltyConfigDto } from './dto/update-loyalty-config.dto';
import { CreateLoyaltyRewardDto } from './dto/create-loyalty-reward.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('loyalty')
@UseGuards(SupabaseAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) { }

  // --- Manager Endpoints ---

  @Get('config')
  getConfig(@Request() req: { user: { tenantId: string } }) {
    return this.loyaltyService.getOrCreateConfig(req.user.tenantId);
  }

  @Public()
  @Get('config/public')
  getPublicConfig(@Query('tenantId') tenantId: string) {
    return this.loyaltyService.getOrCreateConfig(tenantId);
  }

  @Patch('config')
  updateConfig(
    @Request() req: { user: { tenantId: string } },
    @Body() dto: UpdateLoyaltyConfigDto,
  ) {
    return this.loyaltyService.updateConfig(req.user.tenantId, dto);
  }

  @Post('rewards')
  createReward(
    @Request() req: { user: { tenantId: string } },
    @Body() dto: CreateLoyaltyRewardDto,
  ) {
    return this.loyaltyService.createReward(req.user.tenantId, dto);
  }

  @Patch('rewards/:id')
  updateReward(
    @Param('id') id: string,
    @Request() req: { user: { tenantId: string } },
    @Body() dto: Partial<CreateLoyaltyRewardDto>,
  ) {
    return this.loyaltyService.updateReward(id, req.user.tenantId, dto);
  }

  @Delete('rewards/:id')
  deleteReward(
    @Param('id') id: string,
    @Request() req: { user: { tenantId: string } },
  ) {
    return this.loyaltyService.deleteReward(id, req.user.tenantId);
  }

  // --- Public/Customer Endpoints ---

  @Public()
  @Get('rewards/public')
  getPublicRewards(@Query('tenantId') tenantId: string) {
    return this.loyaltyService.getRewards(tenantId);
  }

  @Get('my-points')
  async getMyPoints(
    @Request() req: { user: { userId: string; tenantId: string } },
    @Query('tenantId') tenantId?: string,
  ) {
    const targetTenantId = tenantId || req.user.tenantId;
    console.log(
      `[LoyaltyController] getMyPoints for user ${req.user.userId} on tenant ${targetTenantId}`,
    );

    const points = await this.loyaltyService.getCustomerPoints(
      req.user.userId,
      targetTenantId,
    );

    console.log(`[LoyaltyController] Found ${points} points`);
    return { points };
  }

  @Get('my-transactions')
  getMyTransactions(
    @Request() req: { user: { userId: string; tenantId: string } },
    @Query('tenantId') tenantId?: string,
  ) {
    const targetTenantId = tenantId || req.user.tenantId;
    console.log(
      `[LoyaltyController] getMyTransactions for user ${req.user.userId} on tenant ${targetTenantId}`,
    );
    return this.loyaltyService.getTransactions(
      req.user.userId,
      targetTenantId,
    );
  }

  @Post('ensure-profile')
  ensureProfile(
    @Request() req: { user: { userId: string; tenantId: string } },
    @Body('tenantId') tenantId: string,
  ) {
    return this.loyaltyService.getCustomerProfile(
      req.user.userId,
      tenantId || req.user.tenantId,
    );
  }

  @Post('redeem/:rewardId')
  redeem(
    @Request() req: { user: { userId: string; tenantId: string } },
    @Param('rewardId') rewardId: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.loyaltyService.redeemReward(
      req.user.userId,
      tenantId || req.user.tenantId,
      rewardId,
    );
  }

  @Get('global-summary')
  async getGlobalSummary(@Request() req: { user: { userId: string } }) {
    console.log(`[LoyaltyController] getGlobalSummary for user ${req.user.userId}`);
    const summary = await this.loyaltyService.getGlobalSummary(req.user.userId);
    console.log(`[LoyaltyController] Global summary:`, summary);
    return summary;
  }

  @Get('my-profiles')
  getMyProfiles(@Request() req: { user: { userId: string } }) {
    return this.loyaltyService.getMyGlobalProfiles(req.user.userId);
  }
}
