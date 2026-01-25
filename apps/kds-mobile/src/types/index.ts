export interface Order {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  customerName?: string;
  tableNumber?: number;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number; // in minutes
  priority: OrderPriority;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  customizations?: string[];
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface KDSSettings {
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showCompletedOrders: boolean;
  maxOrdersDisplayed: number;
}

export interface KDSStats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  averagePrepTime: number;
}