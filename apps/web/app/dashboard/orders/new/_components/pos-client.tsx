"use client";

import { useState, useMemo, useCallback } from "react";
import { Input, Button, ScrollArea } from "@smart-menu/ui";
import { Search } from "lucide-react";
import { POSProductCard, POSProduct } from "./pos-product-card";
import { POSOrderSummary } from "./pos-order-summary";
import { toast } from "sonner";
import { getLocalizedName } from "@/utils/i18n";
import { useTranslation } from "@smart-menu/ui";

interface Category {
    id: string;
    name: string | Record<string, string>;
}

interface Table {
    id: string;
    number: number;
}

interface POSClientProps {
    initialProducts: POSProduct[];
    categories: Category[];
    tables: Table[];
}

export function POSClient({ initialProducts, categories }: Pick<POSClientProps, 'initialProducts' | 'categories'>) {
    const { locale } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [basket, setBasket] = useState<{ id: string, product: POSProduct, quantity: number }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const productName = getLocalizedName(product.name, locale)?.toLowerCase() || "";
            const matchesSearch = productName.includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [initialProducts, searchTerm, selectedCategory, locale]);

    const handleAddToBasket = (product: POSProduct) => {
        setBasket(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.product.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prev, { id: Math.random().toString(36).substr(2, 9), product, quantity: 1 }];
        });
        toast.success(`${getLocalizedName(product.name, locale)} adicionado ao carrinho`);
    };

    const handleUpdateQuantity = (basketItemId: string, delta: number) => {
        setBasket(prev => {
            return prev.map(item => {
                if (item.id === basketItemId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const handleRemoveFromBasket = (basketItemId: string) => {
        setBasket(prev => prev.filter(item => item.id !== basketItemId));
    };

    const handleCheckout = useCallback(async () => {
        if (basket.length === 0) return;
        
        setIsProcessing(true);
        try {
            // Mock checkout for now or implement real action
            console.log("Checking out basket:", basket);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success("Pedido realizado com sucesso!");
            setBasket([]);
        } catch {
            toast.error("Erro ao processar pedido");
        } finally {
            setIsProcessing(false);
        }
    }, [basket]);

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
            {/* Main Products Area */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Pesquisar produtos..."
                            className="pl-10 h-11 bg-white dark:bg-zinc-950 border-zinc-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            className="h-11 px-6 font-bold rounded-xl"
                            onClick={() => setSelectedCategory(null)}
                        >
                            Todos
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                className="h-11 px-6 font-bold rounded-xl whitespace-nowrap"
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {getLocalizedName(cat.name, locale)}
                            </Button>
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 pr-4">
                    {filteredProducts.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-zinc-400 opacity-50">
                            <Search className="h-12 w-12 mb-2" />
                            <p>Nenhum produto encontrado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-10">
                            {filteredProducts.map(product => (
                                <POSProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddToBasket}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Sidebar Summary */}
            <div className="w-[380px] flex-shrink-0">
                <POSOrderSummary
                    basket={basket}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveFromBasket}
                    onCheckout={handleCheckout}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
}
