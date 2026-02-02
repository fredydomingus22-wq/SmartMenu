"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@smart-menu/ui";
import { getTranslatedValue } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@smart-menu/ui";

import { ProductPerformance } from "../_types/analytics";

interface TopProductsListProps {
    data: ProductPerformance[];
    locale: string;
}

export function TopProductsList({ data, locale }: TopProductsListProps) {
    const [sortBy, setSortBy] = useState<"quantity" | "revenue">("quantity");

    const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy]);

    return (
        <div className="border rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Performance de Produtos</h3>
                <div className="flex gap-2">
                    <Button
                        variant={sortBy === "quantity" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("quantity")}
                        className="h-7 text-[10px]"
                    >
                        Volume
                    </Button>
                    <Button
                        variant={sortBy === "revenue" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("revenue")}
                        className="h-7 text-[10px]"
                    >
                        Receita
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto max-h-[400px]">
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-[10px] uppercase font-bold text-zinc-500">Item</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold text-right text-zinc-500">Qtd</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold text-right text-zinc-500">Receita</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.length > 0 ? (
                            sortedData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-xs font-medium truncate max-w-[140px]">
                                        {getTranslatedValue(item.name, locale)}
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-bold text-zinc-600 dark:text-zinc-400">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-bold text-zinc-600 dark:text-zinc-400">
                                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(item.revenue)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-xs text-zinc-500">Sem dados</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
