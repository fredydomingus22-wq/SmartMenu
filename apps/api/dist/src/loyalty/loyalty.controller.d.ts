import { LoyaltyService } from './loyalty.service';
import { UpdateLoyaltyConfigDto } from './dto/update-loyalty-config.dto';
import { CreateLoyaltyRewardDto } from './dto/create-loyalty-reward.dto';
export declare class LoyaltyController {
    private readonly loyaltyService;
    constructor(loyaltyService: LoyaltyService);
    getConfig(req: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        pointsPerUnit: import("@prisma/client/runtime/library").Decimal;
        currencyUnit: import("@prisma/client/runtime/library").Decimal;
    }>;
    getPublicConfig(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        pointsPerUnit: import("@prisma/client/runtime/library").Decimal;
        currencyUnit: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateConfig(req: any, dto: UpdateLoyaltyConfigDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        pointsPerUnit: import("@prisma/client/runtime/library").Decimal;
        currencyUnit: import("@prisma/client/runtime/library").Decimal;
    }>;
    createReward(req: any, dto: CreateLoyaltyRewardDto): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        productId: string | null;
        isActive: boolean;
        pointsRequired: number;
        discountAmount: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    updateReward(id: string, req: any, dto: Partial<CreateLoyaltyRewardDto>): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        productId: string | null;
        isActive: boolean;
        pointsRequired: number;
        discountAmount: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    deleteReward(id: string, req: any): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        productId: string | null;
        isActive: boolean;
        pointsRequired: number;
        discountAmount: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getPublicRewards(tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        productId: string | null;
        isActive: boolean;
        pointsRequired: number;
        discountAmount: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    getMyPoints(req: any): Promise<number>;
    getMyTransactions(req: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        customerProfileId: string;
        amount: number;
        type: import(".prisma/client").$Enums.TransactionType;
        orderId: string | null;
    }[]>;
    redeem(req: any, rewardId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        customerProfileId: string;
        amount: number;
        type: import(".prisma/client").$Enums.TransactionType;
        orderId: string | null;
    }>;
}
