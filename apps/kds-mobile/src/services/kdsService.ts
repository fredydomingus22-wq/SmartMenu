import io, { Socket } from 'socket.io-client';
import { store } from '../store';
import { setOrders, updateOrder, addOrder, setConnected, setError } from '../store/slices/kdsSlice';
import { Order } from '../types';

class KDSServiceClass {
  private socket: Socket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  async initialize(): Promise<void> {
    await this.connect();
    this.setupEventListeners();
  }

  private async connect(): Promise<void> {
    try {
      this.socket = io(`${this.API_BASE_URL}/kds`, {
        transports: ['websocket'],
        timeout: 5000,
        forceNew: true,
      });

      this.socket.on('connect', () => {
        console.log('KDS connected to server');
        store.dispatch(setConnected(true));
        this.loadInitialOrders();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('KDS disconnected:', reason);
        store.dispatch(setConnected(false));
        this.scheduleReconnect();
      });

      this.socket.on('connect_error', (error) => {
        console.error('KDS connection error:', error);
        store.dispatch(setError('Connection failed'));
        this.scheduleReconnect();
      });

    } catch (error) {
      console.error('Failed to initialize KDS service:', error);
      store.dispatch(setError('Initialization failed'));
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Listen for order updates
    this.socket.on('order:new', (order: Order) => {
      console.log('New order received:', order.id);
      store.dispatch(addOrder(order));
      this.playNotificationSound();
    });

    this.socket.on('order:updated', (order: Order) => {
      console.log('Order updated:', order.id, order.status);
      store.dispatch(updateOrder(order));
    });

    this.socket.on('order:removed', (orderId: string) => {
      console.log('Order removed:', orderId);
      // Note: We don't have a removeOrder action, orders are filtered by status
    });
  }

  private async loadInitialOrders(): Promise<void> {
    try {
      // Load active orders from API
      const response = await fetch(`${this.API_BASE_URL}/api/orders/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const orders: Order[] = await response.json();
        store.dispatch(setOrders(orders));
      } else {
        // Fallback to mock data for development
        this.loadMockOrders();
      }
    } catch (error) {
      console.error('Failed to load initial orders:', error);
      this.loadMockOrders();
    }
  }

  private loadMockOrders(): void {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 1001,
        status: 'PENDING',
        items: [
          { id: '1', name: 'Hamburger', quantity: 2, notes: 'Sem cebola' },
          { id: '2', name: 'Batata Frita', quantity: 1 },
        ],
        customerName: 'João Silva',
        tableNumber: 5,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'NORMAL',
      },
      {
        id: '2',
        orderNumber: 1002,
        status: 'PREPARING',
        items: [
          { id: '3', name: 'Pizza Margherita', quantity: 1, customizations: ['Extra queijo'] },
        ],
        customerName: 'Maria Santos',
        tableNumber: 12,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedTime: 20,
        priority: 'HIGH',
      },
      {
        id: '3',
        orderNumber: 1003,
        status: 'READY',
        items: [
          { id: '4', name: 'Salada Caesar', quantity: 1 },
          { id: '5', name: 'Refrigerante', quantity: 2 },
        ],
        customerName: 'Pedro Costa',
        tableNumber: 8,
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'NORMAL',
      },
    ];

    store.dispatch(setOrders(mockOrders));
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        store.dispatch(updateOrder(updatedOrder));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  }

  private playNotificationSound(): void {
    // In a real implementation, this would play a sound
    // For now, we'll just log it
    console.log('🔔 New order notification!');
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect KDS...');
      this.connect();
    }, 5000);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    store.dispatch(setConnected(false));
  }
}

export const KDSService = new KDSServiceClass();