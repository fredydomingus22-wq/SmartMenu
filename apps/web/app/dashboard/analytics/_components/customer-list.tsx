"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Checkbox,
    Button,
    Badge,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@smart-menu/ui";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { User, MessageSquare, Coins } from "lucide-react";
import { CustomerRanking } from "../_types/analytics";
import { MarketingCampaignDialog } from "./marketing-campaign-dialog";
import { getTranslatedValue } from "@/lib/utils";

interface CustomerListProps {
    data: CustomerRanking[];
    onSelectCustomer: (id: string) => void;
    onSelectionChange?: (ids: string[]) => void;
    locale: string;
}

export function CustomerList({ data, onSelectCustomer, onSelectionChange, locale }: CustomerListProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>("totalSpent");
    const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);

    const toggleAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
            onSelectionChange?.([]);
        } else {
            const allIds = data.map(c => c.id);
            setSelectedIds(allIds);
            onSelectionChange?.(allIds);
        }
    };

    const toggleOne = (id: string) => {
        const newSelection = selectedIds.includes(id)
            ? selectedIds.filter(i => i !== id)
            : [...selectedIds, id];
        setSelectedIds(newSelection);
        onSelectionChange?.(newSelection);
    };

    return (
        <Card className="shadow-sm border-zinc-100 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Base de Clientes BI
                    </CardTitle>
                    <p className="text-[10px] text-zinc-400 font-medium">
                        {data.length} clientes identificados no período.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <Button
                            size="sm"
                            variant="default"
                            className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-white animate-in zoom-in-95 duration-200"
                            onClick={() => setIsCampaignDialogOpen(true)}
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Engajar ({selectedIds.length})
                        </Button>
                    )}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[160px] h-8 text-[10px] font-bold uppercase tracking-tight">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="totalSpent">Total Gasto</SelectItem>
                            <SelectItem value="orders">Frequência</SelectItem>
                            <SelectItem value="lastVisit">Recência</SelectItem>
                            <SelectItem value="points">Saldo Pontos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/30 dark:bg-zinc-900/30 hover:bg-transparent">
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onCheckedChange={toggleAll}
                                />
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cliente</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Total Gasto</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Pedidos</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Pontos</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right w-[120px]">Última Visita</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((customer) => (
                            <TableRow
                                key={customer.id}
                                className="group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                            >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedIds.includes(customer.id)}
                                        onCheckedChange={() => toggleOne(customer.id)}
                                    />
                                </TableCell>
                                <TableCell onClick={() => onSelectCustomer(customer.id)}>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                                                {getTranslatedValue(customer.name, locale)}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-medium">ID: {customer.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs font-bold text-zinc-900 dark:text-zinc-50" onClick={() => onSelectCustomer(customer.id)}>
                                    AOA {customer.totalSpent.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right" onClick={() => onSelectCustomer(customer.id)}>
                                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 dark:border-zinc-800">
                                        {customer.orders}x
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right" onClick={() => onSelectCustomer(customer.id)}>
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-amber-600">
                                        <Coins className="h-3 w-3" />
                                        {customer.points || 0}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-[10px] text-zinc-500 font-medium" onClick={() => onSelectCustomer(customer.id)}>
                                    {customer.lastVisit ? format(new Date(customer.lastVisit), "dd MMM yyyy", { locale: pt }) : "N/A"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <MarketingCampaignDialog
                isOpen={isCampaignDialogOpen}
                onClose={() => setIsCampaignDialogOpen(false)}
                selectedCustomerIds={selectedIds}
            />
        </Card>
    );
}
