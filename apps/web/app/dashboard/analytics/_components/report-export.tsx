"use client";

import { Button } from "@smart-menu/ui";
import { FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { AnalyticsKPIs, ProductPerformance, CustomerRanking } from "../_types/analytics";

interface ReportExportProps {
    data: {
        kpis: AnalyticsKPIs | null;
        products: ProductPerformance[];
        customers: CustomerRanking[];
    };
    filename?: string;
}

export function ReportExport({ data, filename = "smartmenu-report" }: ReportExportProps) {
    const { t } = useTranslation();

    const exportToCSV = () => {
        try {
            const sections = [];

            // 1. KPIs
            sections.push("RESUMO GERAL");
            sections.push(`Vendas Totais,${data.kpis?.sales?.value || 0}`);
            sections.push(`Pedidos,${data.kpis?.orders?.value || 0}`);
            sections.push(`Ticket Médio,${data.kpis?.avgTicket?.value || 0}`);
            sections.push("");

            // 2. Customers
            sections.push("TOP CLIENTES");
            sections.push("ID,Nome,Pedidos,Total Gasto,Pontos");
            data.customers.forEach(c => {
                sections.push(`${c.id},${c.name},${c.orders},${c.totalSpent},${c.points}`);
            });
            sections.push("");

            // 3. Products
            sections.push("PERFORMANCE DE PRODUTOS");
            sections.push("ID,Nome,Quantidade,Receita");
            data.products.forEach(p => {
                const name = typeof p.name === 'string' ? p.name : p.name?.pt || p.name?.en || 'N/A';
                sections.push(`${p.id},${name},${p.quantity},${p.revenue}`);
            });

            const csvContent = "data:text/csv;charset=utf-8," + sections.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(t("dashboard.analytics.reports.success_csv"));
        } catch (error) {
            console.error("Export error:", error);
            toast.error(t("dashboard.analytics.reports.error_csv"));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="h-9 gap-2 text-xs font-bold border-zinc-200 dark:border-zinc-800"
            >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                {t("dashboard.analytics.reports.export_csv")}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-9 gap-2 text-xs font-bold border-zinc-200 dark:border-zinc-800"
            >
                <Printer className="h-4 w-4 text-blue-600" />
                {t("dashboard.analytics.reports.print_pdf")}
            </Button>
        </div>
    );
}
