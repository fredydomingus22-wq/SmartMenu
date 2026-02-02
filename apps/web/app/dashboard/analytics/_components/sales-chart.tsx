"use client";

import { DashboardChart } from "@smart-menu/ui";

import { SalesTrendData } from "../_types/analytics";

interface SalesChartProps {
    data: SalesTrendData[];
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <DashboardChart
            title="Tendência de Vendas"
            data={data}
            xKey="date"
            yKey="sales"
            variant="area"
            className="shadow-sm h-[350px]"
        />
    );
}
