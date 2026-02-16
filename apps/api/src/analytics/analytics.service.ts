import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfDay, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getKPIMetrics(
    tenantId: string,
    organizationId: string,
    range?: { start: Date; end: Date },
  ) {
    const end = range?.end || new Date();
    const start = range?.start || startOfDay(subDays(end, 0));
    const periodDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const previousStart = subDays(start, periodDays);
    const previousEnd = subDays(end, periodDays);

    const [currentOrders, previousOrders] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          tenantId,
          organizationId,
          createdAt: { gte: start, lte: end },
          status: { not: 'CANCELLED' },
        },
        select: { total: true, createdAt: true, updatedAt: true, status: true },
      }),
      this.prisma.order.findMany({
        where: {
          tenantId,
          organizationId,
          createdAt: { gte: previousStart, lt: start },
          status: { not: 'CANCELLED' },
        },
        select: { total: true },
      }),
    ]);

    const currentSales = currentOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0,
    );
    const previousSales = previousOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0,
    );

    const currentCount = currentOrders.length;
    const previousCount = previousOrders.length;

    const avgTicketCurrent = currentCount > 0 ? currentSales / currentCount : 0;
    const avgTicketPrevious =
      previousCount > 0 ? previousSales / previousCount : 0;

    // Table Turnover Approximation: Average time from PENDING to DELIVERED/READY
    const turnoverOrders = currentOrders.filter((o) =>
      ['DELIVERED', 'READY'].includes(o.status),
    );
    const avgTurnoverMinutes =
      turnoverOrders.length > 0
        ? turnoverOrders.reduce((sum, o) => {
            const diff =
              (o.updatedAt.getTime() - o.createdAt.getTime()) / (1000 * 60);
            return sum + diff;
          }, 0) / turnoverOrders.length
        : 0;

    return {
      sales: {
        value: currentSales,
        previousValue: previousSales,
        trend:
          previousSales > 0
            ? ((currentSales - previousSales) / previousSales) * 100
            : 0,
      },
      orders: {
        value: currentCount,
        previousValue: previousCount,
        trend:
          previousCount > 0
            ? ((currentCount - previousCount) / previousCount) * 100
            : 0,
      },
      avgTicket: {
        value: avgTicketCurrent,
        previousValue: avgTicketPrevious,
        trend:
          avgTicketPrevious > 0
            ? ((avgTicketCurrent - avgTicketPrevious) / avgTicketPrevious) * 100
            : 0,
      },
      turnover: {
        avgMinutes: Math.round(avgTurnoverMinutes),
        label: 'Tempo Médio de Atendimento',
      },
    };
  }

  async getSalesTrend(
    tenantId: string,
    organizationId: string,
    range?: { start: Date; end: Date },
    filters?: { categoryId?: string; productId?: string },
  ) {
    const end = range?.end || new Date();
    const start = range?.start || subDays(end, 6);
    // Explicitly clamp filters to undefined if empty string
    const categoryId = filters?.categoryId || undefined;
    const productId = filters?.productId || undefined;

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Base query conditions
    const whereCondition: any = {
      tenantId,
      organizationId,
      createdAt: { gte: start, lte: end },
      status: { not: 'CANCELLED' },
    };

    let salesData: { date: string; sales: number; orders: number }[] = [];

    // If filtering by product or category, we must aggregate from OrderItems
    if (categoryId || productId) {
      const orderItems = await this.prisma.orderItem.findMany({
        where: {
          tenantId,
          organizationId,
          order: {
            createdAt: { gte: start, lte: end },
            status: { not: 'CANCELLED' },
          },
          product: {
            categoryId: categoryId,
            id: productId,
          },
        },
        select: {
          price: true,
          quantity: true,
          order: {
            select: {
              createdAt: true,
            },
          },
        },
      });

      // Group by day manually
      const dailyMap = new Map<string, { sales: number; count: number }>();

      orderItems.forEach((item) => {
        // Ensure we correspond to the same day buckets as the loop above
        const date = format(item.order.createdAt, 'yyyy-MM-dd');
        const revenue = Number(item.price) * item.quantity;

        const current = dailyMap.get(date) || { sales: 0, count: 0 };
        current.sales += revenue;
        current.count += 1; // Logic note: this counts items, not distinct orders.
        dailyMap.set(date, current);
      });

      // Generate result array with empty days filled
      const fullMap = new Map();
      for (let i = 0; i < days; i++) {
        const date = format(subDays(end, days - 1 - i), 'yyyy-MM-dd');
        const data = dailyMap.get(date) || { sales: 0, count: 0 };
        fullMap.set(date, { date, sales: data.sales, orders: data.count });
      }
      salesData = Array.from(fullMap.values());
    } else {
      // Original logic for total sales (no filters)
      const orders = await this.prisma.order.findMany({
        where: whereCondition,
        select: {
          total: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      const dailyData = new Map();
      for (let i = 0; i < days; i++) {
        const date = format(subDays(end, days - 1 - i), 'yyyy-MM-dd');
        dailyData.set(date, { date, sales: 0, orders: 0 });
      }

      orders.forEach((order) => {
        const date = format(order.createdAt, 'yyyy-MM-dd');
        if (dailyData.has(date)) {
          const current = dailyData.get(date);
          current.sales += Number(order.total);
          current.orders += 1;
        }
      });
      salesData = Array.from(dailyData.values());
    }

    return salesData;
  }

  async getProductPerformance(
    tenantId: string,
    organizationId: string,
    options: {
      limit?: number;
      sortBy?: 'quantity' | 'revenue';
      order?: 'asc' | 'desc';
      range?: { start: Date; end: Date };
    },
  ) {
    const { limit = 10, sortBy = 'quantity', order = 'desc', range } = options;
    const start = range?.start;
    const end = range?.end;

    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        tenantId,
        organizationId,
        order: {
          status: { not: 'CANCELLED' },
          createdAt: start || end ? { gte: start, lte: end } : undefined,
        },
      },
      include: {
        product: {
          select: { id: true, name: true, price: true },
        },
      },
    });

    const productStats = new Map<
      string,
      { id: string; name: string | any; quantity: number; revenue: number }
    >();

    orderItems.forEach((item) => {
      const stats = productStats.get(item.productId) || {
        id: item.productId,
        name: item.product.name,
        quantity: 0,
        revenue: 0,
      };
      stats.quantity += item.quantity;
      stats.revenue += Number(item.price) * item.quantity;
      productStats.set(item.productId, stats);
    });

    const statsArray = Array.from(productStats.values());

    statsArray.sort((a, b) => {
      const valA = sortBy === 'quantity' ? a.quantity : a.revenue;
      const valB = sortBy === 'quantity' ? b.quantity : b.revenue;
      return order === 'desc' ? valB - valA : valA - valB;
    });

    return statsArray.slice(0, limit);
  }

  async getPeakHours(
    tenantId: string,
    organizationId: string,
    range?: { start: Date; end: Date },
  ) {
    const end = range?.end || new Date();
    const start = range?.start || subDays(end, 30);

    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        organizationId,
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
      select: { createdAt: true },
    });

    const hourMap = new Array(24).fill(0).map((_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      count: 0,
    }));

    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hourMap[hour].count += 1;
    });

    return hourMap;
  }

  async getCustomerProfile(
    tenantId: string,
    organizationId: string,
    customerProfileId: string,
    range?: { start: Date; end: Date },
  ) {
    const start = range?.start;
    const end = range?.end;

    const [profile, orders] = await Promise.all([
      this.prisma.customerProfile.findFirst({
        where: {
          id: customerProfileId,
          tenantId,
        },
        include: {
          user: {
            select: { email: true },
          },
        },
      }),
      this.prisma.order.findMany({
        where: {
          customerProfileId,
          tenantId,
          organizationId,
          status: { not: 'CANCELLED' },
          createdAt: start || end ? { gte: start, lte: end } : undefined,
        },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!profile) return null;

    // UserProfile for name
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { id: profile.userId as any },
      select: { name: true, email: true },
    });

    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const visitCount = orders.length;

    // Favorite Products
    const productFrequency = new Map<string, { name: any; count: number }>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const stats = productFrequency.get(item.productId) || {
          name: item.product.name,
          count: 0,
        };
        stats.count += item.quantity;
        productFrequency.set(item.productId, stats);
      });
    });

    const topProducts = Array.from(productFrequency.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Peak Hours for this customer
    const hourStats = new Array(24).fill(0);
    orders.forEach((o) => {
      hourStats[new Date(o.createdAt).getHours()]++;
    });

    const peakHour = hourStats.indexOf(Math.max(...hourStats));

    // Loyalty Metrics
    const pointsEarned = await this.prisma.pointsTransaction.aggregate({
      where: {
        customerProfileId,
        tenantId,
        type: 'EARNED',
        createdAt: start || end ? { gte: start, lte: end } : undefined,
      },
      _sum: { amount: true },
    });

    // Alternative approach for discounts if the above relation is complex or if rewards are tracked differently:
    // We can query orders directly if they have a loyaltyRewardId and sum the reward value.
    const ordersWithRewards = await this.prisma.order.findMany({
      where: {
        customerProfileId,
        tenantId,
        status: { not: 'CANCELLED' },
        loyaltyRewardId: { not: null },
        createdAt: start || end ? { gte: start, lte: end } : undefined,
      },
      include: {
        loyaltyReward: true,
      },
    });

    const totalDiscountsValue = ordersWithRewards.reduce((sum, o) => {
      return (
        sum +
        (o.loyaltyReward?.discountAmount
          ? Number(o.loyaltyReward.discountAmount)
          : 0)
      );
    }, 0);

    return {
      profile: {
        id: profile.id,
        name: userProfile?.name || userProfile?.email || profile.user.email,
        email: userProfile?.email || profile.user.email,
        memberSince: profile.createdAt,
        pointsBalance: profile.pointsBalance,
      },
      stats: {
        totalSpent,
        visitCount,
        avgTicket: visitCount > 0 ? totalSpent / visitCount : 0,
        peakHour: `${peakHour.toString().padStart(2, '0')}:00`,
        favoriteProduct: topProducts[0]?.name || null,
        loyaltyPointsEarned: pointsEarned._sum.amount || 0,
        loyaltyDiscountsValue: totalDiscountsValue,
      },
      topProducts,
      recentOrders: orders.slice(0, 10).map((o) => ({
        id: o.id,
        createdAt: o.createdAt,
        total: Number(o.total),
        items: o.items.length,
        status: o.status,
      })),
    };
  }

  async getCustomerRanking(
    tenantId: string,
    organizationId: string,
    options: {
      limit?: number;
      sortBy?: 'totalSpent' | 'orders' | 'lastVisit' | 'points';
      order?: 'asc' | 'desc';
      range?: { start: Date; end: Date };
    } = {},
  ) {
    const {
      limit = 10,
      sortBy = 'totalSpent',
      order = 'desc',
      range,
    } = options;
    const limitNum = Math.floor(Number(limit) || 10);

    const ranking = await this.prisma.order.groupBy({
      by: ['customerProfileId'],
      where: {
        tenantId,
        organizationId,
        customerProfileId: { not: null },
        status: { not: 'CANCELLED' },
        ...(range && { createdAt: { gte: range.start, lte: range.end } }),
      },
      _sum: { total: true },
      _count: { id: true },
      _max: { createdAt: true },
      orderBy:
        sortBy === 'totalSpent'
          ? { _sum: { total: order } }
          : sortBy === 'orders'
            ? { _count: { id: order } }
            : { _max: { createdAt: order } },
      take: limitNum,
    });

    const profiles = await this.prisma.customerProfile.findMany({
      where: { id: { in: ranking.map((r) => r.customerProfileId as string) } },
      include: {
        user: { select: { email: true } },
      },
    });

    const userProfiles = await this.prisma.userProfile.findMany({
      where: { id: { in: profiles.map((p) => p.userId) } as any },
      select: { id: true, name: true, email: true },
    });

    const results = ranking.map((r) => {
      const profile = profiles.find((p) => p.id === r.customerProfileId);
      const userProfile = userProfiles.find((up) => up.id === profile?.userId);
      return {
        id: r.customerProfileId,
        name: userProfile?.name || userProfile?.email || 'Cliente Anônimo',
        orders: r._count.id,
        totalSpent: Number(r._sum.total),
        lastVisit: r._max.createdAt,
        points: profile?.pointsBalance || 0,
      };
    });

    if (sortBy === 'points') {
      return results.sort((a, b) =>
        order === 'desc' ? b.points - a.points : a.points - b.points,
      );
    }

    return results;
  }

  async getTableRanking(tenantId: string, organizationId: string, limit = 5) {
    const ranking = await this.prisma.order.groupBy({
      by: ['tableId'],
      where: {
        tenantId,
        organizationId,
        tableId: { not: null },
        status: { not: 'CANCELLED' },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: limit,
    });

    const tables = await this.prisma.table.findMany({
      where: { id: { in: ranking.map((r) => r.tableId as string) } },
      select: { id: true, number: true },
    });

    return ranking.map((r) => {
      const table = tables.find((t) => t.id === r.tableId);
      return {
        id: r.tableId,
        number: table?.number || 0,
        orders: r._count.id,
        revenue: Number(r._sum.total),
        avgTicket: r._count.id > 0 ? Number(r._sum.total) / r._count.id : 0,
      };
    });
  }

  async getAdvancedMetrics(
    tenantId: string,
    organizationId: string,
    range?: { start: Date; end: Date },
  ) {
    const end = range?.end || new Date();
    const start = range?.start || subDays(end, 30);

    // 1. Menu Engineering Matrix
    const items = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        tenantId,
        organizationId,
        order: {
          createdAt: { gte: start, lte: end },
          status: { not: 'CANCELLED' },
        },
      },
      _sum: { quantity: true, price: true },
      _count: { id: true },
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      select: { id: true, name: true, price: true },
    });

    const totalQuantity = items.reduce(
      (sum, i) => sum + (i._sum.quantity || 0),
      0,
    );
    const totalRevenue = items.reduce(
      (sum, i) => sum + Number(i._sum.price) * (i._sum.quantity || 0),
      0,
    );
    const avgPopularity = totalQuantity / (items.length || 1);

    const menuMatrix = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const quantity = item._sum.quantity || 0;
      const revenue = Number(item._sum.price) * quantity;

      // Profitability Proxy (using Revenue since cost is missing)
      const isPopular = quantity >= avgPopularity;
      const isProfitable = revenue >= totalRevenue / (items.length || 1);

      let category: 'STAR' | 'WORKHORSE' | 'PUZZLE' | 'DOG';
      if (isPopular && isProfitable) category = 'STAR';
      else if (isPopular && !isProfitable) category = 'WORKHORSE';
      else if (!isPopular && isProfitable) category = 'PUZZLE';
      else category = 'DOG';

      return {
        productId: item.productId,
        name: product?.name || 'Produto Removido',
        quantity,
        revenue,
        category,
      };
    });

    // 2. Retention Stats
    const totalCustomersInPeriod = await this.prisma.order.groupBy({
      by: ['customerProfileId'],
      where: {
        tenantId,
        organizationId,
        customerProfileId: { not: null },
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
    });

    const returningCustomers = await this.prisma.order.groupBy({
      by: ['customerProfileId'],
      where: {
        tenantId,
        organizationId,
        customerProfileId: { not: null },
        status: { not: 'CANCELLED' },
        createdAt: { lt: start },
      },
    });

    const returningIds = new Set(
      returningCustomers.map((c) => c.customerProfileId),
    );
    const retainedCount = totalCustomersInPeriod.filter((c) =>
      returningIds.has(c.customerProfileId),
    ).length;

    // 3. Loyalty Impact
    const loyaltyRevenue = await this.prisma.order.aggregate({
      where: {
        tenantId,
        organizationId,
        customerProfileId: { not: null },
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
    });

    const nonLoyaltyRevenue = await this.prisma.order.aggregate({
      where: {
        tenantId,
        organizationId,
        customerProfileId: null,
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
    });

    return {
      menuMatrix,
      retention: {
        total: totalCustomersInPeriod.length,
        returning: retainedCount,
        rate:
          totalCustomersInPeriod.length > 0
            ? (retainedCount / totalCustomersInPeriod.length) * 100
            : 0,
      },
      loyaltyROI: {
        memberRevenue: Number(loyaltyRevenue._sum.total || 0),
        nonMemberRevenue: Number(nonLoyaltyRevenue._sum.total || 0),
      },
    };
  }
}
