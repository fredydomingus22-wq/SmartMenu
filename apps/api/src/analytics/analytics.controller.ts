import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { MarketingService } from '../marketing/marketing.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';
import { endOfDay } from 'date-fns';

@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly marketingService: MarketingService,
  ) {}

  @Get('kpis')
  async getKPIs(
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;
    return this.analyticsService.getKPIMetrics(
      req.user.tenantId,
      req.user.organizationId,
      range,
    );
  }

  @Get('sales-trend')
  async getSalesTrend(
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('productId') productId?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;

    return this.analyticsService.getSalesTrend(
      req.user.tenantId,
      req.user.organizationId,
      range,
      { categoryId, productId },
    );
  }

  @Get('product-performance')
  async getProductPerformance(
    @Request() req: AuthenticatedRequest,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'quantity' | 'revenue',
    @Query('order') order?: 'asc' | 'desc',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;
    return this.analyticsService.getProductPerformance(
      req.user.tenantId,
      req.user.organizationId,
      { limit, sortBy, order, range },
    );
  }

  @Get('peak-hours')
  async getPeakHours(
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;
    return this.analyticsService.getPeakHours(
      req.user.tenantId,
      req.user.organizationId,
      range,
    );
  }

  @Get('customer/:id')
  async getCustomerProfile(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;
    return this.analyticsService.getCustomerProfile(
      req.user.tenantId,
      req.user.organizationId,
      id,
      range,
    );
  }

  @Get('advanced-metrics')
  async getAdvancedMetrics(
    @Request() req: AuthenticatedRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;
    return this.analyticsService.getAdvancedMetrics(
      req.user.tenantId,
      req.user.organizationId,
      range,
    );
  }

  @Get('customer-ranking')
  async getCustomerRanking(
    @Request() req: AuthenticatedRequest,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'totalSpent' | 'orders' | 'lastVisit' | 'points',
    @Query('order') order?: 'asc' | 'desc',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const range =
      startDate && endDate
        ? { start: new Date(startDate), end: endOfDay(new Date(endDate)) }
        : undefined;
    return this.analyticsService.getCustomerRanking(
      req.user.tenantId,
      req.user.organizationId,
      { limit, sortBy, order, range },
    );
  }

  @Get('table-ranking')
  async getTableRanking(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getTableRanking(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Post('marketing/send')
  async sendCampaign(
    @Request() req: AuthenticatedRequest,
    @Body()
    payload: {
      customerIds: string[];
      title: string;
      message: string;
      dealId?: string;
    },
  ) {
    return this.marketingService.sendCampaign(
      req.user.tenantId,
      req.user.organizationId,
      payload,
    );
  }
}
