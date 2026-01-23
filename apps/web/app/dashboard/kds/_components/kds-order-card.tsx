"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
    };
    options?: {
        optionValue: {
            name: string;
        }
    }[];
    notes?: string;
    isDone?: boolean;
}

export interface Order {
    id: string;
    status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
    items: OrderItem[];
    table?: {
        number: number;
    };
    createdAt: string;
    total: number;
}

interface KDSOrderCardProps {
    order: Order;
    onUpdateStatus: (id: string, status: string) => void;
    onToggleItem?: (orderId: string, itemId: string, isDone: boolean) => void;
}

// Time thresholds in minutes
const THRESHOLDS = {
    WARNING: 10,
    CRITICAL: 20,
};

export function KDSOrderCard({ order, onUpdateStatus, onToggleItem }: KDSOrderCardProps) {
    const [elapsed, setElapsed] = useState(0);
    const [localItems, setLocalItems] = useState(order.items);

    useEffect(() => {
        setLocalItems(order.items);
    }, [order.items]);

    useEffect(() => {
        const calculateElapsed = () => {
            const start = new Date(order.createdAt).getTime();
            const now = new Date().getTime();
            setElapsed(Math.floor((now - start) / 1000));
        };
        calculateElapsed();
        const interval = setInterval(calculateElapsed, 1000);
        return () => clearInterval(interval);
    }, [order.createdAt]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} min`;
    };

    const elapsedMinutes = elapsed / 60;

    // Time badge color based on elapsed time
    const getTimeBadgeStyle = () => {
        if (order.status === 'READY') return "bg-[#16A34A] text-white";
        if (elapsedMinutes > THRESHOLDS.CRITICAL) return "bg-destructive text-white";
        if (elapsedMinutes > THRESHOLDS.WARNING) return "bg-[#F59E0B] text-white";
        return "bg-[#16A34A] text-white";
    };

    const handleToggleItem = (itemId: string, checked: boolean) => {
        setLocalItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, isDone: checked } : item
            )
        );
        onToggleItem?.(order.id, itemId, checked);
    };

    const allItemsDone = localItems.every(item => item.isDone);

    return (
        <Card className="bg-[#020617] border border-[#1E293B] shadow-sm hover:shadow-md transition-shadow">
            {/* Header - Order ID, Location, Time */}
            <CardHeader className="pb-3 space-y-3">
                {/* Top row: Order number and AHORA */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 uppercase">
                        AHORA
                    </span>
                </div>

                {/* Location badge and time */}
                <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-white hover:bg-primary/90 px-3 py-1 text-sm font-medium">
                        <MapPin className="w-3 h-3 mr-1.5" />
                        En sitio - Mesa {order.table?.number || "Balcão"}
                    </Badge>
                    <Badge className={cn("px-2 py-1 text-xs font-medium", getTimeBadgeStyle())}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(elapsed)}
                    </Badge>
                </div>

                {/* Accepted time */}
                <p className="text-xs text-slate-500">
                    Aceptado a las {new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </CardHeader>

            {/* Content - Item list with checkboxes */}
            <CardContent className="pt-0 pb-3 space-y-3">
                {localItems.map((item) => (
                    <div key={item.id} className="space-y-1">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id={`item-${item.id}`}
                                checked={item.isDone || false}
                                onCheckedChange={(checked) => handleToggleItem(item.id, checked as boolean)}
                                className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label
                                htmlFor={`item-${item.id}`}
                                className={cn(
                                    "text-sm font-medium leading-tight cursor-pointer flex-1",
                                    item.isDone ? "line-through text-slate-500" : "text-slate-200"
                                )}
                            >
                                <span className="font-semibold">x{item.quantity}</span> {item.product.name}
                            </label>
                        </div>

                        {/* Modifiers */}
                        {item.options && item.options.length > 0 && (
                            <p className="text-xs text-slate-500 pl-7">
                                {item.options.map(opt => `+ ${opt.optionValue.name}`).join(", ")}
                            </p>
                        )}

                        {/* Notes */}
                        {item.notes && (
                            <p className="text-xs text-orange-600 font-medium pl-7">
                                + {item.notes}
                            </p>
                        )}
                    </div>
                ))}
            </CardContent>

            {/* Footer - Action button */}
            <CardFooter className="pt-3">
                {order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'PREPARING' ? (
                    <Button
                        className={cn(
                            "w-full h-10 text-sm font-bold uppercase tracking-wide",
                            allItemsDone
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-primary/80 hover:bg-primary/70"
                        )}
                        onClick={() => onUpdateStatus(order.id, 'READY')}
                    >
                        PREPARADO
                    </Button>
                ) : (
                    <div className="w-full h-10 flex items-center justify-center gap-2 text-[#16A34A] font-bold text-sm bg-[#16A34A]/10 rounded-md border border-[#16A34A]/20 uppercase">
                        <CheckCircle2 className="w-4 h-4" />
                        LISTO
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
