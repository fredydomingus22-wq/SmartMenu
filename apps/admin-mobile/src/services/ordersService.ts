import { Order } from '../types';

export class OrdersService {
  static async getOrders(): Promise<Order[]> {
    // Mock data - in production, this would call your API
    return [
      {
        id: '1',
        customerName: 'João Silva',
        items: [
          { id: '1', name: 'Pizza Margherita', quantity: 1, price: 45 },
          { id: '2', name: 'Refrigerante', quantity: 2, price: 8 },
        ],
        status: 'PENDING',
        total: 61,
        createdAt: new Date().toISOString(),
        estimatedTime: 25,
      },
      {
        id: '2',
        customerName: 'Maria Santos',
        items: [
          { id: '3', name: 'Hambúrguer', quantity: 1, price: 25 },
          { id: '4', name: 'Batata Frita', quantity: 1, price: 12 },
        ],
        status: 'PREPARING',
        total: 37,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        estimatedTime: 15,
      },
      {
        id: '3',
        customerName: 'Pedro Costa',
        items: [
          { id: '5', name: 'Salada Caesar', quantity: 1, price: 22 },
        ],
        status: 'READY',
        total: 22,
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
    ];
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    // Mock API call - in production, this would update the order status
    console.log(`Updating order ${orderId} to status ${status}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}