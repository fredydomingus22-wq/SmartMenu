"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { KDSOrderCard, type Order } from "./kds-order-card";
import { updateOrderStatus } from "@/app/actions/orders";
import { toast } from "sonner";
import { useKDSSound } from "../_hooks/use-kds-sound";
import { Button } from "@smart-menu/ui";
import { cn } from "@/lib/utils";
import { RefreshCw, Volume2, VolumeX, ChefHat } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface KDSGridProps {
    initialOrders: Order[];
    tenantId: string;
}

export function KDSGrid({ initialOrders, tenantId }: KDSGridProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [activeSector, setActiveSector] = useState<'KITCHEN' | 'BAR' | 'ALL'>('KITCHEN');
    const { isEnabled: isSoundEnabled, initAudio, playNewOrder } = useKDSSound();
    const { t } = useTranslation();
    const supabase = createClient();

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        const channel = supabase.channel(`orders:${tenantId}`)
            .on('broadcast', { event: 'ORDER_CREATED' }, (payload) => {
                console.log('Novo Pedido:', payload);
                setOrders(prev => [...prev, payload.payload]);
                playNewOrder();
            })
            .on('broadcast', { event: 'STATUS_UPDATED' }, (payload) => {
                console.log('Pedido Atualizado:', payload);
                const updatedOrder = payload.payload;

                // Real-time Filtering: Remove se status for finalizado/entregue
                if (['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(updatedOrder.status)) {
                    setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
                } else {
                    // Update or Add (se novo via mudança de status)
                    setOrders(prev => {
                        const exists = prev.find(o => o.id === updatedOrder.id);
                        if (exists) {
                            return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
                        }
                        return [...prev, updatedOrder];
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tenantId, supabase, playNewOrder]);

    const handleUpdateStatus = useCallback(async (id: string, status: string) => {
        try {
            await updateOrderStatus(id, status);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o));
            toast.success(t('cart.success'));
        } catch {
            toast.error(t('common.error'));
        }
    }, [t]);

    const handleRefresh = () => {
        window.location.reload();
    };

    // Filtro e Ordenação (Mais antigos primeiro - Conformidade KDS)
    const activeOrders = useMemo(() => {
        return orders
            .filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status))
            .filter(o => {
                if (activeSector === 'ALL') return true;
                return o.items.some(item => item.product.category?.preparationSector === activeSector);
            })
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [orders, activeSector]);

    return (
        <div className="flex flex-col h-full bg-zinc-50/50">
            {/* Toolbar - Estilo Dashboard / OlaClick - RESPONSIVE */}
            <div className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-zinc-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-zinc-900 leading-none">
                            {t('kds.title')}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                                {t('kds.active_orders', {
                                    count: activeOrders.length,
                                    sector: activeSector === 'ALL' ? t('kds.all_sectors') : t(`kds.${activeSector.toLowerCase()}`)
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sector Switcher - Responsive */}
                <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 w-full md:w-auto">
                    {(['KITCHEN', 'BAR', 'ALL'] as const).map((s) => (
                        <Button
                            key={s}
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveSector(s)}
                            className={cn(
                                "h-9 px-4 md:px-6 font-bold rounded-lg transition-all flex-1 md:flex-none",
                                activeSector === s
                                    ? "bg-white text-orange-600 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-900"
                            )}
                        >
                            {activeSector === s
                                ? (s === 'ALL' ? t('kds.overview') : s === 'KITCHEN' ? t('kds.kitchen') : t('kds.bar'))
                                : (s === 'ALL' ? t('kds.overview') : s === 'KITCHEN' ? t('kds.kitchen') : t('kds.bar'))
                            }
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={initAudio}
                        className={cn(
                            "h-10 px-4 font-bold rounded-lg border-2 transition-all flex-1 md:flex-none",
                            isSoundEnabled
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-zinc-200 text-zinc-500"
                        )}
                    >
                        {isSoundEnabled ? (
                            <><Volume2 className="w-5 h-5 mr-2" /> {t('kds.sound_on')}</>
                        ) : (
                            <><VolumeX className="w-5 h-5 mr-2" /> {t('kds.sound_off')}</>
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefresh}
                        className="h-10 px-4 font-bold border-2 border-zinc-200 bg-white flex-1 md:flex-none"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        {t('kds.refresh')}
                    </Button>
                </div>
            </div>

            {/* Grid de Pedidos - 3 Colunas para Specs de Leituras a 1 Metro */}
            <div className="flex-1 overflow-y-auto p-8">
                {activeOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 select-none grayscale">
                        <ChefHat className="w-48 h-48 text-zinc-400 mb-6" />
                        <div className="text-center">
                            <h3 className="text-3xl font-black text-zinc-600 uppercase">{t('kds.empty_title')}</h3>
                            <p className="text-lg font-bold mt-2">{t('kds.empty_desc')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {activeOrders.map(order => (
                            <div key={order.id} className="w-full">
                                <KDSOrderCard
                                    order={order}
                                    activeSector={activeSector}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
