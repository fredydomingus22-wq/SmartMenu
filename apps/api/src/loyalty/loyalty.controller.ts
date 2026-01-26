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
  getMyPoints(@Request() req: { user: { userId: string; tenantId: string } }) {
    return this.loyaltyService.getCustomerPoints(
      req.user.userId,
      req.user.tenantId,
    );
  }

  @Get('my-transactions')
  getMyTransactions(
    @Request() req: { user: { userId: string; tenantId: string } },
  ) {
    return this.loyaltyService.getTransactions(
      req.user.userId,
      req.user.tenantId,
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
  ) {
    return this.loyaltyService.redeemReward(
      req.user.userId,
      req.user.tenantId,
      rewardId,
    );
  }

  @Get('global-summary')
  getGlobalSummary(@Request() req: { user: { userId: string } }) {
    return this.loyaltyService.getGlobalSummary(req.user.userId);
  }
}
