import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '../../types';

interface MenuState {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menuItems: [],
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
      state.error = null;
    },
    toggleItemAvailability: (state, action: PayloadAction<string>) => {
      const item = state.menuItems.find(item => item.id === action.payload);
      if (item) {
        item.available = !item.available;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setMenuItems, toggleItemAvailability, setLoading, setError } = menuSlice.actions;
export default menuSlice.reducer;