import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductCard } from './product-card';
import { I18nProvider } from '@/hooks/use-translation';
import { CartProvider } from '@/components/cart/cart-context';
import { CartAnimationProvider } from '@/components/cart/cart-animation-context';
import { Product } from '../_types';

const meta: Meta<typeof ProductCard> = {
    title: 'Menu/ProductCard',
    component: ProductCard,
    decorators: [
        (Story) => (
            <I18nProvider>
                <CartProvider>
                    <CartAnimationProvider>
                        <div className="max-w-xs p-4">
                            <Story />
                        </div>
                    </CartAnimationProvider>
                </CartProvider>
            </I18nProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

const baseProduct: Product = {
    id: '1',
    name: 'Hambúrguer Clássico',
    description: 'Delicioso hambúrguer com queijo e bacon.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    isAvailable: true,
    isFeatured: true,
    minPrepTime: 15,
    maxPrepTime: 20,
};

export const Default: Story = {
    args: {
        tenantId: 'test-tenant',
        product: baseProduct,
    },
};

export const OutOfStock: Story = {
    args: {
        tenantId: 'test-tenant',
        product: {
            ...baseProduct,
            id: '2',
            isAvailable: false,
        },
    },
};

export const LongName: Story = {
    args: {
        tenantId: 'test-tenant',
        product: {
            ...baseProduct,
            id: '3',
            name: 'Hambúrguer Gourmet Especial de Picanha com Molho Secreto da Casa e Cebola Caramelizada',
        },
    },
};
