"use client";

import { Badge, Tooltip } from "@smart-menu/ui";
import { TrendingUp, Users, Target, Zap, ChefHat, Puzzle, Ghost, Trophy, Info } from "lucide-react";
import { AdvancedMetrics } from "../_types/analytics";
import { getTranslatedValue } from "@/lib/utils";

interface AdvancedInsightsProps {
    data: AdvancedMetrics | null;
    locale: string;
}

// Simple internal Progress component as it's missing in @smart-menu/ui
const Progress = ({ value, color = "blue" }: { value: number; color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: "bg-blue-600",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500"
    };
    const activeColor = colorMap[color] || "bg-zinc-600";

    return (
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
                className={`h-full transition-all duration-500 ease-out ${activeColor}`}
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    );
};

export function AdvancedInsights({ data, locale }: AdvancedInsightsProps) {

    if (!data) return null;

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'STAR': return {
                icon: Trophy,
                color: 'text-amber-500',
                bg: 'bg-amber-50/50 dark:bg-amber-900/10',
                label: 'Estrela',
                desc: 'Alta Popularidade & Alta Rentabilidade'
            };
            case 'WORKHORSE': return {
                icon: ChefHat,
                color: 'text-blue-500',
                bg: 'bg-blue-50/50 dark:bg-blue-900/10',
                label: 'Essencial',
                desc: 'Alta Popularidade & Baixa Margem'
            };
            case 'PUZZLE': return {
                icon: Puzzle,
                color: 'text-purple-500',
                bg: 'bg-purple-50/50 dark:bg-purple-900/10',
                label: 'Oportunidade',
                desc: 'Baixa Popularidade & Alta Rentabilidade'
            };
            case 'DOG': return {
                icon: Ghost,
                color: 'text-zinc-400',
                bg: 'bg-zinc-50/50 dark:bg-zinc-900/10',
                label: 'Revisar',
                desc: 'Baixa Popularidade & Baixa Rentabilidade'
            };
            default: return {
                icon: Target,
                color: 'text-zinc-500',
                bg: 'bg-zinc-100',
                label: 'Análise',
                desc: 'Dados insuficientes para classificação'
            };
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Retention & ROI Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Retention Card */}
                <div className="border rounded-xl bg-white dark:bg-zinc-950 p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <Users className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 font-inter">Retenção de Clientes</h4>
                        </div>
                        <Tooltip content="Percentual de clientes que realizaram mais de um pedido no período selecionado.">
                            <Info className="h-4 w-4 text-zinc-400 hover:text-zinc-600 transition-colors cursor-help" />
                        </Tooltip>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                                    {data.retention.rate.toFixed(1)}%
                                </span>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Taxa de Fidelidade</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs sm:text-sm font-bold">{data.retention.returning} / {data.retention.total}</span>
                                <p className="text-[9px] text-muted-foreground">Clientes recorrentes</p>
                            </div>
                        </div>
                        <Progress value={data.retention.rate} color="blue" />
                    </div>
                </div>

                {/* Performance por Segmento */}
                <div className="border rounded-xl bg-white dark:bg-zinc-950 p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 font-inter">Performance por Segmento</h4>
                        </div>
                        <Tooltip content="Comparativo de receita entre clientes fidelizados (Membros) e novos visitantes.">
                            <Info className="h-4 w-4 text-zinc-400 hover:text-zinc-600 transition-colors cursor-help" />
                        </Tooltip>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                Membros BI
                            </span>
                            <span>Novos Visitantes</span>
                        </div>
                        <div className="flex h-8 sm:h-10 w-full rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 p-0.5">
                            <div
                                className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-white transition-all rounded-l-sm"
                                style={{ width: `${(data.loyaltyROI.memberRevenue / (data.loyaltyROI.memberRevenue + data.loyaltyROI.nonMemberRevenue)) * 100}%` }}
                            >
                                {((data.loyaltyROI.memberRevenue / (data.loyaltyROI.memberRevenue + data.loyaltyROI.nonMemberRevenue)) * 100).toFixed(0)}%
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-900 h-full flex-1 flex items-center justify-center text-[10px] font-bold text-zinc-400 rounded-r-sm ml-0.5">
                                {((data.loyaltyROI.nonMemberRevenue / (data.loyaltyROI.memberRevenue + data.loyaltyROI.nonMemberRevenue)) * 100).toFixed(0)}%
                            </div>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground mt-1 font-medium">
                            Membros Fidelizados geraram <span className="text-emerald-600 font-bold">AOA {data.loyaltyROI.memberRevenue.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Menu Engineering (Performance de Mix) */}
            <div className="border rounded-xl bg-white dark:bg-zinc-950 p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 font-inter">Menu Engineering (Performance de Mix)</h4>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Estratégia baseada em Popularidade e Rentabilidade Operacional.</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="rounded-full px-3 h-6 text-[9px] font-black tracking-widest uppercase border-amber-200 text-amber-700 bg-amber-50 self-start sm:self-center">BI Dashboard v2</Badge>
                </div>

                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    {data.menuMatrix.slice(0, 8).map((item, idx) => {
                        const style = getCategoryStyles(item.category);
                        const Icon = style.icon;
                        return (
                            <Tooltip key={idx} content={style.desc}>
                                <div className={`p-3 sm:p-4 rounded-xl border ${style.bg} dark:bg-zinc-900/40 transition-all hover:scale-[1.02] cursor-default border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 group`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`p-1.5 rounded-lg ${style.bg} border border-white/50 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`h-4 w-4 ${style.color}`} />
                                        </div>
                                        <Badge variant="secondary" className="text-[8px] font-black h-4 px-1 leading-none bg-white/80 dark:bg-zinc-800">{style.label}</Badge>
                                    </div>
                                    <h5 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 mb-1">
                                        {getTranslatedValue(item.name, locale)}
                                    </h5>
                                    <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold uppercase">
                                        <span>{item.quantity} un</span>
                                        <span className="text-zinc-400">AOA {item.revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] text-muted-foreground border-t pt-6">
                    <div className="flex items-start gap-2 group">
                        <Trophy className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="leading-relaxed"><span className="font-black text-amber-600 dark:text-amber-500 uppercase tracking-tighter">Estrelas:</span> Alta performance global. Peças fundamentais do ticket médio.</p>
                    </div>
                    <div className="flex items-start gap-2 group">
                        <ChefHat className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <p className="leading-relaxed"><span className="font-black text-blue-600 dark:text-blue-500 uppercase tracking-tighter">Essenciais:</span> Itens de alto giro com margem reduzida. Otimize processos.</p>
                    </div>
                    <div className="flex items-start gap-2 group">
                        <Puzzle className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                        <p className="leading-relaxed"><span className="font-black text-purple-600 dark:text-purple-500 uppercase tracking-tighter">Oportunidade:</span> Margem alta, baixa procura. Melhore a exposição e vendas.</p>
                    </div>
                    <div className="flex items-start gap-2 group text-zinc-400">
                        <Ghost className="h-4 w-4 text-zinc-300 mt-0.5 shrink-0" />
                        <p className="leading-relaxed"><span className="font-black text-zinc-500 uppercase tracking-tighter">Revisar:</span> Desempenho abaixo do ideal. Analise substituição ou retirada.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
