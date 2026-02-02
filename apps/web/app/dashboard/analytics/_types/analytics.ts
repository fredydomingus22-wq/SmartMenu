export interface AnalyticsKPI {
    value: number;
    previousValue: number;
    trend: number;
}

export interface AnalyticsKPIs {
    sales: AnalyticsKPI;
    orders: AnalyticsKPI;
    avgTicket: AnalyticsKPI;
    turnover: {
        avgMinutes: number;
        label: string;
    };
}

export interface SalesTrendData {
    date: string;
    sales: number;
    orders: number;
}

export interface ProductPerformance {
    id: string;
    name: Record<string, string>;
    quantity: number;
    revenue: number;
}

export interface PeakHourData {
    hour: number;
    count: number;
}

export interface CustomerRanking {
    id: string;
    name: string;
    email: string | null;
    orders: number;
    totalSpent: number;
    lastVisit: string;
    points: number;
}

export interface TableRanking {
    id: string;
    number: number;
    orders: number;
    revenue: number;
}

export interface CustomerProfileStats {
    totalSpent: number;
    visitCount: number;
    avgTicket: number;
    peakHour: string;
    favoriteProduct: Record<string, string> | null;
    loyaltyPointsEarned: number;
    loyaltyDiscountsValue: number;
}

export interface CustomerProfileData {
    profile: {
        id: string;
        name: string;
        email: string;
        memberSince: string;
        pointsBalance: number;
    };
    stats: CustomerProfileStats;
    topProducts: Array<{ name: Record<string, string>; count: number }>;
    recentOrders: Array<{
        id: string;
        createdAt: string;
        total: number;
        items: number;
        status: string;
    }>;
}
export interface MenuMatrixItem {
    productId: string;
    name: Record<string, string>;
    quantity: number;
    revenue: number;
    category: 'STAR' | 'WORKHORSE' | 'PUZZLE' | 'DOG';
}

export interface AdvancedMetrics {
    menuMatrix: MenuMatrixItem[];
    retention: {
        total: number;
        returning: number;
        rate: number;
    };
    loyaltyROI: {
        memberRevenue: number;
        nonMemberRevenue: number;
    };
}
