import * as SecureStore from 'expo-secure-store';
import { AdminUser } from '../types';

const TOKEN_KEY = 'admin_auth_token';
const USER_KEY = 'admin_user_data';

export class AuthService {
  static async login(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
    try {
      // Mock authentication - in production, this would call your API
      if (email === 'admin@smartmenu.com' && password === 'admin123') {
        const mockUser: AdminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@smartmenu.com',
          role: 'ADMIN',
          restaurantId: 'restaurant-1',
        };

        const mockToken = 'mock-jwt-token-admin';

        // Store in secure storage
        await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

        return { user: mockUser, token: mockToken };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async getStoredAuth(): Promise<{ user: AdminUser; token: string } | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_KEY);

      if (token && userData) {
        const user = JSON.parse(userData);
        return { user, token };
      }

      return null;
    } catch (error) {
      console.error('Get stored auth error:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const auth = await this.getStoredAuth();
    return auth !== null;
  }
}