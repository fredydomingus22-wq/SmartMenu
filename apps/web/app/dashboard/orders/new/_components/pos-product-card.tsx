"use client";

import { Card, CardContent, CardFooter, Button } from "@smart-menu/ui";
import { Plus } from "lucide-react";
import Image from "next/image";
import { getLocalizedName, LocalizedString } from "@/utils/i18n";
import { useTranslation } from "@smart-menu/ui";

export interface POSProduct {
    id: string;
    name: LocalizedString;
    description?: LocalizedString | null;
    price: number;
    imageUrl?: string | null;
    categoryId: string;
    options?: unknown[];
}

interface POSProductCardProps {
    product: POSProduct;
    onAdd: (product: POSProduct) => void;
}

export function POSProductCard({ product, onAdd }: POSProductCardProps) {
    const { locale } = useTranslation();
    const name = getLocalizedName(product.name, locale);
    const description = product.description ? getLocalizedName(product.description, locale) : "";

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onAdd(product)}>
            <div className="relative aspect-square">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                        <span className="text-zinc-400 text-xs text-center p-4">Sem imagem</span>
                    </div>
                )}
            </div>
            
            <CardContent className="p-3 flex-1">
                <h3 className="font-bold text-sm line-clamp-2 leading-tight mb-1">
                    {name}
                </h3>
                {description && (
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-2">
                        {description}
                    </p>
                )}
            </CardContent>

            <CardFooter className="p-3 pt-0 flex items-center justify-between">
                <span className="font-bold text-primary">
                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(product.price)}
                </span>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                    <Plus className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
