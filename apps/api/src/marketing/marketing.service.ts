import { Injectable } from '@nestjs/common';
import {
    Banner,
    ProductGroup,
    PromotionalSchedule,
    Event,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
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
    constructor(private prisma: PrismaService) { }

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

    async deleteProductGroup(id: string, tenantId: string): Promise<ProductGroup> {
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
