import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getMenu(tenantId: string): Promise<({
        products: ({
            images: {
                id: string;
                createdAt: Date;
                order: number;
                productId: string;
                url: string;
            }[];
            options: ({
                values: {
                    id: string;
                    name: string;
                    organizationId: string;
                    tenantId: string;
                    createdAt: Date;
                    isAvailable: boolean;
                    price: import("@prisma/client/runtime/library").Decimal;
                    updatedAt: Date;
                    optionId: string;
                }[];
            } & {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                description: string | null;
                productId: string;
                minChoices: number;
                maxChoices: number;
                isRequired: boolean;
                updatedAt: Date;
            })[];
        } & {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            isAvailable: boolean;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            categoryId: string;
        })[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
    })[]>;
    getMenuConfig(tenantId: string): Promise<{
        branding: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            tenantName: string | null;
            logoUrl: string | null;
            primaryColor: string | null;
            secondaryColor: string | null;
            borderRadius: string | null;
            fontFamily: string | null;
        } | {
            primaryColor: string;
            logoUrl: null;
        };
        sections: {
            id: string;
            name: string;
            tenantId: string;
            createdAt: Date;
            order: number;
            updatedAt: Date;
            type: string;
            isActive: boolean;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        }[] | ({
            type: string;
            isActive: boolean;
            name: string;
            config: {
                title: string;
            };
        } | {
            type: string;
            isActive: boolean;
            name: string;
            config?: undefined;
        })[];
        footer: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            socials: import("@prisma/client/runtime/library").JsonValue | null;
            links: import("@prisma/client/runtime/library").JsonValue | null;
            contactInfo: import("@prisma/client/runtime/library").JsonValue | null;
        } | {
            socials: {};
            links: never[];
            contactInfo: {};
        };
        settings: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            enableRecommendations: boolean;
            enableUpsells: boolean;
            homeLayoutType: string;
        } | {
            enableRecommendations: true;
            enableUpsells: true;
            homeLayoutType: string;
        };
    }>;
    getProduct(tenantId: string, productId: string): Promise<{
        images: {
            id: string;
            createdAt: Date;
            order: number;
            productId: string;
            url: string;
        }[];
        options: ({
            values: {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                isAvailable: boolean;
                price: import("@prisma/client/runtime/library").Decimal;
                updatedAt: Date;
                optionId: string;
            }[];
        } & {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            description: string | null;
            productId: string;
            minChoices: number;
            maxChoices: number;
            isRequired: boolean;
            updatedAt: Date;
        })[];
        recommendations: ({
            recommended: {
                images: {
                    id: string;
                    createdAt: Date;
                    order: number;
                    productId: string;
                    url: string;
                }[];
            } & {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                isAvailable: boolean;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                categoryId: string;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            productId: string;
            recommendedId: string;
        })[];
        upsells: ({
            upsell: {
                images: {
                    id: string;
                    createdAt: Date;
                    order: number;
                    productId: string;
                    url: string;
                }[];
            } & {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                isAvailable: boolean;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                categoryId: string;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            productId: string;
            upsellId: string;
        })[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        isAvailable: boolean;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        categoryId: string;
    }>;
}
