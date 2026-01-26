"use client";

import { motion } from "framer-motion";
import { Plus, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, ReactNode } from "react";
import { Button } from "../../ui/button";
import { formatCurrency, getTranslatedValue, cn } from "../../../lib/utils";
import { Product } from "../../../types/menu";
import { useCart } from "../../cart-context";
import { useCartAnimation } from "../../cart-animation-context";

interface ProductCardProps {
    product: Product;
    tenantId: string;
    locale: string;
    t: (key: string, params?: any) => string;
    href?: string;
    className?: string;
}

export function ProductCard({
    product,
    tenantId,
    locale,
    t,
    href,
    className
}: ProductCardProps) {
    const { addItem } = useCart();
    const { startAnimation } = useCartAnimation();
    const imageRef = useRef<HTMLImageElement>(null);

    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const itemHref = href || `/menu/${tenantId}/product/${product.id}`;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.isAvailable) return;

        const imageUrl = product.imageUrl || product.images?.[0]?.url || "/placeholder-food.jpg";

        const addToCartLogic = () => {
            addItem({
                productId: product.id,
                name: getTranslatedValue(product.name, locale),
                price: price,
                imageUrl: imageUrl || undefined,
            });
        };

        if (imageRef.current) {
            startAnimation({
                src: imageUrl,
                startRect: imageRef.current.getBoundingClientRect(),
                onComplete: addToCartLogic
            });
        } else {
            addToCartLogic();
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("group h-full", className)}
        >
            <Link
                href={itemHref}
                className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-all"
                prefetch={true}
            >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-sm group-hover:shadow-md transition-all duration-500 ease-in-out">
                    <Image
                        src={product.imageUrl || "/placeholder-food.jpg"}
                        alt={getTranslatedValue(product.name, locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        ref={imageRef}
                    />

                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs border border-white/30 px-3 py-1.5 bg-black/20 rounded-sm">
                                {t('menu.out_of_stock')}
                            </span>
                        </div>
                    )}

                    {product.isAvailable && (product.isFeatured || product.isBestSeller) && (
                        <div className="absolute top-3 left-3 z-10">
                            <span className="bg-primary text-white text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded shadow-lg ring-1 ring-white/20">
                                {t('menu.best_seller')}
                            </span>
                        </div>
                    )}

                    {product.isAvailable && (
                        <Button
                            size="icon"
                            className="absolute bottom-3 right-3 h-12 w-12 rounded-full bg-white text-black shadow-xl lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 z-10 flex items-center justify-center"
                            onClick={handleQuickAdd}
                            aria-label={t('menu.add_to_cart', { name: getTranslatedValue(product.name, locale) })}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    )}
                </div>

                <div className="mt-3 flex flex-col gap-0.5 sm:gap-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {getTranslatedValue(product.name, locale)}
                        </h3>
                        <span className="font-black text-sm sm:text-base whitespace-nowrap text-foreground/90">
                            {formatCurrency(price)}
                        </span>
                    </div>
                    {product.description && (
                        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 italic font-medium">
                            {getTranslatedValue(product.description, locale)}
                        </p>
                    )}
                    {product.minPrepTime && product.maxPrepTime && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Timer className="h-3 w-3 text-primary/60" />
                            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
                                {product.minPrepTime}-{product.maxPrepTime} min
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </motion.article >
    );
}
