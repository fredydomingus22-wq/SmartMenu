import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { cn } from "../../../lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    previousValue?: string | number;
    trend?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export function KPICard({
    title,
    value,
    trend,
    suffix = "",
    prefix = "",
    className,
}: KPICardProps) {
    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;

    return (
        <Card className={cn("overflow-hidden border-zinc-100 dark:border-zinc-800", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-1">
                    {prefix && <span className="text-sm font-bold text-zinc-400">{prefix}</span>}
                    <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    {suffix && <span className="text-sm font-bold text-zinc-400">{suffix}</span>}
                </div>

                {trend !== undefined && (
                    <div className="mt-1 flex items-center gap-1">
                        <div
                            className={cn(
                                "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                isPositive && "text-green-600 bg-green-50 dark:bg-green-900/20",
                                isNegative && "text-red-600 bg-red-50 dark:bg-red-900/20",
                                !isPositive && !isNegative && "text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20"
                            )}
                        >
                            {isPositive && <TrendingUp className="h-2.5 w-2.5" />}
                            {isNegative && <TrendingDown className="h-2.5 w-2.5" />}
                            {!isPositive && !isNegative && <Minus className="h-2.5 w-2.5" />}
                            {Math.abs(trend).toFixed(1)}%
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400">vs ontem</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
