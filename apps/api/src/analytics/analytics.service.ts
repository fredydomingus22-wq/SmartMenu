import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfDay, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getKPIMetrics(tenantId: string, organizationId: string) {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    const [todayOrders, yesterdayOrders] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          tenantId,
          organizationId,
          createdAt: { gte: today },
          status: { not: 'CANCELLED' },
        },
        select: { total: true },
      }),
      this.prisma.order.findMany({
        where: {
          tenantId,
          organizationId,
          createdAt: { gte: yesterday, lt: today },
          status: { not: 'CANCELLED' },
        },
        select: { total: true },
      }),
    ]);

    const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const yesterdaySales = yesterdayOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0,
    );

    const todayCount = todayOrders.length;
    const yesterdayCount = yesterdayOrders.length;

    const avgTicketToday = todayCount > 0 ? todaySales / todayCount : 0;
    const avgTicketYesterday =
      yesterdayCount > 0 ? yesterdaySales / yesterdayCount : 0;

    return {
      sales: {
        value: todaySales,
        previousValue: yesterdaySales,
        trend:
          yesterdaySales > 0
            ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
            : 0,
      },
      orders: {
        value: todayCount,
        previousValue: yesterdayCount,
        trend:
          yesterdayCount > 0
            ? ((todayCount - yesterdayCount) / yesterdayCount) * 100
            : 0,
      },
      avgTicket: {
        value: avgTicketToday,
        previousValue: avgTicketYesterday,
        trend:
          avgTicketYesterday > 0
            ? ((avgTicketToday - avgTicketYesterday) / avgTicketYesterday) * 100
            : 0,
      },
    };
  }

  async getSalesTrend(tenantId: string, organizationId: string, days = 7) {
    const startDate = startOfDay(subDays(new Date(), days - 1));

    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        organizationId,
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyData = new Map();
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
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

    return Array.from(dailyData.values());
  }

  async getProductRanking(
    tenantId: string,
    organizationId: string,
    limit = 10,
  ) {
    const ranking = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        tenantId,
        organizationId,
        order: { status: { not: 'CANCELLED' } },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: ranking.map((r) => r.productId) } },
      select: { id: true, name: true, price: true },
    });

    return ranking.map((r) => {
      const product = products.find((p) => p.id === r.productId);
      return {
        id: r.productId,
        name: product?.name || 'Unknown',
        quantity: r._sum.quantity,
        revenue: Number(r._sum.quantity) * Number(product?.price || 0),
      };
    });
  }

  async getPeakHours(tenantId: string, organizationId: string, days = 30) {
    const startDate = startOfDay(subDays(new Date(), days));

    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        organizationId,
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' },
      },
      select: { createdAt: true },
    });

    const hourMap = new Array(24).fill(0).map((_, i) => ({
      hour: i,
      count: 0,
    }));

    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hourMap[hour].count += 1;
    });

    return hourMap;
  }

  async getCustomerRanking(
    tenantId: string,
    organizationId: string,
    limit = 5,
  ) {
    const ranking = await this.prisma.order.groupBy({
      by: ['customerProfileId'],
      where: {
        tenantId,
        organizationId,
        customerProfileId: { not: null },
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

    const profiles = await this.prisma.customerProfile.findMany({
      where: { id: { in: ranking.map((r) => r.customerProfileId as string) } },
      include: {
        user: {
          select: {
            email: true,
            // UserProfile for name
          },
        },
      },
    });

    // Fetch UserProfiles separately if needed, but schema shows CustomerProfile -> users (auth schema)
    // Let's check UserProfile in public schema which has the 'name'
    const userProfiles = await this.prisma.userProfile.findMany({
      where: { id: { in: profiles.map((p) => p.userId) } as any }, // userId is Uuid, might need casting
      select: { id: true, name: true, email: true },
    });

    return ranking.map((r) => {
      const profile = profiles.find((p) => p.id === r.customerProfileId);
      const userProfile = userProfiles.find((up) => up.id === profile?.userId);
      return {
        id: r.customerProfileId,
        name: userProfile?.name || userProfile?.email || 'Cliente Anônimo',
        orders: r._count.id,
        totalSpent: Number(r._sum.total),
      };
    });
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
}
