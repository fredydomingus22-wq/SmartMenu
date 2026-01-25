import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  token: string | null;
  permissionGranted: boolean;
  notifications: NotificationItem[];
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

const initialState: NotificationState = {
  token: null,
  permissionGranted: false,
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>>) => {
      const notification: NotificationItem = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setToken,
  setPermissionGranted,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;