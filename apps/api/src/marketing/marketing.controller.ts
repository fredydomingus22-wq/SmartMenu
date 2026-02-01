import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    Banner,
    ProductGroup,
    PromotionalSchedule,
    Event as RestaurantEvent,
} from '@prisma/client';
import { MarketingService } from './marketing.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
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

@Controller('marketing')
export class MarketingController {
    constructor(private readonly marketingService: MarketingService) { }

    // ========== PUBLIC ENDPOINTS ==========

    @Get('public/banners/:tenantId')
    async getPublicBanners(@Param('tenantId') tenantId: string): Promise<Banner[]> {
        return this.marketingService.findBannersByType(tenantId, 'hero');
    }

    @Get('public/groups/:tenantId')
    async getPublicGroups(@Param('tenantId') tenantId: string): Promise<ProductGroup[]> {
        return this.marketingService.findAllProductGroups(tenantId);
    }

    @Get('public/groups/:tenantId/:slug')
    async getPublicGroupBySlug(
        @Param('tenantId') tenantId: string,
        @Param('slug') slug: string,
    ): Promise<ProductGroup | null> {
        return this.marketingService.findProductGroupBySlug(tenantId, slug);
    }

    @Get('public/events/:tenantId')
    async getPublicEvents(@Param('tenantId') tenantId: string): Promise<RestaurantEvent[]> {
        return this.marketingService.findUpcomingEvents(tenantId);
    }

    @Get('public/promotions/:tenantId')
    async getPublicPromotions(@Param('tenantId') tenantId: string): Promise<PromotionalSchedule[]> {
        return this.marketingService.findActivePromotions(tenantId);
    }

    // ========== BANNERS (PROTECTED) ==========

    @UseGuards(SupabaseAuthGuard)
    @Get('banners')
    async getBanners(@Request() req: AuthenticatedRequest): Promise<Banner[]> {
        return this.marketingService.findAllBanners(req.user.tenantId);
    }

    @UseGuards(SupabaseAuthGuard)
    @Post('banners')
    async createBanner(
        @Request() req: AuthenticatedRequest,
        @Body() dto: CreateBannerDto,
    ): Promise<Banner> {
        return this.marketingService.createBanner(req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Put('banners/:id')
    async updateBanner(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() dto: UpdateBannerDto,
    ): Promise<Banner> {
        return this.marketingService.updateBanner(id, req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete('banners/:id')
    async deleteBanner(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
    ): Promise<Banner> {
        return this.marketingService.deleteBanner(id, req.user.tenantId);
    }

    // ========== PRODUCT GROUPS (PROTECTED) ==========

    @UseGuards(SupabaseAuthGuard)
    @Get('groups')
    async getProductGroups(
        @Request() req: AuthenticatedRequest,
    ): Promise<ProductGroup[]> {
        return this.marketingService.findAllProductGroups(req.user.tenantId);
    }

    @UseGuards(SupabaseAuthGuard)
    @Post('groups')
    async createProductGroup(
        @Request() req: AuthenticatedRequest,
        @Body() dto: CreateProductGroupDto,
    ): Promise<ProductGroup> {
        return this.marketingService.createProductGroup(req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Put('groups/:id')
    async updateProductGroup(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() dto: UpdateProductGroupDto,
    ): Promise<ProductGroup> {
        return this.marketingService.updateProductGroup(
            id,
            req.user.tenantId,
            dto,
        );
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete('groups/:id')
    async deleteProductGroup(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
    ): Promise<ProductGroup> {
        return this.marketingService.deleteProductGroup(id, req.user.tenantId);
    }

    // ========== PROMOTIONAL SCHEDULES (PROTECTED) ==========

    @UseGuards(SupabaseAuthGuard)
    @Get('promotions')
    async getPromotions(
        @Request() req: AuthenticatedRequest,
        @Query('active') active?: string,
    ): Promise<PromotionalSchedule[]> {
        if (active === 'true') {
            return this.marketingService.findActivePromotions(req.user.tenantId);
        }
        return this.marketingService.findAllPromotions(req.user.tenantId);
    }

    @UseGuards(SupabaseAuthGuard)
    @Post('promotions')
    async createPromotion(
        @Request() req: AuthenticatedRequest,
        @Body() dto: CreatePromotionalScheduleDto,
    ): Promise<PromotionalSchedule> {
        return this.marketingService.createPromotion(req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Put('promotions/:id')
    async updatePromotion(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() dto: UpdatePromotionalScheduleDto,
    ): Promise<PromotionalSchedule> {
        return this.marketingService.updatePromotion(id, req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete('promotions/:id')
    async deletePromotion(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
    ): Promise<PromotionalSchedule> {
        return this.marketingService.deletePromotion(id, req.user.tenantId);
    }

    // ========== EVENTS (PROTECTED) ==========

    @UseGuards(SupabaseAuthGuard)
    @Get('events')
    async getEvents(
        @Request() req: AuthenticatedRequest,
        @Query('upcoming') upcoming?: string,
    ): Promise<RestaurantEvent[]> {
        if (upcoming === 'true') {
            return this.marketingService.findUpcomingEvents(req.user.tenantId);
        }
        return this.marketingService.findAllEvents(req.user.tenantId);
    }

    @UseGuards(SupabaseAuthGuard)
    @Post('events')
    async createEvent(
        @Request() req: AuthenticatedRequest,
        @Body() dto: CreateEventDto,
    ): Promise<RestaurantEvent> {
        return this.marketingService.createEvent(req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Put('events/:id')
    async updateEvent(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() dto: UpdateEventDto,
    ): Promise<RestaurantEvent> {
        return this.marketingService.updateEvent(id, req.user.tenantId, dto);
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete('events/:id')
    async deleteEvent(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: string,
    ): Promise<RestaurantEvent> {
        return this.marketingService.deleteEvent(id, req.user.tenantId);
    }
}
