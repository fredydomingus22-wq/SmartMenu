"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, ChefHat, CheckCircle2, XCircle, Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@smart-menu/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@smart-menu/ui";
import { formatCurrency, cn, getTranslatedValue } from "@smart-menu/ui";
import { useTranslation } from "@/hooks/use-translation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChatWindow } from "../../../../_components/chat-window";

import type { TrackingMapProps } from "../../../../_components/TrackingMap";

const TrackingMap = dynamic<TrackingMapProps>(() => import("../../../../_components/TrackingMap"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

interface OrderItem {
    id: string;
    quantity: number;
    price: string;
    product: {
        id: string;
        name: string | Record<string, string>;
        imageUrl: string | null;
    };
    options: {
        optionValue: {
            id: string;
            name: string | Record<string, string>;
            price: string;
        };
    }[];
}

interface Order {
    id: string;
    tenantId: string;
    status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
    total: string;
    createdAt: string;
    items: OrderItem[];
    table?: { number: number } | null;
    deliveryAssignment?: { riderId: string } | null;
}

const STATUS_CONFIG = {
    PENDING: { label: "Aguardando Confirmação", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    CONFIRMED: { label: "Pedido Confirmado", icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    PREPARING: { label: "Preparando...", icon: ChefHat, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    READY: { label: "Pronto para Retirada!", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    DELIVERED: { label: "Entregue", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    CANCELLED: { label: "Cancelado", icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
};

export default function OrderStatusPage() {
    const params = useParams<{ id: string; orderId: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const { locale } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const tenantIdRef = useRef<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const fetchOrder = async () => {
        try {
            const res = await fetch(`${API_URL}/public/orders/${params.orderId}`);
            if (!res.ok) throw new Error("Pedido não encontrado");
            const data: Order = await res.json();
            setOrder(data);
            setError(null);
            // Store tenantId for the channel subscription
            if (data.tenantId && !tenantIdRef.current) {
                tenantIdRef.current = data.tenantId;
            }
            return data;
        } catch (err) {
            setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Load order initially
        fetchOrder().then((data) => {
            if (!data) return;
            const supabase = createClient();
            const tenantId = data.tenantId;

            // 2. Subscribe via broadcast (works without auth — backend sends to this channel)
            // Channel name must match what the backend sends: `orders:{tenantId-UUID}`
            console.log(`[OrderStatus] Subscribing broadcast channel: orders:${tenantId}`);
            const broadcastChannel = supabase
                .channel(`orders:${tenantId}`)
                .on("broadcast", { event: "STATUS_UPDATED" }, (event) => {
                    console.log("[OrderStatus] Broadcast STATUS_UPDATED:", event);
                    const updated: Order | undefined = event.payload?.payload ?? event.payload;
                    if (updated?.id === params.orderId) {
                        setOrder(updated);
                    }
                })
                .subscribe((status) => {
                    console.log(`[OrderStatus] Broadcast subscription: ${status}`);
                });

            // 3. Also subscribe via Postgres Changes as additional safety net
            // (works because RLS is disabled on orders and table is in supabase_realtime)
            console.log(`[OrderStatus] Subscribing Postgres Changes for order: ${params.orderId}`);
            const pgChannel = supabase
                .channel(`order-pg-${params.orderId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "orders",
                        filter: `id=eq.${params.orderId}`,
                    },
                    async () => {
                        console.log("[OrderStatus] Postgres Changes UPDATE received — re-fetching");
                        await fetchOrder();
                    }
                )
                .subscribe((status) => {
                    console.log(`[OrderStatus] Postgres Changes subscription: ${status}`);
                });

            return () => {
                supabase.removeChannel(broadcastChannel);
                supabase.removeChannel(pgChannel);
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <XCircle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
                <p className="text-muted-foreground mt-2">{error}</p>
                <Button onClick={() => router.push(`/menu/${params.id}`)} className="mt-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Cardápio
                </Button>
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[order.status];
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-[100dvh] bg-background pb-20">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/menu/${params.id}`)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="font-bold text-lg">Status do Pedido</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-6">
                <Card className={cn("border-2", statusConfig.bg)}>
                    <CardContent className="py-8 flex flex-col items-center text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={order.status}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <StatusIcon className={cn("h-20 w-20 mb-4", statusConfig.color)} />
                            </motion.div>
                        </AnimatePresence>
                        <h2 className={cn("text-2xl font-black uppercase tracking-wide", statusConfig.color)}>
                            {statusConfig.label}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Pedido #{order.id.slice(-6).toUpperCase()}
                        </p>
                        {order.table && (
                            <p className="text-sm font-semibold mt-1">Mesa {order.table.number}</p>
                        )}
                    </CardContent>
                </Card>

                {(order.status === "PREPARING" || order.status === "READY" || order.status === "DELIVERED") && order.deliveryAssignment?.riderId && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-bold text-sm">Acompanhe seu pedido</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full gap-2 border-primary text-primary hover:bg-primary/5"
                                onClick={() => setChatOpen(true)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Mensagem ao Rider
                            </Button>
                        </div>
                        <TrackingMap riderId={order.deliveryAssignment.riderId} />
                        <ChatWindow
                            tenantId={params.id}
                            orderId={params.orderId}
                            riderId={order.deliveryAssignment.riderId}
                            openByDefault={chatOpen}
                        />
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Itens do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    {item.product.imageUrl ? (
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={getTranslatedValue(item.product.name, locale)}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                            <Package className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{item.quantity}x {getTranslatedValue(item.product.name, locale)}</p>
                                    {item.options.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {item.options.map(o => getTranslatedValue(o.optionValue.name, locale)).join(", ")}
                                        </p>
                                    )}
                                </div>
                                <span className="font-bold text-sm">
                                    {formatCurrency(Number(item.price) * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-4 flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-xl font-black text-primary">
                            {formatCurrency(Number(order.total))}
                        </span>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
