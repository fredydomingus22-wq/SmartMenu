"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Clock, MapPin, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { getTranslatedValue } from "@/lib/utils";

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        category?: {
            preparationSector: 'KITCHEN' | 'BAR';
        };
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
    activeSector?: 'KITCHEN' | 'BAR' | 'ALL';
    onUpdateStatus: (id: string, status: string) => void;
    onToggleItem?: (orderId: string, itemId: string, isDone: boolean) => void;
}

// Limites de tempo para KDS (v3 Specs)
const THRESHOLDS = {
    WARNING: 10,
    CRITICAL: 20,
};

export function KDSOrderCard({ order, activeSector = 'ALL', onUpdateStatus, onToggleItem }: KDSOrderCardProps) {
    const { t, locale } = useTranslation();
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
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const elapsedMinutes = elapsed / 60;

    // Estilo baseado no tempo (Conformidade KDS)
    const getUrgencyColor = () => {
        if (order.status === 'READY') return "bg-green-500 text-white";
        if (elapsedMinutes > THRESHOLDS.CRITICAL) return "bg-red-600 text-white animate-pulse";
        if (elapsedMinutes > THRESHOLDS.WARNING) return "bg-orange-500 text-white";
        return "bg-green-500 text-white";
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
        <Card className="flex flex-col h-full bg-white border border-zinc-200 shadow-sm transition-all hover:shadow-md">
            {/* Header com IDs e Urgência */}
            <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-zinc-500 font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <Badge variant="outline" className="border-zinc-300 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                        AGORA
                    </Badge>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <Badge className="bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 text-sm font-bold flex-1 justify-center">
                        <MapPin className="w-3.5 h-3.5 mr-2" />
                        MESA {order.table?.number || "BALCÃO"}
                    </Badge>
                    <Badge className={cn("px-3 py-1.5 text-sm font-bold flex-1 justify-center font-mono", getUrgencyColor())}>
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        {formatTime(elapsed)}
                    </Badge>
                </div>

                {/* Tempo de Aceitação (Legal para KDS) */}
                <p className="text-[10px] text-zinc-400 mt-2 text-right italic font-medium">
                    Aceite às {new Date(order.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </CardHeader>

            {/* Itens do Pedido - Max legibilidade */}
            <CardContent className="flex-grow py-4 space-y-4 max-h-[400px] overflow-y-auto">
                {localItems
                    .filter(item => activeSector === 'ALL' || item.product.category?.preparationSector === activeSector)
                    .map((item) => (
                        <div key={item.id} className="group">
                            <div className="flex items-start gap-4">
                                <Checkbox
                                    id={`item-${item.id}`}
                                    checked={item.isDone || false}
                                    onCheckedChange={(checked) => handleToggleItem(item.id, checked as boolean)}
                                    className="w-6 h-6 rounded-md border-2 border-zinc-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                    <label
                                        htmlFor={`item-${item.id}`}
                                        className={cn(
                                            "text-lg font-bold leading-tight cursor-pointer",
                                            item.isDone ? "line-through text-zinc-300" : "text-zinc-900"
                                        )}
                                    >
                                        <span className="text-orange-600 font-black mr-2">x{item.quantity}</span>
                                        {getTranslatedValue(item.product.name, locale)}
                                    </label>

                                    {/* Opções/Modificadores */}
                                    {item.options && item.options.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {item.options.map((opt, i) => (
                                                <span key={i} className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded uppercase">
                                                    + {getTranslatedValue(opt.optionValue.name, locale)}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Notas Críticas - Destaque Visual */}
                                    {item.notes && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-red-700">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-xs font-black uppercase italic">{item.notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </CardContent>

            {/* Rodapé - Botões GRANDES (Spec 14.10) */}
            <CardFooter className="pt-2 pb-4 px-4 border-t border-zinc-100">
                {order.status === 'READY' ? (
                    <Button
                        size="lg"
                        className="w-full h-14 text-base font-black uppercase tracking-widest transition-all bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                        onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                    >
                        ✓ {t('kds.deliver')}
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        className={cn(
                            "w-full h-14 text-base font-black uppercase tracking-widest transition-all",
                            allItemsDone
                                ? "bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20"
                                : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300 border-none cursor-not-allowed"
                        )}
                        onClick={() => onUpdateStatus(order.id, 'READY')}
                        disabled={!allItemsDone}
                    >
                        {allItemsDone ? t('kds.order_ready') : t('kds.items_missing')}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
