// Shared types for the admin mobile app
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'ADMIN';
  restaurantId: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  total: number;
  createdAt: string;
  estimatedTime?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  prepTime?: number;
}