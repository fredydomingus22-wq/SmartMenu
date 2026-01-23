import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { Order, OrderStatus, Product } from '@prisma/client';

@Injectable()
export class OrdersService {
  private supabase!: SupabaseClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private loyaltyService: LoyaltyService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (supabaseUrl && supabaseAnonKey) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
  }

  private async broadcastOrderEvent(
    tenantId: string,
    event: 'ORDER_CREATED' | 'STATUS_UPDATED',
    payload: unknown,
  ) {
    if (!this.supabase) return;

    await this.supabase.channel(`orders:${tenantId}`).send({
      type: 'broadcast',
      event,
      payload,
    });
  }

  async create(
    createOrderDto: CreateOrderDto,
    tenantId: string,
    organizationId: string,
    userId?: string,
  ) {
    const { tableId, items } = createOrderDto;

    // 1. Fetch products & option values to get official prices
    const productIds = items.map((i) => i.productId);
    const optionValueIds = items.flatMap((i) =>
      (i.options || []).map((o) => o.valueId),
    );

    const [products, optionValues] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          id: { in: productIds },
          tenantId,
          organizationId,
          isAvailable: true,
        },
      }),
      optionValueIds.length > 0
        ? this.prisma.productOptionValue.findMany({
          where: {
            id: { in: optionValueIds },
            tenantId,
            organizationId,
            isAvailable: true,
          },
        })
        : [],
    ]);

    if (products.length !== items.length) {
      throw new Error('One or more products are invalid or unavailable');
    }

    // Identify missing option values if any were requested
    if (
      optionValueIds.length > 0 &&
      optionValues.length !== Array.from(new Set(optionValueIds)).length
    ) {
      throw new Error(
        'One or more selected options are invalid or unavailable',
      );
    }

    let total = 0;

    const order = await this.prisma.$transaction(async (tx) => {
      // Calculate total and prepare items
      const orderItemsData = items.map((item) => {
        const product = products.find((p: Product) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        let itemSubtotal = Number(product.price);

        // Calculate options extra price
        const itemOptions = (item.options || []).map((opt) => {
          const val = optionValues.find((v) => v.id === opt.valueId);
          if (!val) throw new Error(`Option value ${opt.valueId} not found`);
          itemSubtotal += Number(val.price);
          return {
            productOptionValueId: val.id,
            price: val.price, // Use official DB price
            tenantId,
            organizationId,
          };
        });

        total += itemSubtotal * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          tenantId,
          organizationId,
          options: {
            create: itemOptions,
          },
        };
      });

      const newOrder = await tx.order.create({
        data: {
          tenantId,
          organizationId,
          tableId,
          userId,
          total,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
              options: {
                include: { optionValue: true },
              },
            },
          },
          table: true,
        },
      });
      return newOrder;
    });

    // 4. Broadcast event
    await this.broadcastOrderEvent(tenantId, 'ORDER_CREATED', order);

    return order;
  }

  async findAll(tenantId: string, organizationId: string) {
    return this.prisma.order.findMany({
      where: { tenantId, organizationId },
      include: {
        items: {
          include: { product: true },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string, organizationId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId, organizationId },
      include: {
        items: {
          include: { product: true },
        },
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Public order lookup by ID only (for customer tracking).
   * Does NOT require tenantId/organizationId for flexibility.
   */
  async findOnePublic(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true }
            },
            options: {
              include: {
                optionValue: {
                  select: { id: true, name: true, price: true }
                }
              }
            }
          },
        },
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, tenantId: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
            options: {
              include: { optionValue: true },
            },
          },
        },
        table: true,
      },
    });

    // Broadcast update
    await this.broadcastOrderEvent(tenantId, 'STATUS_UPDATED', order);

    // Loyalty Points Logic
    if (status === 'DELIVERED' && order.userId) {
      try {
        await this.loyaltyService.earnPoints(
          order.userId,
          tenantId,
          Number(order.total),
          order.id,
        );
      } catch (error) {
        console.error(`Failed to award points for order ${id}:`, error);
      }
    }

    return order;
  }

  async findAllForKitchen(tenantId: string, organizationId: string) {
    return this.prisma.order.findMany({
      where: {
        tenantId,
        organizationId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'],
        },
      },
      include: {
        items: {
          include: {
            product: true,
            options: {
              include: { optionValue: true },
            },
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'asc' }, // Older first (FIFO)
    });
  }
}
