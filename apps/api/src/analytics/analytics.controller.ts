import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  async getKPIs(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getKPIMetrics(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get('sales-trend')
  async getSalesTrend(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getSalesTrend(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get('product-ranking')
  async getProductRanking(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getProductRanking(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get('peak-hours')
  async getPeakHours(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getPeakHours(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get('customer-ranking')
  async getCustomerRanking(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getCustomerRanking(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get('table-ranking')
  async getTableRanking(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getTableRanking(
      req.user.tenantId,
      req.user.organizationId,
    );
  }
}
