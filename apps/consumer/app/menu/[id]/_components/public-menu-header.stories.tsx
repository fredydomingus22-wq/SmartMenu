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
            primaryColor: '#f97316',
            secondaryColor: '#18181b',
            tenantId: '1',
            logoUrl: null,
            bannerUrl: null
        }
    },
};

export const CustomColors: Story = {
    args: {
        branding: {
            primaryColor: '#0ea5e9',
            secondaryColor: '#0f172a',
            tenantId: '1',
            logoUrl: null,
            bannerUrl: null
        }
    },
};

export const WithTable: Story = {
    args: {
        branding: {
            primaryColor: '#e11d48',
            secondaryColor: '#4c0519',
            tenantId: '1',
            logoUrl: null,
            bannerUrl: null
        },
        tableId: '12'
    },
};
