"use client";

import { useEffect, useState, useMemo } from "react";
import { useOrderRealtime } from "@/hooks/use-order-realtime";
import { updateOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, CheckCircle2, PlayCircle } from "lucide-react";



interface OrderItem {
    id: string;
    quantity: number;
    notes?: string;
    product: {
        name: string;
    };
}

interface Order {
    id: string;
    status: string;
    createdAt: string;
    table: {
        number: string;
    } | null;
    items: OrderItem[];
}

export function KDSBoard({ orders: initialOrders, tenantId }: { orders: Order[], tenantId: string }) {
    const [orders, setOrders] = useState(initialOrders);
    const { lastEvent } = useOrderRealtime(tenantId);

    useEffect(() => {
        if (lastEvent) {
            if (lastEvent.event === "ORDER_CREATED") {
                const payload = lastEvent.payload as Order;
                setTimeout(() => setOrders(prev => [payload, ...prev]), 0);
                // Notification sound for kitchen
                const audio = new Audio("/sounds/new-order.mp3");
                audio.play().catch(e => console.warn("Audio play failed:", e));
            } else if (lastEvent.event === "STATUS_UPDATED") {
                const payload = lastEvent.payload as Order;
                setTimeout(() => setOrders(prev => prev.map(o => o.id === payload.id ? payload : o)), 0);
            }
        }
    }, [lastEvent]);

    const activeOrders = useMemo(() =>
        orders.filter(o => ["PENDING", "PREPARING", "READY"].includes(o.status)),
        [orders]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        const result = await updateOrderStatus(id, newStatus);
        if (!result.success) {
            toast.error(result.error);
        }
    };

    const columns = [
        { id: "PENDING", title: "Novos Pedidos", icon: Clock, color: "text-orange-500", btnText: "Preparar", nextStatus: "PREPARING" },
        { id: "PREPARING", title: "Em Preparo", icon: PlayCircle, color: "text-blue-500", btnText: "Pronto", nextStatus: "READY" },
        { id: "READY", title: "Prontos", icon: CheckCircle2, color: "text-green-500", btnText: "Entregar", nextStatus: "DELIVERED" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {columns.map((column) => (
                <div key={column.id} className="flex flex-col gap-4 bg-zinc-100/50 p-4 rounded-xl border dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <column.icon className={`h-5 w-5 ${column.color}`} />
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{column.title}</h3>
                        </div>
                        <Badge variant="outline" className="bg-white dark:bg-zinc-950">
                            {activeOrders.filter(o => o.status === column.id).length}
                        </Badge>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {activeOrders
                            .filter(o => o.status === column.id)
                            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                            .map((order) => (
                                <Card key={order.id} className="border-zinc-200 shadow-sm dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                                        <span className="font-black text-xl">Mesa {order.table?.number || "?"}</span>
                                        <span className="text-[10px] text-zinc-400">
                                            {Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000)} min
                                        </span>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <ul className="space-y-2 mb-6">
                                            {order.items.map((item) => (
                                                <li key={item.id} className="text-sm font-medium">
                                                    <span className="inline-block w-6 text-orange-600 font-bold">{item.quantity}x</span>
                                                    <span className="text-zinc-800 dark:text-zinc-200">{item.product.name}</span>
                                                    {item.notes && (
                                                        <p className="text-[10px] text-zinc-500 italic ml-6 border-l-2 pl-2 mt-1">
                                                            {item.notes}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => handleUpdateStatus(order.id, column.nextStatus)}
                                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold"
                                        >
                                            {column.btnText}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
