import { MenuItem } from '../types';

export class MenuService {
  private static readonly API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  static async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Return mock data for development
      return this.getMockMenuItems();
    }
  }

  static async updateItemAvailability(itemId: string, available: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/menu/${itemId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item availability');
      }
    } catch (error) {
      console.error('Error updating item availability:', error);
      throw error;
    }
  }

  private static getMockMenuItems(): MenuItem[] {
    return [
      {
        id: '1',
        name: 'Hambúrguer Clássico',
        description: 'Hambúrguer de carne bovina com queijo, alface, tomate e molho especial',
        price: 25.90,
        category: 'Lanches',
        available: true,
        prepTime: 15,
      },
      {
        id: '2',
        name: 'Pizza Margherita',
        description: 'Pizza com molho de tomate, mussarela, manjericão e azeite',
        price: 35.00,
        category: 'Pizzas',
        available: true,
        prepTime: 20,
      },
      {
        id: '3',
        name: 'Salada Caesar',
        description: 'Alface romana, croutons, parmesão e molho caesar',
        price: 18.50,
        category: 'Saladas',
        available: false,
        prepTime: 10,
      },
      {
        id: '4',
        name: 'Refrigerante Cola',
        description: 'Refrigerante de cola 350ml',
        price: 5.00,
        category: 'Bebidas',
        available: true,
        prepTime: 1,
      },
      {
        id: '5',
        name: 'Batata Frita',
        description: 'Porção de batata frita crocante',
        price: 12.00,
        category: 'Acompanhamentos',
        available: true,
        prepTime: 8,
      },
    ];
  }
}