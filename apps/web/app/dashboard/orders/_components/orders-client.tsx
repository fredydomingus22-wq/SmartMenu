"use client";

import { useEffect, useState, useMemo } from "react";
import { useOrderRealtime } from "@/hooks/use-order-realtime";
import { updateOrderStatus } from "@/app/actions/orders";
import {
    DataTable,
    Badge,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Label,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@smart-menu/ui";
import { toast } from "sonner";
import { Clock, MoreHorizontal, CheckCircle2, PlayCircle, XCircle, Printer, Eye } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../_types";
import { getTranslatedValue } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";



export function OrdersClient({ orders: initialOrders, tenantId }: { orders: Order[], tenantId: string }) {
    const [orders, setOrders] = useState(initialOrders);
    const { lastEvent } = useOrderRealtime(tenantId);
    const { locale } = useTranslation();

    // Cancellation Dialog State
    const [cancellationOrderId, setCancellationOrderId] = useState<string | null>(null);
    const [cancellationReason, setCancellationReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    // Details Sheet State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [tableFilter, setTableFilter] = useState("");
    const [date, setDate] = useState<{ from?: Date; to?: Date } | undefined>(undefined);


    useEffect(() => {
        if (lastEvent) {
            if (lastEvent.event === "ORDER_CREATED") {
                const payload = lastEvent.payload as Order;
                setOrders(prev => [payload, ...prev]);
                toast.info(`Novo pedido: Mesa ${payload.table?.number || "N/A"}`);
            } else if (lastEvent.event === "STATUS_UPDATED") {
                const payload = lastEvent.payload as Order;
                setOrders(prev => prev.map(o => o.id === payload.id ? payload : o));
            }
        }
    }, [lastEvent]);

    const handleUpdateStatus = async (id: string, newStatus: string, notes?: string) => {
        const result = await updateOrderStatus(id, newStatus, notes);
        if (!result.success) {
            toast.error(result.error);
        } else {
            toast.success(`Status atualizado para ${newStatus}`);
            if (newStatus === "CANCELLED") {
                setCancellationOrderId(null);
                setCancellationReason("");
            }
        }
    };

    const confirmCancellation = async () => {
        if (!cancellationOrderId || !cancellationReason.trim()) {
            toast.error("Por favor, informe o motivo do cancelamento.");
            return;
        }
        setIsCancelling(true);
        await handleUpdateStatus(cancellationOrderId, "CANCELLED", cancellationReason);
        setIsCancelling(false);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status Filter
            if (statusFilter !== "ALL" && order.status !== statusFilter) return false;

            // Table Filter
            if (tableFilter && !order.table?.number?.toString().includes(tableFilter)) return false;

            // Date Filter
            if (date?.from) {
                const orderDate = new Date(order.createdAt);
                if (orderDate < date.from) return false;
                if (date.to && orderDate > new Date(new Date(date.to).setHours(23, 59, 59, 999))) return false;
            }

            return true;
        });
    }, [orders, statusFilter, tableFilter, date]);

    const columns: ColumnDef<Order>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                    #{row.original.id.slice(0, 8)}
                </span>
            ),
        },
        {
            accessorKey: "table.number",
            header: "Mesa",
            cell: ({ row }) => (
                <span className="font-bold">
                    Mesa {row.original.table?.number || "N/A"}
                </span>
            ),
        },
        {
            accessorKey: "items",
            header: "Itens",
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    {row.original.items.map((item) => (
                        <span key={item.id} className="text-[11px] leading-tight text-zinc-600 dark:text-zinc-400">
                            {item.quantity}x {getTranslatedValue(item.product.name, locale)}
                        </span>
                    )).slice(0, 2)}

                    {row.original.items.length > 2 && (
                        <span className="text-[10px] text-zinc-400">+{row.original.items.length - 2} outros...</span>
                    )}
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Tempo",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true, locale: ptBR })}
                </div>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <span className="font-bold">
                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(row.original.total)}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const config: Record<string, { label: string, color: string }> = {
                    PENDING: { label: "Pendente", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
                    CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
                    PREPARING: { label: "Preparo", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
                    READY: { label: "Pronto", color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
                    DELIVERED: { label: "Entregue", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900/20 dark:text-zinc-400" },
                    CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
                };
                const item = config[status] || { label: status, color: "bg-gray-100" };

                return (
                    <Badge className={`${item.color} border-0 shadow-none font-bold text-[10px]`}>
                        {item.label}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const order = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("Imprimir", order.id)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir
                            </DropdownMenuItem>
                            {order.status === "PENDING" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "PREPARING")} className="text-orange-600 font-bold">
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    Preparar
                                </DropdownMenuItem>
                            )}
                            {order.status === "PREPARING" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "READY")} className="text-green-600 font-bold">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Pronto
                                </DropdownMenuItem>
                            )}
                            {order.status === "READY" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "DELIVERED")}>
                                    Entregar
                                </DropdownMenuItem>
                            )}
                            {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                                <DropdownMenuItem
                                    onClick={() => setCancellationOrderId(order.id)}
                                    className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900/40"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [locale]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos os Status</SelectItem>
                            <SelectItem value="PENDING">Pendentes</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmados</SelectItem>
                            <SelectItem value="PREPARING">Em Preparo</SelectItem>
                            <SelectItem value="READY">Prontos</SelectItem>
                            <SelectItem value="DELIVERED">Entregues</SelectItem>
                            <SelectItem value="CANCELLED">Cancelados</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Filtrar por Mesa..."
                        value={tableFilter}
                        onChange={(e) => setTableFilter(e.target.value)}
                        className="w-full sm:w-[150px]"
                    />

                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                            onChange={(e) => setDate(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))}
                            className="w-[140px]"
                        />
                        <span className="text-zinc-500">-</span>
                        <Input
                            type="date"
                            value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                            onChange={(e) => setDate(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))}
                            className="w-[140px]"
                        />
                    </div>

                    {(statusFilter !== "ALL" || tableFilter || date?.from || date?.to) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setStatusFilter("ALL");
                                setTableFilter("");
                                setDate(undefined);
                            }}
                            className="px-2"
                        >
                            Limpar
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border shadow-sm">
                <DataTable
                    columns={columns}
                    data={filteredOrders}
                    searchKey="id"
                    placeholder="Pesquisar por ID..."
                />
            </div>

            <Dialog open={!!cancellationOrderId} onOpenChange={(open) => !open && setCancellationOrderId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancelar Pedido</DialogTitle>
                        <DialogDescription>
                            Por favor, informe o motivo do cancelamento deste pedido. Esta ação é irreversível.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Motivo</Label>
                            <Input
                                id="reason"
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="Ex: Cliente desistiu, Ingrediente indisponível..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancellationOrderId(null)}>
                            Voltar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancellation}
                            disabled={isCancelling || !cancellationReason.trim()}
                        >
                            {isCancelling ? "Cancelando..." : "Confirmar Cancelamento"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Detalhes do Pedido #{selectedOrder?.id.slice(0, 8)}</SheetTitle>
                        <SheetDescription>
                            Criado em {selectedOrder && format(new Date(selectedOrder.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedOrder && (
                        <div className="py-6 space-y-6">
                            {/* Status and Table Info */}
                            <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-zinc-500">Mesa</p>
                                    <p className="font-bold text-lg">{selectedOrder.table?.number || "Balcão"}</p>
                                </div>
                                <div className="text-right">
                                    <Badge className="mb-1">{selectedOrder.status}</Badge>
                                    <p className="text-sm font-mono text-zinc-500">{selectedOrder.orderType.replace("_", " ")}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="font-bold mb-3 text-sm uppercase text-zinc-500">Itens do Pedido</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                                            <div>
                                                <p className="font-bold text-sm">
                                                    {item.quantity}x {getTranslatedValue(item.product.name, locale)}
                                                </p>
                                                {item.options && item.options.length > 0 && (
                                                    <div className="ml-2 mt-1 space-y-0.5">
                                                        {item.options.map((opt) => (
                                                            <p key={opt.id} className="text-xs text-zinc-500">
                                                                + {getTranslatedValue(opt.optionValue.name, locale)}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.notes && (
                                                    <p className="text-xs text-orange-600 mt-1 italic">Obs: {item.notes}</p>
                                                )}
                                            </div>
                                            <p className="font-mono text-sm">
                                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(Number(item.price) * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Summary */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(selectedOrder.total)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Button variant="outline" onClick={() => console.log("Imprimir")}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Imprimir
                                </Button>
                                {selectedOrder.status !== "CANCELLED" && selectedOrder.status !== "DELIVERED" && (
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, "READY");
                                            setSelectedOrder(null);
                                        }}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Marcar Pronto
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
