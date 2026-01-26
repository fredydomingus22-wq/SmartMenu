"use client";

import { ProductCard as SharedProductCard, Product } from "@smart-menu/ui";
import { useTranslation } from "@/hooks/use-translation";

interface ProductCardProps {
    product: Product;
    tenantId: string;
}

export function ProductCard({ product, tenantId }: ProductCardProps) {
    const { t, locale } = useTranslation();

    return (
        <SharedProductCard
            product={product}
            tenantId={tenantId}
            locale={locale}
            t={t}
        />
    );
}
