"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@smart-menu/ui";
import { useTranslation } from "@/hooks/use-translation";
import { KPICard } from "@smart-menu/ui";
// import { SalesChart } from "./sales-chart"; // Relplaced by SalesAnalysisSection
import { SalesAnalysisSection } from "./sales-analysis-section";
import { TurnoverCard } from "./turnover-card";
import { TopProductsList } from "./product-performance-list";
import { CustomerSearch } from "./customer-search";
import { CustomerProfileView } from "./customer-profile-view";
import { getCustomerProfile } from "@/app/actions/analytics";
import { LeastSellingList } from "./least-selling-list";
import { DateRangePicker } from "./date-range-picker";
import { CustomerList } from "./customer-list";
import { ReportExport } from "./report-export";
import { AdvancedInsights } from "./advanced-insights";
import {
    Users,
    LayoutDashboard,
    UserSearch,
    Package,
    BarChart3,
    TrendingUp,
    Loader2
} from "lucide-react";
import {
    AnalyticsKPIs,
    SalesTrendData,
    ProductPerformance,
    PeakHourData,
    CustomerRanking,
    TableRanking,
    CustomerProfileData,
    AdvancedMetrics
} from "../_types/analytics";

interface AnalyticsClientProps {
    initialData: {
        kpis: AnalyticsKPIs | null;
        trendData: SalesTrendData[];
        productRanking: ProductPerformance[];
        leastSelling: ProductPerformance[];
        peakHours: PeakHourData[];
        customerRanking: CustomerRanking[];
        tableRanking: TableRanking[];
        advancedMetrics: AdvancedMetrics | null;
    };
    locale: string;
    restaurantName: string;
}

export function AnalyticsClient({ initialData, locale }: AnalyticsClientProps) {
    const { t } = useTranslation();
    const [, setSelectedCustomerId] = useState<string | null>(null);
    const [customerData, setCustomerData] = useState<CustomerProfileData | null>(null);
    const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const handleSelectCustomer = async (id: string) => {
        setSelectedCustomerId(id);
        setIsLoadingCustomer(true);
        setActiveTab("customer");
        const res = await getCustomerProfile(id);
        if (res.success) {
            setCustomerData(res.data);
        }
        setIsLoadingCustomer(false);
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:h-8 text-blue-600" />
                        {t("dashboard.analytics.title")}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                        {t("dashboard.analytics.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <ReportExport
                        data={{
                            kpis: initialData.kpis,
                            products: initialData.productRanking,
                            customers: initialData.customerRanking
                        }}
                    />
                    <DateRangePicker />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="overflow-x-auto pb-1 scrollbar-none">
                    <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-max sm:w-auto">
                        <TabsTrigger value="overview" className="rounded-lg gap-2 text-xs sm:text-sm px-3 sm:px-4">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            {t("dashboard.analytics.tabs.overview")}
                        </TabsTrigger>
                        <TabsTrigger value="products" className="rounded-lg gap-2 text-xs sm:text-sm px-3 sm:px-4">
                            <Package className="h-3.5 w-3.5" />
                            {t("dashboard.analytics.tabs.products")}
                        </TabsTrigger>
                        <TabsTrigger value="customers" className="rounded-lg gap-2 text-xs sm:text-sm px-3 sm:px-4">
                            <Users className="h-3.5 w-3.5" />
                            {t("dashboard.analytics.tabs.customers")}
                        </TabsTrigger>
                        <TabsTrigger value="insights" className="rounded-lg gap-2 text-xs sm:text-sm px-3 sm:px-4">
                            <BarChart3 className="h-3.5 w-3.5" />
                            {t("dashboard.analytics.tabs.insights")}
                        </TabsTrigger>
                        <TabsTrigger value="customer" className="rounded-lg gap-2 text-xs sm:text-sm px-3 sm:px-4">
                            <UserSearch className="h-3.5 w-3.5" />
                            {t("dashboard.analytics.tabs.profile")}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* --- TAB: GERAL --- */}
                <TabsContent value="overview" className="space-y-8 focus-visible:outline-none">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <KPICard
                            title={t("dashboard.analytics.kpis.sales")}
                            value={initialData.kpis?.sales?.value || 0}
                            trend={initialData.kpis?.sales?.trend}
                            prefix="AOA"
                            className="shadow-sm border-zinc-100 dark:border-zinc-800"
                        />
                        <KPICard
                            title={t("dashboard.analytics.kpis.orders")}
                            value={initialData.kpis?.orders?.value || 0}
                            trend={initialData.kpis?.orders?.trend}
                            suffix={t("dashboard.analytics.kpis.orders_suffix")}
                            className="shadow-sm border-zinc-100 dark:border-zinc-800"
                        />
                        <KPICard
                            title={t("dashboard.analytics.kpis.avg_ticket")}
                            value={initialData.kpis?.avgTicket?.value || 0}
                            trend={initialData.kpis?.avgTicket?.trend}
                            prefix="AOA"
                            className="shadow-sm border-zinc-100 dark:border-zinc-800"
                        />
                        <TurnoverCard
                            value={initialData.kpis?.turnover?.avgMinutes || 0}
                            trend={0}
                        />
                    </div>

                    <div className="grid gap-6">
                        <SalesAnalysisSection
                            initialData={initialData.trendData}
                            locale={locale}
                        />
                    </div>
                </TabsContent>

                {/* --- TAB: PRODUTOS --- */}
                <TabsContent value="products" className="space-y-6 focus-visible:outline-none">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <TopProductsList data={initialData.productRanking} locale={locale} />
                        <LeastSellingList data={initialData.leastSelling} locale={locale} />
                    </div>
                </TabsContent>

                {/* --- TAB: CLIENTES --- */}
                <TabsContent value="customers" className="space-y-6 focus-visible:outline-none">
                    <CustomerList
                        data={initialData.customerRanking}
                        onSelectCustomer={handleSelectCustomer}
                        locale={locale}
                    />
                </TabsContent>

                {/* --- TAB: INSIGHTS --- */}
                <TabsContent value="insights" className="space-y-6 focus-visible:outline-none">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 border rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col p-6">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-4">Horários de Pico de Operação</h3>
                            <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
                                <div className="w-full h-[300px] flex items-end gap-1 px-2">
                                    {initialData.peakHours.map((h: PeakHourData, i: number) => (
                                        <div
                                            key={i}
                                            className="bg-blue-500/80 rounded-t-sm flex-1 transition-all hover:bg-blue-600 cursor-help"
                                            style={{ height: `${(h.count / Math.max(...initialData.peakHours.map((x: PeakHourData) => x.count))) * 100}%` }}
                                            title={`${h.hour}:00 - ${h.count} pedidos`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 px-1 text-[10px] text-zinc-400 font-bold uppercase">
                                <span>00:00</span>
                                <span>12:00</span>
                                <span>23:00</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="border rounded-xl bg-white dark:bg-zinc-950 shadow-sm p-6">
                                <h3 className="text-sm font-bold mb-4">Busca de Cliente</h3>
                                <CustomerSearch onSelectCustomer={handleSelectCustomer} />
                            </div>
                        </div>
                    </div>

                    {/* Advanced BI Content */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6 font-inter flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Advanced Business Intelligence
                        </h3>
                        <AdvancedInsights data={initialData.advancedMetrics} locale={locale} />
                    </div>
                </TabsContent>

                {/* --- TAB: PERFIL --- */}
                <TabsContent value="customer" className="focus-visible:outline-none">
                    {isLoadingCustomer ? (
                        <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-zinc-400">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-sm font-medium">Carregando perfil detalhado...</p>
                        </div>
                    ) : customerData ? (
                        <CustomerProfileView data={customerData} locale={locale} />
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-zinc-400 border-2 border-dashed rounded-3xl">
                            <UserSearch className="h-12 w-12 opacity-20" />
                            <div className="text-center">
                                <p className="font-bold text-zinc-500">Nenhum cliente selecionado</p>
                                <p className="text-xs">Use a aba de Visão Geral ou pesquise acima.</p>
                            </div>
                            <div className="w-full max-w-md px-10">
                                <CustomerSearch onSelectCustomer={handleSelectCustomer} />
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
