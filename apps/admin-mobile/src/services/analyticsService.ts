import { AnalyticsData, AnalyticsFilters } from '../types/analytics';

export class AnalyticsService {
  private static readonly API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  static async getAnalytics(filters: AnalyticsFilters = { period: 'today' }): Promise<AnalyticsData> {
    try {
      const queryParams = new URLSearchParams({
        period: filters.period,
        ...(filters.dateRange && {
          startDate: filters.dateRange.start,
          endDate: filters.dateRange.end,
        }),
      });

      const response = await fetch(`${this.API_BASE_URL}/analytics?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      return data.analytics || this.getMockAnalyticsData();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return mock data for development
      return this.getMockAnalyticsData();
    }
  }

  private static getMockAnalyticsData(): AnalyticsData {
    return {
      totalOrders: 47,
      totalRevenue: 1250.50,
      averageOrderValue: 26.61,
      ordersByStatus: {
        PENDING: 5,
        PREPARING: 8,
        READY: 12,
        DELIVERED: 22,
      },
      revenueByPeriod: {
        today: 320.75,
        week: 2150.30,
        month: 8750.90,
      },
      popularItems: [
        {
          id: '1',
          name: 'Hambúrguer Clássico',
          quantity: 23,
          revenue: 575.00,
        },
        {
          id: '2',
          name: 'Pizza Margherita',
          quantity: 18,
          revenue: 630.00,
        },
        {
          id: '3',
          name: 'Refrigerante Cola',
          quantity: 35,
          revenue: 175.00,
        },
        {
          id: '4',
          name: 'Batata Frita',
          quantity: 28,
          revenue: 280.00,
        },
        {
          id: '5',
          name: 'Salada Caesar',
          quantity: 12,
          revenue: 216.00,
        },
      ],
      peakHours: [
        { hour: 12, orders: 8 },
        { hour: 13, orders: 12 },
        { hour: 14, orders: 6 },
        { hour: 18, orders: 4 },
        { hour: 19, orders: 15 },
        { hour: 20, orders: 18 },
        { hour: 21, orders: 9 },
        { hour: 22, orders: 3 },
      ],
    };
  }
}