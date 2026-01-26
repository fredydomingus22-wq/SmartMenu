"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Plus, Minus, ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../cart-context";
import { formatCurrency, getTranslatedValue, cn } from "../../../lib/utils";
import { Product } from "../../../types/menu";

interface ProductDetailSheetProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    locale: string;
    t: (key: string, params?: any) => string;
    removalsOptions?: string[]; // Kept for backward compatibility/overrides
}

export function ProductDetailSheet({
    product,
    open,
    onOpenChange,
    locale,
    t,
    removalsOptions = []
}: ProductDetailSheetProps) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [removals, setRemovals] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [success, setSuccess] = useState(false);

    // Dynamic Removals Priority: Component Prop > Product Metadata > Empty Array
    const activeRemovals = useMemo(() => {
        if (removalsOptions && removalsOptions.length > 0) return removalsOptions;
        if (product?.metadata?.removals && Array.isArray(product.metadata.removals)) {
            return product.metadata.removals;
        }
        return [];
    }, [removalsOptions, product?.metadata]);

    const allImages = useMemo(() => {
        if (!product) return [];
        const imgs = product.imageUrl ? [product.imageUrl] : [];
        if (product.images) {
            imgs.push(...product.images.sort((a, b) => a.order - b.order).map(img => img.url));
        }
        return Array.from(new Set(imgs));
    }, [product]);

    const totalPrice = useMemo(() => {
        if (!product) return 0;
        let extra = 0;
        Object.values(selectedOptions).flat().forEach(valId => {
            const optValue = product.options?.flatMap(o => o.values).find(v => v.id === valId);
            if (optValue) extra += Number(optValue.price);
        });
        return (Number(product.price) + extra) * quantity;
    }, [product, selectedOptions, quantity]);

    if (!product) return null;

    const handleAddToCart = () => {
        setIsAdding(true);
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }

            const flatOptions = Object.entries(selectedOptions).flatMap(([optionId, valueIds]) => {
                const option = product.options?.find(o => o.id === optionId);
                return valueIds.map(vId => {
                    const val = option?.values.find(v => v.id === vId);
                    return {
                        valueId: vId,
                        name: getTranslatedValue(val?.name, locale),
                        price: Number(val?.price) || 0
                    };
                });
            });

            const notes = removals.length > 0 ? `Remover: ${removals.join(", ")}` : undefined;
            addItem({
                productId: product.id,
                name: getTranslatedValue(product.name, locale),
                price: Number(product.price),
                imageUrl: product.imageUrl || undefined,
                quantity,
                notes,
                options: flatOptions
            });

            setIsAdding(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onOpenChange(false);
                setQuantity(1);
                setSelectedOptions({});
                setRemovals([]);
            }, 1000);

        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col gap-0 border-l-0 sm:border-l overflow-hidden bg-background">
                <SheetHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <SheetTitle className="text-xl font-bold">{getTranslatedValue(product.name, locale)}</SheetTitle>
                        <SheetDescription className="text-xs">{t('cart.customize') || 'Personalize seu pedido'}</SheetDescription>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-grow">
                    <div className="relative aspect-video bg-muted overflow-hidden group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={allImages[currentImageIndex] || "/placeholder-food.jpg"}
                                    alt={getTranslatedValue(product.name, locale)}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % allImages.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {allImages.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentImageIndex ? "bg-primary w-4" : "bg-white/50"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 space-y-8">
                        <div>
                            <p className="text-muted-foreground leading-relaxed">
                                {getTranslatedValue(product.description, locale) || t('menu.no_description')}
                            </p>
                            <div className="mt-4 text-3xl font-black text-primary">
                                {formatCurrency(product.price)}
                            </div>
                        </div>

                        {product.options?.map((option) => (
                            <div key={option.id} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        {getTranslatedValue(option.name, locale)}
                                        {option.isRequired && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">{t('menu.required')}</span>}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                        {t('menu.choose_limit', { count: option.maxChoices })}
                                    </span>
                                </div>
                                <div className="grid gap-3">
                                    {option.values.map((val) => (
                                        <button
                                            key={val.id}
                                            disabled={!val.isAvailable}
                                            onClick={() => toggleOption(option.id, val.id, option.maxChoices)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-lg border transition-all text-left",
                                                selectedOptions[option.id]?.includes(val.id)
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700",
                                                !val.isAvailable && "opacity-30 cursor-not-allowed"
                                            )}
                                        >
                                            <span className="font-medium">{getTranslatedValue(val.name, locale)}</span>
                                            {Number(val.price) > 0 && (
                                                <span className="text-xs font-bold text-primary">
                                                    + {formatCurrency(val.price)}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {activeRemovals.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg">{t('menu.removals_title') || 'Retirar algo?'}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {activeRemovals.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setRemovals(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                                                removals.includes(item)
                                                    ? "bg-red-50 text-red-600 border-red-200"
                                                    : "bg-zinc-50 dark:bg-zinc-900 border-transparent hover:border-zinc-200"
                                            )}
                                        >
                                            {t('menu.without', { name: item }) || `Sem ${item}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <SheetFooter className="p-6 border-t bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-1.5 rounded-lg border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-xl"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold w-6 text-center">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-md"
                                    onClick={() => setQuantity(q => q + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{t('common.total')}</div>
                                <div className="text-2xl font-black text-primary">
                                    {formatCurrency(totalPrice)}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full h-14 rounded-lg text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                            onClick={handleAddToCart}
                            disabled={isAdding || success}
                        >
                            {success ? (
                                <>
                                    <Check className="mr-2 h-5 w-5" />
                                    {t('cart.added') || 'Adicionado!'}
                                </>
                            ) : isAdding ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('cart.adding') || 'Adicionando...'}
                                </>
                            ) : (
                                t('cart.add_to_cart_full') || "Adicionar ao Carrinho"
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
