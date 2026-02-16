import { Injectable, Logger } from '@nestjs/common';
import {
  Banner,
  ProductGroup,
  PromotionalSchedule,
  Event,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../common/supabase.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import {
  CreateProductGroupDto,
  UpdateProductGroupDto,
} from './dto/product-group.dto';
import {
  CreatePromotionalScheduleDto,
  UpdatePromotionalScheduleDto,
} from './dto/promotional-schedule.dto';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async sendCampaign(
    tenantId: string,
    organizationId: string,
    payload: {
      customerIds: string[];
      message: string;
      title: string;
      dealId?: string;
    },
  ) {
    this.logger.log(
      `Sending campaign to ${payload.customerIds.length} customers for tenant ${tenantId}`,
    );

    // 1. Create a Campaign record (Audit trail)
    const campaign = await this.prisma.marketingCampaign.create({
      data: {
        tenantId,
        organizationId,
        title: payload.title,
        message: payload.message,
        targetCount: payload.customerIds.length,
        status: 'SENT',
      },
    });

    // 2. Dispatch notifications
    const notifications = payload.customerIds.map((customerId) => {
      return this.prisma.notification.create({
        data: {
          tenantId,
          organizationId,
          customerProfileId: customerId,
          title: payload.title,
          message: payload.message,
          type: 'MARKETING',
          metadata: { campaignId: campaign.id, dealId: payload.dealId } as any,
        },
      });
    });

    await Promise.all(notifications);

    // 3. Broadcast to Consumer App (Realtime)
    await this.supabase.broadcast(
      `marketing:${tenantId}`,
      'MARKETING_CAMPAIGN',
      {
        title: payload.title,
        message: payload.message,
        campaignId: campaign.id,
        dealId: payload.dealId,
      },
    );

    return {
      success: true,
      campaignId: campaign.id,
      dispatched: payload.customerIds.length,
    };
  }

  // ========== BANNERS ==========

  async findAllBanners(tenantId: string): Promise<Banner[]> {
    return this.prisma.banner.findMany({
      where: { tenantId },
      orderBy: { order: 'asc' },
    });
  }

  async findBannersByType(tenantId: string, type: string): Promise<Banner[]> {
    return this.prisma.banner.findMany({
      where: { tenantId, type, isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async createBanner(tenantId: string, dto: CreateBannerDto): Promise<Banner> {
    return this.prisma.banner.create({
      data: { ...dto, tenantId },
    });
  }

  async updateBanner(
    id: string,
    tenantId: string,
    dto: UpdateBannerDto,
  ): Promise<Banner> {
    return this.prisma.banner.update({
      where: { id, tenantId },
      data: dto,
    });
  }

  async deleteBanner(id: string, tenantId: string): Promise<Banner> {
    return this.prisma.banner.delete({
      where: { id, tenantId },
    });
  }

  // ========== PRODUCT GROUPS ==========

  async findAllProductGroups(tenantId: string): Promise<ProductGroup[]> {
    return this.prisma.productGroup.findMany({
      where: { tenantId },
      include: {
        items: {
          include: { product: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findProductGroupBySlug(
    tenantId: string,
    slug: string,
  ): Promise<ProductGroup | null> {
    return this.prisma.productGroup.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        items: {
          include: { product: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async createProductGroup(
    tenantId: string,
    dto: CreateProductGroupDto,
  ): Promise<ProductGroup> {
    const { productIds, ...data } = dto;
    return this.prisma.productGroup.create({
      data: {
        ...data,
        tenantId,
        items: productIds?.length
          ? {
              create: productIds.map((productId, index) => ({
                productId,
                order: index,
              })),
            }
          : undefined,
      },
      include: { items: { include: { product: true } } },
    });
  }

  async updateProductGroup(
    id: string,
    tenantId: string,
    dto: UpdateProductGroupDto,
  ): Promise<ProductGroup> {
    const { productIds, ...data } = dto;

    // If productIds provided, recreate items
    if (productIds !== undefined) {
      await this.prisma.productGroupItem.deleteMany({
        where: { groupId: id },
      });

      if (productIds.length > 0) {
        await this.prisma.productGroupItem.createMany({
          data: productIds.map((productId, index) => ({
            groupId: id,
            productId,
            order: index,
          })),
        });
      }
    }

    return this.prisma.productGroup.update({
      where: { id, tenantId },
      data,
      include: { items: { include: { product: true } } },
    });
  }

  async deleteProductGroup(
    id: string,
    tenantId: string,
  ): Promise<ProductGroup> {
    return this.prisma.productGroup.delete({
      where: { id, tenantId },
    });
  }

  // ========== PROMOTIONAL SCHEDULES ==========

  async findAllPromotions(tenantId: string): Promise<PromotionalSchedule[]> {
    return this.prisma.promotionalSchedule.findMany({
      where: { tenantId },
      include: { product: true },
      orderBy: { startDate: 'asc' },
    });
  }

  async findActivePromotions(tenantId: string): Promise<PromotionalSchedule[]> {
    const now = new Date();
    return this.prisma.promotionalSchedule.findMany({
      where: {
        tenantId,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: { product: true },
    });
  }

  async createPromotion(
    tenantId: string,
    dto: CreatePromotionalScheduleDto,
  ): Promise<PromotionalSchedule> {
    return this.prisma.promotionalSchedule.create({
      data: { ...dto, tenantId },
      include: { product: true },
    });
  }

  async updatePromotion(
    id: string,
    tenantId: string,
    dto: UpdatePromotionalScheduleDto,
  ): Promise<PromotionalSchedule> {
    return this.prisma.promotionalSchedule.update({
      where: { id, tenantId },
      data: dto,
      include: { product: true },
    });
  }

  async deletePromotion(
    id: string,
    tenantId: string,
  ): Promise<PromotionalSchedule> {
    return this.prisma.promotionalSchedule.delete({
      where: { id, tenantId },
    });
  }

  // ========== EVENTS ==========

  async findAllEvents(tenantId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { tenantId },
      orderBy: { date: 'asc' },
    });
  }

  async findUpcomingEvents(tenantId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        tenantId,
        isActive: true,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
    });
  }

  async createEvent(tenantId: string, dto: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data: { ...dto, tenantId },
    });
  }

  async updateEvent(
    id: string,
    tenantId: string,
    dto: UpdateEventDto,
  ): Promise<Event> {
    return this.prisma.event.update({
      where: { id, tenantId },
      data: dto,
    });
  }

  async deleteEvent(id: string, tenantId: string): Promise<Event> {
    return this.prisma.event.delete({
      where: { id, tenantId },
    });
  }
}
