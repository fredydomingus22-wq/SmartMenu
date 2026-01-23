import { PrismaService } from '../prisma/prisma.service';
import { UpdateLoyaltyConfigDto } from './dto/update-loyalty-config.dto';
import { CreateLoyaltyRewardDto } from './dto/create-loyalty-reward.dto';
export declare class LoyaltyService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateConfig(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        pointsPerUnit: import("@prisma/client/runtime/library").Decimal;
        currencyUnit: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateConfig(tenantId: string, dto: UpdateLoyaltyConfigDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        pointsPerUnit: import("@prisma/client/runtime/library").Decimal;
        currencyUnit: import("@prisma/client/runtime/library").Decimal;
    }>;
    getRewards(tenantId: string, onlyActive?: boolean): Promise<{
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
    createReward(tenantId: string, dto: CreateLoyaltyRewardDto): Promise<{
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
    updateReward(id: string, tenantId: string, dto: Partial<CreateLoyaltyRewardDto>): Promise<{
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
    deleteReward(id: string, tenantId: string): Promise<{
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
    getCustomerProfile(userId: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        pointsBalance: number;
    }>;
    getCustomerPoints(userId: string, tenantId: string): Promise<number>;
    earnPoints(userId: string, tenantId: string, orderTotal: number, orderId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerProfileId: string;
        amount: number;
        orderId: string | null;
    } | null>;
    redeemReward(userId: string, tenantId: string, rewardId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerProfileId: string;
        amount: number;
        orderId: string | null;
    }>;
    getTransactions(userId: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerProfileId: string;
        amount: number;
        orderId: string | null;
    }[]>;
}
