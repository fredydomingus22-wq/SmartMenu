"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { KDSOrderCard, type Order } from "./kds-order-card";
import { updateOrderStatus } from "@/app/actions/orders";
import { toast } from "sonner";
import { useKDSSound } from "../_hooks/use-kds-sound";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, Volume2, VolumeX } from "lucide-react";

interface KDSGridProps {
    initialOrders: Order[];
    tenantId: string;
}

export function KDSGrid({ initialOrders, tenantId }: KDSGridProps) {
    const [orders, setOrders] = useState(initialOrders);
    const { isEnabled: isSoundEnabled, initAudio, playNewOrder } = useKDSSound();
    const supabase = createClient();

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        const channel = supabase.channel(`orders:${tenantId}`)
            .on('broadcast', { event: 'ORDER_CREATED' }, (payload) => {
                console.log('New Order:', payload);
                setOrders(prev => [...prev, payload.payload]);
                playNewOrder();
            })
            .on('broadcast', { event: 'STATUS_UPDATED' }, (payload) => {
                console.log('Order Updated:', payload);
                const updatedOrder = payload.payload;
                setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
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
            toast.success(`Pedido atualizado para ${status}`);
        } catch {
            toast.error("Falha ao atualizar status");
        }
    }, []);

    const handleToggleItem = useCallback((orderId: string, itemId: string, isDone: boolean) => {
        console.log(`Toggle item ${itemId} in order ${orderId} to ${isDone}`);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    const activeOrders = orders
        .filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return (
        <div className="flex flex-col h-full bg-[#0F172A]">
            {/* Header - OlaClick layout with SmartMenu colors */}
            <div className="px-6 py-4 bg-[#020617] border-b border-[#1E293B] flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">
                        Pedidos en cocina
                    </h2>
                    <span className="text-sm text-slate-400">
                        ({activeOrders.length})
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={initAudio}
                        className={cn(
                            "h-9 px-3 border",
                            isSoundEnabled
                                ? "border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A]"
                                : "border-slate-300 text-slate-600"
                        )}
                    >
                        {isSoundEnabled ? (
                            <><Volume2 className="w-4 h-4 mr-2" />Som</>
                        ) : (
                            <><VolumeX className="w-4 h-4 mr-2" />Som</>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="h-9 px-3 border-[#1E293B] text-slate-300 hover:text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                        <span className="text-8xl opacity-50">🍳</span>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-slate-300">Cozinha Tranquila</h3>
                            <p className="text-sm mt-1 text-slate-500">Nenhum pedido pendente no momento.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {activeOrders.map(order => (
                            <KDSOrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={handleUpdateStatus}
                                onToggleItem={handleToggleItem}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
