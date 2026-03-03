"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { KDSOrderCard, type Order } from "./kds-order-card";
import { updateOrderStatus } from "@/app/actions/orders";
import { toast } from "sonner";
import { useKDSSound } from "../_hooks/use-kds-sound";
import { Button } from "@smart-menu/ui";
import { cn } from "@/lib/utils";
import { RefreshCw, Volume2, VolumeX, ChefHat, Terminal } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface KDSGridProps {
    initialOrders: Order[];
    tenantId: string;
}

export function KDSGrid({ initialOrders, tenantId }: KDSGridProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [activeSector, setActiveSector] = useState<'KITCHEN' | 'BAR' | 'ALL'>('KITCHEN');
    const [realtimeStatus, setRealtimeStatus] = useState<'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR' | 'JOINING'>('JOINING');
    const [telemetryLogs, setTelemetryLogs] = useState<{ id: string, msg: string, type: 'info' | 'error' | 'in', time: string }[]>([]);
    const [showTelemetry, setShowTelemetry] = useState(false);
    const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
    const { isEnabled: isSoundEnabled, initAudio, playNewOrder } = useKDSSound();
    const { t } = useTranslation();
    const supabase = useMemo(() => createClient(), []);

    const addLog = useCallback((msg: string, type: 'info' | 'error' | 'in' = 'info') => {
        setTelemetryLogs(prev => [
            { id: Math.random().toString(36).substr(2, 9), msg, type, time: new Date().toLocaleTimeString() },
            ...prev
        ].slice(0, 50));
    }, []);

    // Stable ref so playNewOrder never re-triggers the subscription effect
    const playNewOrderRef = useRef(playNewOrder);
    useEffect(() => {
        playNewOrderRef.current = playNewOrder;
    }, [playNewOrder]);

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        if (!tenantId) {
            console.error('[KDSGrid] Missing tenantId, cannot subscribe');
            return;
        }

        console.log(`[KDSGrid] Subscribing to dual-mode realtime for tenant: ${tenantId}`);

        const channel = supabase
            .channel(`orders:${tenantId}`)
            .on('broadcast', { event: 'ORDER_CREATED' }, (payload) => {
                console.log('[KDSGrid] Broadcast ORDER_CREATED received:', payload);
                // Handle both wrapped {payload: order} and direct order object
                const newOrder = payload.payload ?? payload;
                if (!newOrder || !newOrder.id) {
                    console.warn('[KDSGrid] Received invalid ORDER_CREATED payload:', payload);
                    return;
                }

                setOrders(prev => {
                    if (prev.find(o => o.id === newOrder.id)) return prev;
                    console.log(`[KDSGrid] Adding new order ${newOrder.id} via broadcast`);
                    return [...prev, newOrder];
                });
                playNewOrderRef.current();
            })
            .on('broadcast', { event: 'STATUS_UPDATED' }, (payload) => {
                console.log('[KDSGrid] Broadcast STATUS_UPDATED received:', payload);
                const updatedOrder = payload.payload ?? payload;
                if (!updatedOrder || !updatedOrder.id) return;

                if (['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(updatedOrder.status)) {
                    setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
                } else {
                    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                }
            })
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                    filter: `tenant_id=eq.${tenantId}`,
                },
                async (payload) => {
                    console.log('[KDSGrid] DB INSERT notification received for order:', payload.new.id);
                    
                    // Avoid redundant fetch if broadcast already handled it
                    setOrders(prev => {
                        const exists = prev.find(o => o.id === payload.new.id);
                        if (exists) {
                            console.log(`[KDSGrid] Order ${payload.new.id} already present, skipping DB fetch`);
                            return prev;
                        }
                        
                        // Re-fetch full details
                        const fetchFullOrder = async () => {
                            try {
                                console.log(`[KDSGrid] Fetching full details for order ${payload.new.id}...`);
                                const API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL
                                    || process.env.NEXT_PUBLIC_API_URL
                                    || 'http://localhost:3001';
                                const res = await fetch(`${API_URL}/public/orders/${payload.new.id}`);
                                if (res.ok) {
                                    const fullOrder = await res.json();
                                    setOrders(innerPrev => {
                                        if (innerPrev.find(o => o.id === fullOrder.id)) return innerPrev;
                                        console.log(`[KDSGrid] Order ${fullOrder.id} added via DB event fallback`);
                                        return [...innerPrev, fullOrder];
                                    });
                                    playNewOrderRef.current();
                                } else {
                                    console.error(`[KDSGrid] API error fetching order: ${res.status}`);
                                }
                            } catch (err) {
                                console.error('[KDSGrid] Error fetching order data:', err);
                            }
                        };
                        fetchFullOrder();
                        return prev;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `tenant_id=eq.${tenantId}`,
                },
                (payload) => {
                    console.log('[KDSGrid] DB UPDATE notification received for order:', payload.new.id, 'New status:', payload.new.status);
                    const updatedStatus = payload.new.status as Order['status'];
                    const orderId = payload.new.id as string;

                    if (['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(updatedStatus)) {
                        setOrders(prev => prev.filter(o => o.id !== orderId));
                    } else {
                        setOrders(prev => {
                            const exists = prev.find(o => o.id === orderId);
                            if (exists) {
                                return prev.map(o => o.id === orderId ? { ...o, status: updatedStatus } : o);
                            }
                            // If it doesn't exist, it might be an order we missed entirely?
                            // For now, simpler to wait for it via broadcast or initial fetch
                            return prev;
                        });
                    }
                }
            )
            .subscribe((status, err) => {
                console.log(`[KDSGrid] Realtime channel status for orders:${tenantId}:`, status);
                setRealtimeStatus(status as any);
                addLog(`Canal ${status}`, status === 'SUBSCRIBED' ? 'info' : 'error');
                if (err) {
                    console.error('[KDSGrid] Realtime subscription error:', err);
                    addLog(`Erro subscrição: ${err.message}`, 'error');
                    setRealtimeStatus('CHANNEL_ERROR');
                }
            });
        
        // --- Polling Fallback (30s) ---
        const pollInterval = setInterval(async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL
                    || process.env.NEXT_PUBLIC_API_URL
                    || 'http://localhost:3001';
                
                const res = await fetch(`${API_URL}/public/orders/tenant/${tenantId}/kitchen`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                
                const remoteOrders: Order[] = await res.json();
                const now = new Date().toLocaleTimeString();
                setLastSync(now);

                setOrders(currentLocalOrders => {
                    let hasNew = false;
                    const merged = [...currentLocalOrders];

                    remoteOrders.forEach(remote => {
                        const localIdx = merged.findIndex(l => l.id === remote.id);
                        if (localIdx === -1) {
                            // Definitive catch: Order exists on server but not here
                            merged.push(remote);
                            hasNew = true;
                            addLog(`Pedido ${remote.id.slice(0,8)} capturado via Polling`, 'in');
                        } else if (merged[localIdx].status !== remote.status) {
                            // Status update catch
                            merged[localIdx] = { ...merged[localIdx], ...remote };
                        }
                    });

                    if (hasNew) playNewOrderRef.current();
                    return merged;
                });

                addLog(`Sincronização concluída (${remoteOrders.length} pedidos)`, 'info');
            } catch (err: any) {
                console.error('[KDSGrid] Polling error:', err);
                addLog(`Erro sincronização: ${err.message}`, 'error');
            }
        }, 30000);

        return () => {
            console.log(`[KDSGrid] Cleaning up subscription and interval for tenant: ${tenantId}`);
            supabase.removeChannel(channel);
            clearInterval(pollInterval);
        };
    }, [tenantId, supabase, addLog]);

    const handleUpdateStatus = useCallback(async (id: string, status: string) => {
        try {
            await updateOrderStatus(id, status);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o));
            toast.success(t('cart.success'));
        } catch {
            toast.error(t('common.error'));
        }
    }, [t]);

    const handleTestRealtime = async () => {
        try {
            addLog('Enviando Ping de Teste...', 'info');
            await supabase.channel(`orders:${tenantId}`).send({
                type: 'broadcast',
                event: 'PING',
                payload: { text: "Ping from KDS", time: new Date().toISOString() }
            });
            toast.info('Ping de teste enviado!');
        } catch (e) {
            toast.error('Erro ao enviar ping');
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    // Filtro e Ordenação (Mais antigos primeiro - Conformidade KDS)
    const activeOrders = useMemo(() => {
        return orders
            .filter(o => {
                if (!o || !o.status) return false;
                return ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status);
            })
            .filter(o => {
                if (activeSector === 'ALL') return true;
                if (!o.items) return false;
                return o.items.some(item => item?.product?.category?.preparationSector === activeSector);
            })
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [orders, activeSector]);

    return (
        <div className="flex flex-col h-full bg-zinc-50/50">
            {/* Toolbar - Estilo Dashboard / OlaClick - RESPONSIVE */}
            <div className="px-4 md:px-6 py-2 md:py-3 bg-white border-b border-zinc-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-zinc-900 leading-none">
                            {t('kds.title')}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 rounded-full border border-zinc-200">
                                <span className={cn(
                                    "h-2 w-2 rounded-full",
                                    realtimeStatus === 'SUBSCRIBED' ? "bg-green-500 animate-pulse" : 
                                    realtimeStatus === 'JOINING' ? "bg-orange-400 animate-pulse" : "bg-red-500"
                                )} />
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
                                    {realtimeStatus === 'SUBSCRIBED' ? 'LIVE' : 
                                     realtimeStatus === 'JOINING' ? 'CONNECTING' : 'OFFLINE'}
                                </span>
                            </div>
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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowTelemetry(!showTelemetry)}
                        className={cn("h-10 w-10 border-2", showTelemetry ? "border-zinc-900 bg-zinc-100" : "border-zinc-200")}
                    >
                        <Terminal className={cn("w-5 h-5", showTelemetry ? "text-zinc-900" : "text-zinc-400")} />
                    </Button>
                </div>
            </div>

            {/* Telemetry Log Panel */}
            {showTelemetry && (
                <div className="bg-zinc-900 text-zinc-300 p-3 font-mono text-[10px] h-32 overflow-y-auto border-b border-zinc-800 shadow-inner">
                    <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-1">
                        <span className="text-zinc-500 font-bold uppercase">Telemetria (Live) | Sinc: {lastSync}</span>
                        <div className="flex gap-2">
                             <button onClick={handleTestRealtime} className="text-blue-400 hover:text-blue-300 underline">Enviar Ping Teste</button>
                             <button onClick={() => setTelemetryLogs([])} className="text-zinc-500 hover:text-white">Limpar</button>
                        </div>
                    </div>
                    {telemetryLogs.length === 0 && <div className="text-zinc-700 italic">Aguardando eventos...</div>}
                    {telemetryLogs.map(log => (
                        <div key={log.id} className="flex gap-2 mb-0.5 leading-tight">
                            <span className="text-zinc-600">[{log.time}]</span>
                            <span className={cn(
                                "font-bold",
                                log.type === 'in' ? "text-green-400" : 
                                log.type === 'error' ? "text-red-400" : "text-blue-400"
                            )}>{log.type.toUpperCase()}:</span>
                            <span className="break-all">{log.msg}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Grid de Pedidos - 3 Colunas para Specs de Leituras a 1 Metro */}
            <div className="flex-1 overflow-y-auto p-2 md:p-4">
                {activeOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 select-none grayscale">
                        <ChefHat className="w-48 h-48 text-zinc-400 mb-6" />
                        <div className="text-center">
                            <h3 className="text-3xl font-black text-zinc-600 uppercase">{t('kds.empty_title')}</h3>
                            <p className="text-lg font-bold mt-2">{t('kds.empty_desc')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3">
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
