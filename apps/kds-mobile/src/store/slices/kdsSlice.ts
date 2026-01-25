import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  customizations?: string[];
}

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

type OrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

interface KDSSettings {
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showCompletedOrders: boolean;
  maxOrdersDisplayed: number;
}

interface KDSStats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  averagePrepTime: number;
}

interface KDSState {
  orders: Order[];
  settings: KDSSettings;
  stats: KDSStats;
  isConnected: boolean;
  lastUpdate: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: KDSState = {
  orders: [],
  settings: {
    autoRefresh: true,
    refreshInterval: 30,
    soundEnabled: true,
    vibrationEnabled: true,
    showCompletedOrders: false,
    maxOrdersDisplayed: 20,
  },
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    averagePrepTime: 0,
  },
  isConnected: false,
  lastUpdate: null,
  loading: false,
  error: null,
};

const kdsSlice = createSlice({
  name: 'kds',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.lastUpdate = new Date().toISOString();
      state.loading = false;
      state.error = null;

      // Update stats
      state.stats.totalOrders = action.payload.length;
      state.stats.pendingOrders = action.payload.filter(o => o.status === 'PENDING').length;
      state.stats.preparingOrders = action.payload.filter(o => o.status === 'PREPARING').length;
      state.stats.readyOrders = action.payload.filter(o => o.status === 'READY').length;
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
        state.lastUpdate = new Date().toISOString();
      }
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.stats.totalOrders += 1;
      state.lastUpdate = new Date().toISOString();
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
      state.stats.totalOrders = Math.max(0, state.stats.totalOrders - 1);
    },
    setSettings: (state, action: PayloadAction<Partial<KDSSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCompletedOrders: (state) => {
      state.orders = state.orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        state.lastUpdate = new Date().toISOString();
      }
    },
  },
});

export const {
  setOrders,
  updateOrder,
  addOrder,
  removeOrder,
  setSettings,
  setConnected,
  setLoading,
  setError,
  clearCompletedOrders,
  updateOrderStatus,
} = kdsSlice.actions;

export default kdsSlice.reducer;