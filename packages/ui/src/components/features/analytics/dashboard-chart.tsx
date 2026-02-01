"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { cn } from "../../../lib/utils";

interface DashboardChartProps {
    title: string;
    data: any[];
    xKey: string;
    yKey: string;
    className?: string;
    variant?: "line" | "area" | "bar";
}

export function DashboardChart({
    title,
    data,
    xKey,
    yKey,
    className,
    variant = "area",
}: DashboardChartProps) {
    return (
        <Card className={cn("col-span-1 border-zinc-100 dark:border-zinc-800", className)}>
            <CardHeader>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{title}</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {variant === "area" ? (
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis
                                    dataKey={xKey}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e4e4e7",
                                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                    itemStyle={{ color: "#f97316" }}
                                    cursor={{ stroke: "#f97316", strokeWidth: 1, strokeDasharray: "4 4" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={yKey}
                                    stroke="#f97316"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        ) : variant === "line" ? (
                            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis
                                    dataKey={xKey}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e4e4e7",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                    itemStyle={{ color: "#f97316" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={yKey}
                                    stroke="#f97316"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        ) : (
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis
                                    dataKey={xKey}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e4e4e7",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                    }}
                                    itemStyle={{ color: "#f97316" }}
                                />
                                <Bar
                                    dataKey={yKey}
                                    fill="#f97316"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
