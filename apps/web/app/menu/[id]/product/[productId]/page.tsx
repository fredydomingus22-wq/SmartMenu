import { apiClient } from "@/utils/api-client";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./_components/product-page-client";

import { Product } from "../../_types";

export default async function ProductPage({ params }: { params: Promise<{ id: string; productId: string }> }) {
    const { id: tenantId, productId } = await params;

    let product: Product | null = null;

    try {
        product = await apiClient.get(`/public/menu/${tenantId}/product/${productId}`, { cache: 'no-store' });
    } catch (error) {
        console.error('[ProductPage] Failed to load product:', error);
        return notFound();
    }

    if (!product) {
        return notFound();
    }

    return <ProductPageClient product={product} tenantId={tenantId} />;
}
