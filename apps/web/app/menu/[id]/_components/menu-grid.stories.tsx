import type { Meta, StoryObj } from '@storybook/react';
import { MenuGrid } from './menu-grid';

const meta: Meta<typeof MenuGrid> = {
    title: 'Menu/MenuGrid',
    component: MenuGrid,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuGrid>;

const mockCategories = [
    {
        id: '1',
        name: 'Hambúrgueres',
        products: [
            {
                id: 'p1',
                name: 'Burger Clássico',
                description: 'Pão brioche, carne de 180g, queijo cheddar, alface e tomate.',
                price: 5500,
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300',
                isAvailable: true,
            },
            {
                id: 'p2',
                name: 'Burger Bacon',
                description: 'Pão australiano, carne de 180g, cheddar, muito bacon e cebola caramelizada.',
                price: 6500,
                imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=300&h=300',
                isAvailable: true,
            }
        ]
    },
    {
        id: '2',
        name: 'Bebidas',
        products: [
            {
                id: 'p3',
                name: 'Coca-Cola 330ml',
                description: 'Refrigerante gelado.',
                price: 800,
                imageUrl: null,
                isAvailable: true,
            }
        ]
    }
];

export const Default: Story = {
    args: {
        categories: mockCategories,
        config: {
            // @ts-ignore - hero is partially handled in MenuGrid
            hero: {
                show: true,
                title: 'Promoção de Verão',
                subtitle: 'Aproveite nossos preços especiais.',
            },
            sections: [
                { type: 'hero', isActive: true, config: { title: 'Promoção de Verão', subtitle: 'Aproveite nossos preços especiais.' } },
                { type: 'featured', isActive: true },
                { type: 'category_grid', isActive: true }
            ]
        }
    },
};

export const WithoutHero: Story = {
    args: {
        categories: mockCategories,
        config: {
            // @ts-ignore
            hero: { show: false },
            sections: [
                { type: 'hero', isActive: false },
                { type: 'category_grid', isActive: true }
            ]
        }
    },
};
