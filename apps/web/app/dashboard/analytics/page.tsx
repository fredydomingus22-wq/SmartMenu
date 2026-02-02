import { getAuthorizedClient } from "@/utils/auth-server";
import { redirect } from "next/navigation";
// No UI imports needed as they are in components
import {
    getKPIs,
    getSalesTrend,
    getProductPerformance,
    getPeakHours,
    getCustomerRanking,
    getTableRanking,
    getAdvancedMetrics
} from "../../actions/analytics";
import { getTenantProfile } from "../../actions/settings";
// getTranslatedValue moved to initialData handling if needed
import { headers } from "next/headers";

import { AnalyticsClient } from "./_components/analytics-client";

import { startOfDay, subDays, format } from "date-fns";

export default async function AnalyticsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const rangeType = (searchParams.rangeType as string) || "7d";
    let startDate = searchParams.startDate as string | undefined;
    let endDate = searchParams.endDate as string | undefined;

    // Default ranges if not custom
    if (rangeType !== "custom") {
        const end = new Date();
        let start;

        if (rangeType === "today") start = startOfDay(end);
        else if (rangeType === "30d") start = subDays(end, 29);
        else if (rangeType === "month") start = new Date(end.getFullYear(), end.getMonth(), 1);
        else start = subDays(end, 6); // default 7d

        startDate = format(start, "yyyy-MM-dd");
        endDate = format(end, "yyyy-MM-dd");
    }

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
        leastSellingRes,
        peakHoursRes,
        customerRankingRes,
        tableRankingRes,
        advancedMetricsRes
    ] = await Promise.all([
        getKPIs(startDate, endDate),
        getSalesTrend(startDate, endDate),
        getProductPerformance({ limit: 5, order: 'desc', startDate, endDate }),
        getProductPerformance({ limit: 5, order: 'asc', startDate, endDate }),
        getPeakHours(startDate, endDate),
        getCustomerRanking(),
        getTableRanking(),
        getAdvancedMetrics(startDate, endDate)
    ]);

    const initialData = {
        kpis: kpisRes.success ? kpisRes.data : null,
        trendData: trendRes.success ? trendRes.data : [],
        productRanking: productRankingRes.success ? productRankingRes.data : [],
        leastSelling: leastSellingRes.success ? leastSellingRes.data : [],
        peakHours: peakHoursRes.success ? peakHoursRes.data : [],
        customerRanking: customerRankingRes.success ? customerRankingRes.data : [],
        tableRanking: tableRankingRes.success ? tableRankingRes.data : [],
        advancedMetrics: advancedMetricsRes.success ? advancedMetricsRes.data : null,
    };

    return (
        <AnalyticsClient
            initialData={initialData}
            locale={locale}
            restaurantName={restaurantName}
        />
    );
}
