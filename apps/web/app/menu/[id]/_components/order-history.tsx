'use client';

import { useEffect, useState, useTransition } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@smart-menu/ui";
import { Button } from "@smart-menu/ui";
import { History, RotateCcw, Loader2, ClipboardList, ChevronRight } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { getTranslatedValue } from "@/lib/utils";

interface OrderItem {
    product: {
        id: string;
        name: string | Record<string, string>;
        imageUrl?: string | null;
    };
    price: string | number;
    quantity: number;
    options?: {
        productOptionValueId: string;
        price: string | number;
        optionValue: {
            name: string | Record<string, string>;
        };
    }[];
}

interface Order {
    id: string;
    createdAt: string;
    total: number;
    items?: OrderItem[];
}

interface OrderHistoryProps {
    tenantId: string;
}

export function OrderHistory({ tenantId }: OrderHistoryProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const { addItem, openCart } = useCart();
    const [isPending, startTransition] = useTransition();
    const { t, locale } = useTranslation();

    useEffect(() => {
        const ordersKey = `smartmenu_orders_${tenantId}`;
        const savedOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        setOrders(savedOrders);
    }, [tenantId]);

    const handleRepeatOrder = async (orderId: string) => {
        startTransition(async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/public/orders/${orderId}`);

                if (!response.ok) throw new Error('Falha ao carregar detalhes do pedido');

                const orderData = await response.json() as Order;

                if (orderData.items && orderData.items.length > 0) {
                    orderData.items.forEach((item) => {
                        addItem({
                            productId: item.product.id,
                            name: getTranslatedValue(item.product.name, locale),
                            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                            imageUrl: item.product.imageUrl || undefined,
                            quantity: item.quantity,
                            options: item.options?.map((o) => ({
                                valueId: o.productOptionValueId,
                                name: getTranslatedValue(o.optionValue.name, locale),
                                price: typeof o.price === 'string' ? parseFloat(o.price) : o.price
                            }))
                        });
                    });

                    toast.success(t('cart.success_add') || "Itens adicionados ao carrinho!");
                    openCart();
                }
            } catch (error) {
                console.error("Repeat order error:", error);
                toast.error(t('common.error_repeat') || "Não foi possível repetir este pedido.");
            }
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 sm:h-12 sm:w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <History className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>{t('menu.order_history')}</SheetTitle>
                    <SheetDescription>
                        {t('menu.recent_orders_desc')}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto mt-6">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-60">
                            <ClipboardList className="h-12 w-12 mb-4" />
                            <p className="text-sm font-medium">{t('menu.no_orders')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:border-orange-200 dark:hover:border-orange-900/40">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">
                                                ID: {order.id.split('-')[0]}
                                            </p>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('pt-PT', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-2 font-bold text-[10px] uppercase tracking-tighter"
                                                onClick={() => handleRepeatOrder(order.id)}
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="h-3 w-3" />
                                                )}
                                                {t('menu.repeat_order')}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-zinc-600 dark:text-zinc-400">{t('menu.view_details')}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                            <a href={`/menu/${tenantId}/orders/${order.id}`}>
                                                <ChevronRight className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
