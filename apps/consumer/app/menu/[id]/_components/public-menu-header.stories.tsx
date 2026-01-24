import type { Meta, StoryObj } from '@storybook/react';
import { PublicMenuHeader } from './public-menu-header';

const meta: Meta<typeof PublicMenuHeader> = {
    title: 'Menu/PublicMenuHeader',
    component: PublicMenuHeader,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PublicMenuHeader>;

export const Default: Story = {
    args: {
        branding: {
            colors: {
                primary: '#f97316',
                secondary: '#18181b',
            }
        }
    },
};

export const CustomColors: Story = {
    args: {
        branding: {
            colors: {
                primary: '#0ea5e9',
                secondary: '#0f172a',
            }
        }
    },
};

export const WithTable: Story = {
    args: {
        branding: {
            colors: {
                primary: '#e11d48',
                secondary: '#4c0519',
            }
        },
        tableId: '12'
    },
};
