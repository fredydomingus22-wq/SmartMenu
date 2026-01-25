// Shared types for the mobile app
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}