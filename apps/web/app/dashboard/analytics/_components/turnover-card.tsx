"use client";

import { KPICard } from "@smart-menu/ui";

import { useTranslation } from "@/hooks/use-translation";

interface TurnoverCardProps {
    value: number;
    trend?: number;
}

export function TurnoverCard({ value, trend }: TurnoverCardProps) {
    const { t } = useTranslation();
    // value is expected in minutes
    const formattedValue = value > 60
        ? `${Math.floor(value / 60)}h ${Math.round(value % 60)}m`
        : `${Math.round(value)}m`;

    return (
        <KPICard
            title={t("dashboard.analytics.kpis.turnover")}
            value={formattedValue}
            trend={trend}
            className="shadow-sm"
        />
    );
}
