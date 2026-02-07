export interface Product {
    id: string;
    organizationId?: string;
    name: string | Record<string, string>;
    description: string | Record<string, string> | null;
    price: number | string;
    imageUrl: string | null;
    isAvailable: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
    images?: { id?: string; url: string; order: number }[];
    options?: ProductOption[];
    recommendations?: ProductRecommendation[];
    upsells?: ProductUpsell[];
    category?: Category;
    minPrepTime?: number;
    maxPrepTime?: number;
    metadata?: Record<string, any>;
}

export interface ProductOption {
    id: string;
    name: string | Record<string, string>;
    description: string | Record<string, string> | null;
    minChoices: number;
    maxChoices: number;
    isRequired: boolean;
    values: ProductOptionValue[];
}

export interface ProductOptionValue {
    id: string;
    name: string | Record<string, string>;
    price: number | string;
    isAvailable: boolean;
}

export interface ProductRecommendation {
    id: string;
    recommended: Product;
}

export interface ProductUpsell {
    id: string;
    upsell: Product;
}

export interface Category {
    id: string;
    organizationId?: string;
    name: string;
    preparationSector?: 'KITCHEN' | 'BAR';
    products: Product[];
}

export interface TenantBranding {
    id?: string;
    tenantId: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    tenantName?: string;
}

export interface LoyaltyConfig {
    isActive: boolean;
    pointsPerUnit: number;
    currencyUnit: number;
}

export interface FooterConfig {
    socials?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        whatsapp?: string;
        website?: string;
    };
    contactInfo?: {
        phone?: string;
        email?: string;
        address?: string;
    };
}

export interface MenuSection {
    id?: string;
    name?: string;
    type: "hero" | "featured" | "category_grid" | "promotions" | "loyalty" | "global_upsell" | "best_sellers" | "new_arrivals" | "marketing_group" | "events";
    title?: string;
    subtitle?: string;
    isActive: boolean;
    config?: {
        imageUrl?: string;
        title?: string;
        subtitle?: string;
        label?: string;
        categoryId?: string;
        groupId?: string;
        limit?: number;
        buttonText?: string;
    };
}

export interface MenuConfig {
    id?: string;
    tenantId: string;
    branding?: TenantBranding;
    footer?: FooterConfig;
    settings?: {
        enableRecommendations?: boolean;
        enableUpsells?: boolean;
        homeLayoutType?: string;
        enabledLanguages: string[];
    };
    sections: MenuSection[];
}
