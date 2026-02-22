"use client";

import { useMemo, useState } from "react";
import { 
    Button, 
    Badge, 
    ScrollArea, 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter, 
    DialogTrigger 
} from "@smart-menu/ui";
import { ShoppingBasket, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getLocalizedName } from "@/utils/i18n";
import { useTranslation } from "@smart-menu/ui";
import { POSProduct } from "./pos-product-card";

interface BasketItem {
    id: string; // This is a unique ID for the basket item, not necessarily the product ID
    product: POSProduct;
    quantity: number;
}

interface POSOrderSummaryProps {
    basket: BasketItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    isProcessing: boolean;
}

export function POSOrderSummary({ basket, onUpdateQuantity, onRemove, onCheckout, isProcessing }: POSOrderSummaryProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { locale } = useTranslation();

    const total = useMemo(() => {
        return basket.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }, [basket]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(value);
    };

    const handleConfirmCheckout = () => {
        setIsConfirmOpen(false);
        onCheckout();
    };

    return (
        <div className="flex flex-col h-full border-l bg-white dark:bg-zinc-950">
            <div className="p-4 border-b flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <ShoppingBasket className="h-5 w-5 text-zinc-500" />
                    <h2 className="font-bold">Carrinho</h2>
                </div>
                <Badge variant="secondary" className="rounded-full">
                    {basket.length} {basket.length === 1 ? 'item' : 'itens'}
                </Badge>
            </div>

            <ScrollArea className="flex-1 px-4">
                {basket.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40 grayscale">
                        <ShoppingBasket className="h-16 w-16 mb-4" />
                        <p className="text-sm font-medium">Carrinho vazio</p>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        {basket.map((item) => (
                            <div key={item.id} className="flex gap-3 animate-in fade-in slide-in-from-right-2">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-zinc-100 flex-shrink-0">
                                    {item.product.imageUrl ? (
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={getLocalizedName(item.product.name, locale)}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                                            N/A
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate leading-tight">
                                        {getLocalizedName(item.product.name, locale)}
                                    </h4>
                                    <p className="text-[11px] text-zinc-500">
                                        {formatCurrency(item.product.price)} / un
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 rounded-md hover:bg-white dark:hover:bg-zinc-700"
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-xs font-bold w-4 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 rounded-md hover:bg-white dark:hover:bg-zinc-700"
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => onRemove(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 border-t space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-zinc-900 dark:text-white">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>

                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20" 
                            disabled={basket.length === 0 || isProcessing}
                        >
                            {isProcessing ? "Processando..." : "Finalizar Pedido"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Novo Pedido</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-zinc-500 mb-4">
                                Verifique os detalhes do pedido antes de finalizar.
                            </p>
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-zinc-500 uppercase">Itens no Carrinho</span>
                                    <span className="text-sm font-bold">{basket.length}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                    <span className="text-sm font-bold">Total a Pagar</span>
                                    <span className="text-lg font-black text-primary">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={isProcessing}>
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmCheckout} disabled={isProcessing} className="px-8 font-bold">
                                {isProcessing ? "Processando..." : "Confirmar e Finalizar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
