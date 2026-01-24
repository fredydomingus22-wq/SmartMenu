"use client";

import { useEffect, useState } from "react";
import { useOrderRealtime } from "@/hooks/use-order-realtime";
import { updateOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "sonner";
import { Clock, CheckCircle2, PlayCircle, XCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { getTranslatedValue } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

import { Order } from "../_types";

export function OrdersClient({ orders: initialOrders, tenantId }: { orders: Order[], tenantId: string }) {
    const [orders, setOrders] = useState(initialOrders);
    const { lastEvent } = useOrderRealtime(tenantId);
    const { locale } = useTranslation();

    useEffect(() => {
        if (lastEvent) {
            if (lastEvent.event === "ORDER_CREATED") {
                const payload = lastEvent.payload as Order;
                setTimeout(() => setOrders(prev => [payload, ...prev]), 0);
                toast.info(`Novo pedido recebido: Mesa ${payload.table?.number || 'N/A'}`);
                // Play notification sound
                const audio = new Audio("/sounds/notification.mp3");
                audio.play().catch(e => console.warn("Audio play failed:", e));
            } else if (lastEvent.event === "STATUS_UPDATED") {
                const payload = lastEvent.payload as Order;
                setTimeout(() => setOrders(prev => prev.map(o => o.id === payload.id ? payload : o)), 0);
            }
        }
    }, [lastEvent]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        const result = await updateOrderStatus(id, newStatus);
        if (!result.success) {
            toast.error(result.error);
        }
    };

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING":
                return { label: "Pendente", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-500", icon: Clock };
            case "CONFIRMED":
                return { label: "Confirmado", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500", icon: CheckCircle2 };
            case "PREPARING":
                return { label: "Em Preparo", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-500", icon: PlayCircle };
            case "READY":
                return { label: "Pronto", color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500", icon: CheckCircle2 };
            case "DELIVERED":
                return { label: "Entregue", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900/20 dark:text-zinc-400", icon: ChevronRight };
            case "CANCELLED":
                return { label: "Cancelado", color: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-500", icon: XCircle };
            default:
                return { label: status, color: "bg-gray-100 text-gray-600", icon: Clock };
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {sortedOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <motion.div
                                key={order.id}
                                variants={item}
                                layout
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            >
                                <InteractiveCard glass className="h-full flex flex-col">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-bold tracking-tight">
                                                Mesa {order.table?.number || "N/A"}
                                            </CardTitle>
                                            <div className="text-[10px] text-zinc-500 font-medium">
                                                ID: {order.id.slice(0, 8).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${statusConfig.color}`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {statusConfig.label}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="text-xs text-zinc-500 mb-6 flex items-center gap-1.5 font-medium">
                                            <Clock className="h-3 w-3" />
                                            {format(new Date(order.createdAt), "HH:mm '·' d 'de' MMMM", { locale: ptBR })}
                                        </div>

                                        <div className="space-y-3 mb-8 flex-1">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-start gap-4 p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {item.quantity}x {getTranslatedValue(item.product.name, locale)}
                                                        </span>
                                                        {item.notes && (
                                                            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mt-0.5">Note: {item.notes}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total</span>
                                                <span className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                                                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(order.total)}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {order.status === "PENDING" && (
                                                    <Button size="sm" onClick={() => handleUpdateStatus(order.id, "PREPARING")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-4 transform transition-transform hover:scale-105 active:scale-95">
                                                        Confirmar
                                                    </Button>
                                                )}
                                                {order.status === "PREPARING" && (
                                                    <Button size="sm" onClick={() => handleUpdateStatus(order.id, "READY")} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full px-4 transform transition-transform hover:scale-105 active:scale-95">
                                                        Pronto
                                                    </Button>
                                                )}
                                                {order.status === "READY" && (
                                                    <Button size="sm" onClick={() => handleUpdateStatus(order.id, "DELIVERED")} variant="outline" className="font-bold rounded-full px-4 border-2">
                                                        Entregar
                                                    </Button>
                                                )}
                                                {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                                                    <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(order.id, "CANCELLED")} className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-9 w-9 p-0">
                                                        <XCircle className="h-5 w-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </InteractiveCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <Clock className="h-12 w-12 mb-4 opacity-20" />
                    <p>Nenhum pedido encontrado no momento.</p>
                </div>
            )}
        </div>
    );
}
