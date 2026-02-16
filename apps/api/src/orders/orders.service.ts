import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderDto } from './dto/create-order.dto';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { OrderStatus, Product } from '@prisma/client';
import { OrderStatusUpdatedEvent } from '../workflows/events/order-status-updated.event';
import { OrderCreatedEvent } from '../workflows/events/order-created.event';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private loyaltyService: LoyaltyService,
    private eventEmitter: EventEmitter2,
    private supabaseService: SupabaseService,
  ) {}

  private async broadcastOrderEvent(
    tenantId: string,
    event: 'ORDER_CREATED' | 'STATUS_UPDATED',
    payload: unknown,
  ) {
    console.log(
      `[OrdersService] Requesting broadcast for event ${event} to channel orders:${tenantId}`,
    );
    await this.supabaseService.broadcast(`orders:${tenantId}`, event, payload);
  }

  async create(
    createOrderDto: CreateOrderDto,
    tenantId: string,
    providedOrganizationId: string,
    userId?: string,
  ) {
    const { tableId, items, orderType, deliveryAddress } = createOrderDto;

    // 0. Resolve correct organizationId from Tenant (Safety)
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { organizationId: true },
    });
    if (!tenant) throw new Error('Restaurant not found');
    const organizationId = tenant.organizationId;

    // Resolve Table UUID if manual number provided
    let finalTableId = tableId && tableId.trim() !== '' ? tableId : null;
    if (orderType === 'DINE_IN_GENERAL' && tableId) {
      // If it's not a UUID, assume it's a table number and resolve it
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          tableId,
        );

      if (!isUuid) {
        const tableNumber = parseInt(tableId, 10);
        if (!isNaN(tableNumber)) {
          const table = await this.prisma.table.findFirst({
            where: {
              tenantId,
              number: tableNumber,
            },
          });
          if (!table) {
            throw new Error(
              `Table ${tableNumber} not found in this restaurant`,
            );
          }
          finalTableId = table.id;
        }
      }
    }

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
          isAvailable: true,
        },
      }),
      optionValueIds.length > 0
        ? this.prisma.productOptionValue.findMany({
            where: {
              id: { in: optionValueIds },
              tenantId,
              isAvailable: true,
            },
          })
        : [],
    ]);

    const uniqueProductIds = new Set(productIds);
    if (products.length !== uniqueProductIds.size) {
      const foundIds = products.map((p: Product) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      console.error('[OrdersService] Product validation failed:', {
        requestedIds: productIds,
        foundIds,
        missingIds,
        tenantId,
        organizationId,
      });
      throw new Error(
        `One or more products are invalid or unavailable: ${missingIds.join(', ')}`,
      );
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

    const { loyaltyRewardId } = createOrderDto;
    let appliedReward = null;

    if (loyaltyRewardId && userId) {
      appliedReward = await this.prisma.loyaltyReward.findUnique({
        where: { id: loyaltyRewardId, tenantId, isActive: true },
      });

      if (!appliedReward) {
        throw new Error('Loyalty reward not found or inactive');
      }

      const points = await this.loyaltyService.getCustomerPoints(
        userId,
        tenantId,
      );
      if (points < appliedReward.pointsRequired) {
        throw new Error('Insufficient loyalty points');
      }
    }

    let total = 0;

    try {
      // Calculate total and prepare items (no DB calls needed here)
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
            price: val.price,
            tenantId,
            organizationId,
          };
        });

        // Handle Free Product Reward (applies only once)
        if (appliedReward?.productId === item.productId) {
          total += itemSubtotal * (item.quantity - 1);
          appliedReward.productId = null;
        } else {
          total += itemSubtotal * item.quantity;
        }

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

      // Apply Fixed Discount Reward
      if (appliedReward?.discountAmount) {
        total = Math.max(0, total - Number(appliedReward.discountAmount));
      }

      // Resolve Customer Profile if userId present (sequential query)
      let customerProfileId: string | null = null;
      if (userId) {
        const profile = await this.loyaltyService.getCustomerProfile(
          userId,
          tenantId,
        );
        customerProfileId = profile.id;
      }

      // Create the order (single atomic operation)
      const order = await this.prisma.order.create({
        data: {
          tenant: { connect: { id: tenantId } },
          organization: { connect: { id: organizationId } },
          ...(finalTableId && { table: { connect: { id: finalTableId } } }),
          ...(userId && { user: { connect: { id: userId } } }),
          ...(customerProfileId && {
            customerProfile: { connect: { id: customerProfileId } },
          }),
          total,
          status: 'PENDING',
          orderType: orderType || 'DINE_IN',
          deliveryAddress: deliveryAddress || null,
          ...(loyaltyRewardId && {
            loyaltyReward: { connect: { id: loyaltyRewardId } },
          }),
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

      // Trigger points deduction (sequential, after order created)
      if (loyaltyRewardId && userId) {
        await this.loyaltyService.redeemReward(
          userId,
          tenantId,
          loyaltyRewardId,
        );
      }

      // Broadcast event
      await this.broadcastOrderEvent(tenantId, 'ORDER_CREATED', order);

      // Emit internal event for automation
      this.eventEmitter.emit(
        'order.created',
        new OrderCreatedEvent(
          order.id,
          tenantId,
          userId || null,
          order.items.map((i: { productId: string; quantity: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          Number(order.total),
        ),
      );

      return order;
    } catch (error) {
      console.error('[OrdersService] Error creating order:', error);
      throw error;
    }
  }

  async findAll(tenantId: string, organizationId: string, scope?: string) {
    const where: Record<string, unknown> = { tenantId, organizationId };

    if (scope === 'active') {
      where.status = {
        in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'],
      };
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
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
              select: { id: true, name: true, imageUrl: true },
            },
            options: {
              include: {
                optionValue: {
                  select: { id: true, name: true, price: true },
                },
              },
            },
          },
        },
        table: true,
        deliveryAssignment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    tenantId: string,
    reason?: string,
  ) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status,
        ...(reason && { cancellationReason: reason }),
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

    // Broadcast update
    await this.broadcastOrderEvent(tenantId, 'STATUS_UPDATED', order);

    // Emit internal event for automation (Loyalty, Notifications, etc)
    this.eventEmitter.emit(
      'order.status.updated',
      new OrderStatusUpdatedEvent(
        order.id,
        tenantId,
        order.userId,
        status,
        Number(order.total),
      ),
    );

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
            product: {
              include: { category: true },
            },
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
