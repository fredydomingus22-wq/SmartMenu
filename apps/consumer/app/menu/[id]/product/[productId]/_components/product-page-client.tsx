"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button, ScrollArea, cn, Accordion, AccordionContent, AccordionItem, AccordionTrigger, getTranslatedValue, formatCurrency } from "@smart-menu/ui";
import { useCart } from "@/components/cart/cart-context";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { ProductCard } from "../../../_components/product-card";
import { Product, ProductOption, ProductOptionValue, ProductRecommendation, ProductUpsell } from "../../../_types";

interface ProductPageClientProps {
    product: Product;
    tenantId: string;
}

export function ProductPageClient({ product, tenantId }: ProductPageClientProps) {
    const router = useRouter();
    const { t, locale } = useTranslation();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [removals, setRemovals] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [success, setSuccess] = useState(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", () => setCurrentSlide(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    const allImages = useMemo(() => {
        const imgs = product.imageUrl ? [product.imageUrl] : [];
        if (product.images) {
            imgs.push(...[...product.images].sort((a, b) => a.order - b.order).map((img) => img.url));
        }
        return Array.from(new Set(imgs));
    }, [product]);

    const totalPrice = useMemo(() => {
        let extra = 0;
        Object.values(selectedOptions).flat().forEach(valId => {
            const optValue = product.options?.flatMap((o: ProductOption) => o.values).find((v: ProductOptionValue) => v.id === valId);
            if (optValue) extra += Number(optValue.price);
        });
        const basePrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
        return (basePrice + extra) * quantity;
    }, [product, selectedOptions, quantity]);

    const handleAddToCart = () => {
        setIsAdding(true);

        try {
            // Haptic Feedback
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }

            const flatOptions = Object.entries(selectedOptions).flatMap(([optionId, valueIds]) => {
                const option = product.options?.find((o: ProductOption) => o.id === optionId);
                return valueIds.map(vId => {
                    const val = option?.values.find((v: ProductOptionValue) => v.id === vId);
                    return {
                        valueId: vId,
                        name: getTranslatedValue(val?.name, locale),
                        price: Number(val?.price) || 0
                    };
                });
            });

            const notes = removals.length > 0 ? `Remover: ${removals.join(", ")}` : undefined;
            const basePrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;

            addItem({
                productId: product.id,
                name: getTranslatedValue(product.name, locale),
                price: basePrice,
                imageUrl: product.imageUrl || undefined,
                quantity,
                notes,
                options: flatOptions
            });

            // Show Success State without Redirecting
            setIsAdding(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                // Optional: Reset state if you want, or keep it for multiple adds
                // setQuantity(1);
                // setSelectedOptions({});
                // setRemovals([]);
            }, 1000);

        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
        }
    };

    const toggleOption = (optionId: string, valueId: string, maxChoices: number) => {
        setSelectedOptions(prev => {
            const current = prev[optionId] || [];
            if (current.includes(valueId)) {
                return { ...prev, [optionId]: current.filter(id => id !== valueId) };
            }
            if (maxChoices === 1) {
                return { ...prev, [optionId]: [valueId] };
            }
            if (current.length < maxChoices) {
                return { ...prev, [optionId]: [...current, valueId] };
            }
            return prev;
        });
    };

    const formatPrice = (val: number) => {
        return formatCurrency(val);
    };

    return (
        <div className="min-h-[100dvh] bg-background flex flex-col lg:flex-row">
            {/* Left: Gallery (Desktop) / Top (Mobile) */}
            <div className="w-full lg:w-1/2 lg:h-screen bg-zinc-50 dark:bg-zinc-900 relative">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 z-20 bg-black/10 backdrop-blur-md hover:bg-black/20 text-white rounded-full"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="h-[40vh] lg:h-full w-full overflow-hidden" ref={emblaRef}>
                    <div className="flex h-full touch-pan-y">
                        {allImages.length > 0 ? allImages.map((src, index) => (
                            <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
                                <Image
                                    src={src}
                                    alt={getTranslatedValue(product.name, locale)}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    unoptimized
                                />
                            </div>
                        )) : (
                            <div className="flex-[0_0_100%] min-w-0 relative h-full bg-muted flex items-center justify-center text-muted-foreground">
                                {t('common.unavailable')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dots indicator (Mobile) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 lg:hidden">
                    {allImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all hover:bg-white",
                                i === currentSlide ? "bg-white w-6" : "bg-white/40"
                            )}
                            aria-label={`Ir para slide ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Vertical Thumbnails (Desktop) */}
                <div className="hidden lg:flex flex-col gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-20">
                    {allImages.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={cn(
                                "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 shadow-lg",
                                i === currentSlide ? "border-primary ring-4 ring-primary/20" : "border-white/20 hover:border-white/40"
                            )}
                        >
                            <Image src={src} alt={`Thumb ${i}`} fill className="object-cover" unoptimized />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Details & Customization */}
            <div className="w-full lg:w-1/2 flex flex-col h-full lg:h-screen">
                <ScrollArea className="flex-1 p-6 lg:p-12">
                    <div className="max-w-2xl mx-auto space-y-8 pb-32">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/30 flex items-center gap-1.5">
                                    <ShoppingBag className="h-3 w-3" />
                                    {t('menu.pdp_ordered_count', { count: (product.id.charCodeAt(0) % 15) + 5 })}
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">{getTranslatedValue(product.name, locale)}</h1>
                            <p className="text-2xl font-black text-primary">
                                {formatPrice(typeof product.price === "string" ? parseFloat(product.price) : product.price)}
                            </p>
                        </div>

                        <p className="text-muted-foreground text-lg italic leading-relaxed">
                            {getTranslatedValue(product.description, locale) || t('menu.empty_category_desc')}
                        </p>

                        <div className="h-px w-full bg-border" />

                        {/* Customization Options */}
                        {product.options?.map((option: ProductOption) => (
                            <div key={option.id} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        {getTranslatedValue(option.name, locale)}
                                        {option.isRequired && <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Obrigatório</span>}
                                    </h4>
                                    <span className="text-xs text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                        {t('common.add')} {option.maxChoices > 1 ? `até ${option.maxChoices}` : "1"}
                                    </span>
                                </div>
                                <div className="grid gap-3">
                                    {option.values.map((val: ProductOptionValue) => (
                                        <button
                                            key={val.id}
                                            disabled={!val.isAvailable}
                                            onClick={() => toggleOption(option.id, val.id, option.maxChoices)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left group",
                                                selectedOptions[option.id]?.includes(val.id)
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700",
                                                !val.isAvailable && "opacity-50 cursor-not-allowed"
                                            )}
                                            aria-pressed={selectedOptions[option.id]?.includes(val.id)}
                                            aria-label={t('menu.add_to_cart', { name: getTranslatedValue(val.name, locale) })}
                                        >
                                            <span className="font-medium group-hover:text-primary transition-colors">{getTranslatedValue(val.name, locale)}</span>
                                            {Number(val.price) > 0 && (
                                                <span className="text-sm font-bold text-primary">
                                                    + {formatPrice(Number(val.price))}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Special Instructions */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">{t('menu.pdp_special_instructions')}</h4>
                            <textarea
                                className="w-full h-24 p-4 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:border-primary focus:ring-0 transition-all text-sm resize-none"
                                placeholder={t('menu.pdp_special_instructions_placeholder')}
                                onChange={(e) => setRemovals([e.target.value])}
                                aria-label={t('menu.pdp_special_instructions')}
                            />
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="description">
                                <AccordionTrigger className="font-bold">{t('menu.pdp_product_details')}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {getTranslatedValue(product.description, locale) || t('menu.empty_category_desc')}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="info">
                                <AccordionTrigger className="font-bold">{t('menu.pdp_additional_info')}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Serve 1 pessoa</li>
                                        <li>Tempo médio: 20-30 min</li>
                                        <li>Ingredientes de origem local</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Upsells Section */}
                        {product.upsells && product.upsells.length > 0 && (
                            <section className="space-y-6 pt-10">
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                    <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">{t('menu.upsell_badge')}</h4>
                                    <h3 className="text-xl font-black tracking-tight mb-4">{t('menu.pdp_upsell_title')}</h3>
                                    <div className="space-y-4">
                                        {product.upsells.map((up: ProductUpsell) => (
                                            <Link
                                                key={up.id}
                                                href={`/menu/${tenantId}/product/${up.upsell.id}`}
                                                className="flex items-center gap-4 bg-background p-3 rounded-xl border-2 border-transparent hover:border-primary transition-all shadow-sm"
                                            >
                                                <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image src={up.upsell.imageUrl || "/placeholder-food.jpg"} alt={getTranslatedValue(up.upsell.name, locale)} fill className="object-cover" unoptimized />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-sm">{getTranslatedValue(up.upsell.name, locale)}</h5>
                                                    <p className="text-[10px] text-muted-foreground line-clamp-1">Item complementar premium</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-primary">+{formatPrice(Number(up.upsell.price))}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Recommendations Section */}
                        {product.recommendations && product.recommendations.length > 0 && (
                            <section className="space-y-6 pt-10">
                                <h3 className="text-xl font-black tracking-tight">{t('menu.pdp_recommendations_title')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {product.recommendations.map((rec: ProductRecommendation) => (
                                        <div key={rec.id} className="scale-[0.95] origin-top-left">
                                            <ProductCard product={rec.recommended} tenantId={tenantId} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </ScrollArea>

                {/* Sticky Action Bar */}
                <div className="p-6 border-t bg-background/90 backdrop-blur-xl lg:bg-background sticky bottom-0 z-[var(--z-sticky-cta)] w-full shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <div className="max-w-2xl mx-auto flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-zinc-700"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    aria-label="Diminuir quantidade"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold w-6 text-center text-lg">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-zinc-700"
                                    onClick={() => setQuantity(q => q + 1)}
                                    aria-label="Aumentar quantidade"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Total Estimado</div>
                                <div className="text-3xl font-black text-primary animate-in fade-in slide-in-from-bottom-2">
                                    {formatPrice(totalPrice)}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                            onClick={handleAddToCart}
                            disabled={isAdding || success}
                        >
                            {success ? (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    {t('menu.pdp_added')}
                                </>
                            ) : isAdding ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    {t('menu.pdp_adding')}
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    {t('menu.add_to_cart')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    );
}


