import { getAuthorizedClient } from "@/utils/auth-server";
import { redirect } from "next/navigation";
import {
    KPICard,
    DashboardChart,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@smart-menu/ui";
import {
    getKPIs,
    getSalesTrend,
    getProductRanking,
    getPeakHours,
    getCustomerRanking,
    getTableRanking
} from "../../actions/analytics";
import { getTenantProfile } from "../../actions/settings";
import { getTranslatedValue } from "@/lib/utils";
import { headers } from "next/headers";

export default async function AnalyticsPage() {
    const headersList = await headers();
    const locale = headersList.get("x-next-intl-locale") || "pt";
    const { user, error } = await getAuthorizedClient();

    if (error || !user) {
        return redirect("/login");
    }

    const tenantProfile = await getTenantProfile() as { id: string, name: string } | null;
    const restaurantName = tenantProfile?.name || "O Meu Restaurante";

    // Parallel data fetching for performance
    const [
        kpisRes,
        trendRes,
        productRankingRes,
        peakHoursRes,
        customerRankingRes,
        tableRankingRes
    ] = await Promise.all([
        getKPIs(),
        getSalesTrend(),
        getProductRanking(),
        getPeakHours(),
        getCustomerRanking(),
        getTableRanking()
    ]);

    const kpis = kpisRes.success ? kpisRes.data : null;
    const trendData = trendRes.success ? trendRes.data : [];
    const productRankingData = productRankingRes.success ? productRankingRes.data : [];
    const peakHoursData = peakHoursRes.success ? peakHoursRes.data : [];
    const customerRankingData = customerRankingRes.success ? customerRankingRes.data : [];
    const tableRankingData = tableRankingRes.success ? tableRankingRes.data : [];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Analytics {restaurantName}
                </h2>
                <p className="text-muted-foreground font-medium">
                    Acompanhe a performance detalhada do seu negócio.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <KPICard
                    title="Vendas Totais"
                    value={kpis?.sales?.value || 0}
                    trend={kpis?.sales?.trend}
                    prefix="AOA"
                    className="shadow-sm"
                />
                <KPICard
                    title="Volume de Pedidos"
                    value={kpis?.orders?.value || 0}
                    trend={kpis?.orders?.trend}
                    suffix="pedidos"
                    className="shadow-sm"
                />
                <KPICard
                    title="Ticket Médio"
                    value={kpis?.avgTicket?.value || 0}
                    trend={kpis?.avgTicket?.trend}
                    prefix="AOA"
                    className="shadow-sm"
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardChart
                    title="Tendência de Vendas (Últimos 7 dias)"
                    data={trendData}
                    xKey="date"
                    yKey="sales"
                    variant="area"
                    className="shadow-sm h-full"
                />
                <DashboardChart
                    title="Horários de Pico (Últimos 30 dias)"
                    data={peakHoursData}
                    xKey="hour"
                    yKey="count"
                    variant="bar"
                    className="shadow-sm h-full"
                />
            </div>

            {/* Rankings Section */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Product Ranking */}
                <div className="border rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Top Produtos</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase font-bold text-zinc-500">Item</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right text-zinc-500">Qtd</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right text-zinc-500">Receita</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productRankingData.length > 0 ? (
                                    productRankingData.map((item: { id: string; name: string; quantity: number; revenue: number }) => (
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

                {/* Customer Ranking */}
                <div className="border rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Top Clientes</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase font-bold text-zinc-500">Cliente</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right text-zinc-500">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customerRankingData.length > 0 ? (
                                    customerRankingData.map((item: { id: string; name: string; orders: number; totalSpent: number }) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs font-medium truncate max-w-[140px]">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-xs text-right font-bold text-zinc-600 dark:text-zinc-400">
                                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(item.totalSpent)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center text-xs text-zinc-500">Sem dados</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Table Ranking */}
                <div className="border rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Mesas Mais Rentáveis</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase font-bold text-zinc-500">Mesa</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right text-zinc-500">Receita</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableRankingData.length > 0 ? (
                                    tableRankingData.map((item: { id: string; number: number; orders: number; revenue: number }) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs font-medium">
                                                Mesa {item.number}
                                            </TableCell>
                                            <TableCell className="text-xs text-right font-bold text-zinc-600 dark:text-zinc-400">
                                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(item.revenue)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center text-xs text-zinc-500">Sem dados</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </div>
    );
}
