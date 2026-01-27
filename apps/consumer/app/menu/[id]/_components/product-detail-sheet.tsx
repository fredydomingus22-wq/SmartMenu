"use client";

import { ProductDetailSheet as SharedSheet, Product } from "@smart-menu/ui";
import { useTranslation } from "@/hooks/use-translation";

interface ProductDetailSheetProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDetailSheet({ product, open, onOpenChange }: ProductDetailSheetProps) {
    const { t, locale } = useTranslation();

    return (
        <SharedSheet
            product={product}
            open={open}
            onOpenChange={onOpenChange}
            locale={locale}
            t={t}
        />
    );
}
