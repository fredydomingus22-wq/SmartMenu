import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface UpsellSuggestion {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  reason: string;
}

@Injectable()
export class UpsellService {
  private readonly logger = new Logger(UpsellService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get upsell suggestions for cart items.
   * Uses configured upsells on products, or falls back to category-based logic.
   */
  async getSuggestions(
    tenantId: string,
    cartProductIds: string[],
    limit = 2,
  ): Promise<UpsellSuggestion[]> {
    if (!cartProductIds.length) return [];

    // 1. First, try configured upsells from ProductUpsell relation
    const configuredUpsells = await this.prisma.productUpsell.findMany({
      where: {
        tenantId,
        productId: { in: cartProductIds },
        upsell: {
          isAvailable: true,
          id: { notIn: cartProductIds }, // Don't suggest what's already in cart
        },
      },
      include: {
        upsell: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
      take: limit,
    });

    if (configuredUpsells.length > 0) {
      return configuredUpsells.map((u) => ({
        productId: u.upsell.id,
        name: this.extractName(u.upsell.name),
        price: Number(u.upsell.price),
        imageUrl: u.upsell.imageUrl,
        reason: 'Combina bem com seu pedido',
      }));
    }

    // 2. Fallback: Suggest popular items from the same categories
    const cartProducts = await this.prisma.product.findMany({
      where: { id: { in: cartProductIds }, tenantId },
      select: { categoryId: true },
    });

    const categoryIds = [...new Set(cartProducts.map((p) => p.categoryId))];

    const popularFromCategory = await this.prisma.product.findMany({
      where: {
        tenantId,
        categoryId: { in: categoryIds },
        isAvailable: true,
        isBestSeller: true,
        id: { notIn: cartProductIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
      },
      take: limit,
    });

    return popularFromCategory.map((p) => ({
      productId: p.id,
      name: this.extractName(p.name),
      price: Number(p.price),
      imageUrl: p.imageUrl,
      reason: 'Mais pedido desta categoria',
    }));
  }

  private extractName(nameJson: unknown): string {
    if (typeof nameJson === 'string') return nameJson;
    if (typeof nameJson === 'object' && nameJson !== null) {
      const obj = nameJson as Record<string, string>;
      return obj['pt'] || obj['en'] || Object.values(obj)[0] || 'Produto';
    }
    return 'Produto';
  }
}
