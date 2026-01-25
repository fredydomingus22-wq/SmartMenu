import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  total: number;
  isOffline: boolean;
  lastSync: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOffline: false,
  lastSync: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    syncCart: (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.lastSync = new Date().toISOString();
      state.isOffline = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setOfflineMode,
  syncCart,
} = cartSlice.actions;

export default cartSlice.reducer;