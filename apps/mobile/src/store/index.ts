import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import reducers (we'll create them)
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import notificationsReducer from './slices/notificationsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'user'], // Only persist cart and user data
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  notifications: notificationsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;