"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Input
} from "@smart-menu/ui";
import { Filter } from "lucide-react";

export function DateRangePicker() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial values from URL or defaults
    const [rangeType, setRangeType] = useState(searchParams.get("rangeType") || "7d");
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

    const handleRangeChange = (value: string) => {
        setRangeType(value);
        if (value !== "custom") {
            updateURL(value, "", "");
        }
    };

    const updateURL = (type: string, start: string, end: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("rangeType", type);

        if (type === "custom") {
            if (start) params.set("startDate", start);
            else params.delete("startDate");
            if (end) params.set("endDate", end);
            else params.delete("endDate");
        } else {
            params.delete("startDate");
            params.delete("endDate");
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleCustomSubmit = () => {
        updateURL("custom", startDate, endDate);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 px-3 text-zinc-500">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Período</span>
            </div>

            <Select value={rangeType} onValueChange={handleRangeChange}>
                <SelectTrigger className="w-[180px] h-9 border-none bg-zinc-50 dark:bg-zinc-800 font-medium text-xs">
                    <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
            </Select>

            {rangeType === "custom" && (
                <div className="flex flex-col sm:flex-row items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            className="h-9 w-[140px] text-xs font-medium"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="text-zinc-400 text-xs">até</span>
                        <Input
                            type="date"
                            className="h-9 w-[140px] text-xs font-medium"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <Button
                        size="sm"
                        onClick={handleCustomSubmit}
                        className="h-9 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-lg"
                    >
                        Filtrar
                    </Button>
                </div>
            )}
        </div>
    );
}
