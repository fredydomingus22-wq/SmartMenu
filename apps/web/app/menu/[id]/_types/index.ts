export interface Product {
    id: string;
    organizationId?: string;
    name: string;
    description: string | null;
    price: number | string;
    imageUrl: string | null;
    isAvailable: boolean;
    isFeatured?: boolean;
    images?: { url: string; order: number }[];
    options?: ProductOption[];
    recommendations?: ProductRecommendation[];
    upsells?: ProductUpsell[];
    category?: Category;
}

export interface ProductOption {
    id: string;
    name: string;
    description: string | null;
    minChoices: number;
    maxChoices: number;
    isRequired: boolean;
    values: ProductOptionValue[];
}

export interface ProductOptionValue {
    id: string;
    name: string;
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
    type: "hero" | "featured" | "category_grid" | "promotions" | "loyalty" | "global_upsell";
    title?: string;
    subtitle?: string;
    isActive: boolean;
    config?: {
        imageUrl?: string;
        title?: string;
        subtitle?: string;
        label?: string;
        categoryId?: string;
        limit?: number;
        buttonText?: string;
    };
}

export interface MenuConfig {
    id?: string;
    tenantId: string;
    branding?: TenantBranding;
    footer?: FooterConfig;
    sections: MenuSection[];
}
export interface Tenant {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    phone?: string | null;
    email?: string | null;
}
