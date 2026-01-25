import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  isAuthenticated: boolean;
  tenantId: string | null;
  tableId: string | null;
  notificationsEnabled: boolean;
  lastLogin: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  isAuthenticated: false,
  tenantId: null,
  tableId: null,
  notificationsEnabled: true,
  lastLogin: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{
      id: string;
      name: string;
      email: string;
      tenantId: string;
      tableId: string;
    }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.tenantId = action.payload.tenantId;
      state.tableId = action.payload.tableId;
      state.isAuthenticated = true;
      state.lastLogin = new Date().toISOString();
    },
    logout: (state) => {
      return initialState;
    },
    updateProfile: (state, action: PayloadAction<{ name?: string; email?: string }>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.email) state.email = action.payload.email;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
    updateTable: (state, action: PayloadAction<string>) => {
      state.tableId = action.payload;
    },
  },
});

export const {
  login,
  logout,
  updateProfile,
  setNotificationsEnabled,
  updateTable,
} = userSlice.actions;

export default userSlice.reducer;