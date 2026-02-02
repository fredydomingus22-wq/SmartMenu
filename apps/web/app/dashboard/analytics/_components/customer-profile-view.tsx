"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@smart-menu/ui";
import {
    Users,
    TrendingUp,
    ShoppingBag,
    Star,
    Clock,
    Zap
} from "lucide-react";
import { getTranslatedValue } from "@/lib/utils";

import { CustomerProfileData } from "../_types/analytics";

interface CustomerProfileProps {
    data: CustomerProfileData;
    locale: string;
}

export function CustomerProfileView({ data, locale }: CustomerProfileProps) {
    const { profile, stats, recentOrders } = data;

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Users className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                            {getTranslatedValue(profile.name, locale)}
                        </h3>
                        <p className="text-sm text-zinc-500 font-medium">{profile.email}</p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                                {profile.pointsBalance} Pontos de Fidelidade
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Total Gasto</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(stats.totalSpent)}
                        </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Visitas</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">{stats.visitCount}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Ticket Médio</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(stats.avgTicket)}
                        </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Pico (Hora)</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">{stats.peakHour}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Insights Section */}
                <Card className="shadow-sm border-zinc-100 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            Preferências & Fidelidade
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="text-xs font-bold text-orange-900 dark:text-orange-400">Produto Favorito</p>
                                    <p className="text-sm font-black text-orange-950 dark:text-orange-100">
                                        {stats.favoriteProduct ? getTranslatedValue(stats.favoriteProduct, locale) : "Nenhuma compra registrada"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="h-4 w-4 text-green-600" />
                                    <p className="text-xs font-bold text-green-900 dark:text-green-400">Pontos Ganhos</p>
                                </div>
                                <p className="text-xl font-black text-green-950 dark:text-green-100">{stats.loyaltyPointsEarned}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-purple-600" />
                                    <p className="text-xs font-bold text-purple-900 dark:text-purple-400">Desconto Acumulado</p>
                                </div>
                                <p className="text-xl font-black text-purple-950 dark:text-purple-100">
                                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(stats.loyaltyDiscountsValue)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent History Table */}
                <Card className="shadow-sm border-zinc-100 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-zinc-500" />
                            Histórico Recente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow>
                                    <TableHead className="text-[10px] uppercase font-bold px-4">Data</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right px-4">Total</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right px-4">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="text-xs font-medium px-4">
                                                {new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit' })}
                                            </TableCell>
                                            <TableCell className="text-xs text-right font-bold px-4">
                                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(order.total)}
                                            </TableCell>
                                            <TableCell className="text-xs text-right px-4">
                                                <Badge variant="outline" className="text-[10px] py-0 h-5">
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-xs text-zinc-500">Sem histórico</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
