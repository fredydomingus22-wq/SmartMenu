export interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: {
    PENDING: number;
    PREPARING: number;
    READY: number;
    DELIVERED: number;
  };
  revenueByPeriod: {
    today: number;
    week: number;
    month: number;
  };
  popularItems: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  peakHours: Array<{
    hour: number;
    orders: number;
  }>;
}

export interface AnalyticsFilters {
  period: 'today' | 'week' | 'month' | 'year';
  dateRange?: {
    start: string;
    end: string;
  };
}