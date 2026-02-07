
export interface LocalizedString {
    [key: string]: string;
}

export interface Banner {
    id: string;
    tenantId: string;
    type: string;
    title: any;
    subtitle: any;
    buttonText: any;
    buttonLink: string | null;
    imageUrl: string | null;
    isActive: boolean;
    order: number;
}

export interface ProductGroup {
    id: string;
    tenantId: string;
    name: any;
    slug: string;
    description: any;
    imageUrl: string | null;
    isActive: boolean;
    items?: ProductGroupItem[];
}

export interface ProductGroupItem {
    id: string;
    groupId: string;
    productId: string;
    order: number;
    product?: any;
}

export interface PromotionalSchedule {
    id: string;
    tenantId: string;
    productId: string;
    startDate: string;
    endDate: string | null;
    isSpecial: boolean;
    label: string | null;
    discount: number | null;
    product?: any;
}

export interface MarketingEvent {
    id: string;
    tenantId: string;
    name: any;
    description: any;
    imageUrl: string | null;
    date: string;
    endDate: string | null;
    location: string | null;
    ticketLink: string | null;
    isActive: boolean;
}
