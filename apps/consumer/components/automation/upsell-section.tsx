"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, X } from "lucide-react";
import { Button } from "@smart-menu/ui/components/ui/button";
import { formatCurrency } from "@smart-menu/ui";
import { SmartBadge } from "./smart-badge";
import { useCart } from "../cart/cart-context";

export interface UpsellSuggestion {
    productId: string;
    name: string;
    price: number;
    imageUrl: string | null;
    reason: string;
}

interface UpsellSectionProps {
    tenantId: string;
}

export function UpsellSection({ tenantId }: UpsellSectionProps) {
    const { items, addItem } = useCart();
    const [suggestions, setSuggestions] = useState<UpsellSuggestion[]>([]);
    const [, setIsLoading] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (items.length === 0) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const productIds = items.map((i) => i.productId).join(",");
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(
                    `${API_URL}/public/suggestions/${tenantId}/upsell?products=${productIds}`
                );

                if (response.ok) {
                    const data: UpsellSuggestion[] = await response.json();
                    setSuggestions(data.filter((s) => !dismissed.has(s.productId)));
                }
            } catch (error) {
                console.warn("Failed to fetch upsell suggestions", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce to avoid too many requests
        const timer = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timer);
    }, [items, tenantId, dismissed]);

    const handleAddToCart = (suggestion: UpsellSuggestion) => {
        addItem({
            productId: suggestion.productId,
            name: suggestion.name,
            price: suggestion.price,
            quantity: 1,
            imageUrl: suggestion.imageUrl ?? undefined,
        });
        setDismissed((prev) => new Set([...prev, suggestion.productId]));
    };

    const handleDismiss = (productId: string) => {
        setDismissed((prev) => new Set([...prev, productId]));
    };

    const visibleSuggestions = suggestions.filter((s) => !dismissed.has(s.productId));

    if (items.length === 0 || visibleSuggestions.length === 0) return null;

    return (
        <div className="space-y-3 py-4 border-t">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-bold text-purple-600">Sugestões para você</span>
            </div>

            <AnimatePresence mode="popLayout">
                {visibleSuggestions.map((suggestion) => (
                    <motion.div
                        key={suggestion.productId}
                        layout
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-100 dark:border-purple-900/50"
                    >
                        {/* Product Image */}
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm">
                            {suggestion.imageUrl ? (
                                <Image
                                    src={suggestion.imageUrl}
                                    alt={suggestion.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-purple-400" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="font-bold text-sm truncate">{suggestion.name}</p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                        {suggestion.reason}
                                    </p>
                                </div>
                                <SmartBadge type="ai_suggested" className="flex-shrink-0" animate={false} />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-black text-sm text-purple-700 dark:text-purple-300">
                                    {formatCurrency(suggestion.price)}
                                </span>
                                <Button
                                    size="sm"
                                    className="h-7 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold"
                                    onClick={() => handleAddToCart(suggestion)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Adicionar
                                </Button>
                            </div>
                        </div>

                        {/* Dismiss Button */}
                        <button
                            onClick={() => handleDismiss(suggestion.productId)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
