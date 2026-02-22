"use client";

import { Button, Tooltip, BRAND_COLORS } from "@smart-menu/ui";
import Link from "next/link";

export function LandingPricing() {
    return (
        <section id="pricing" className="py-12 md:py-16 px-6 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">Planos para todos os tamanhos</h2>
                    <p className="text-zinc-800 text-lg md:text-xl font-medium leading-relaxed">
                        Escolha a solução ideal para o seu negócio, desde o pequeno café até à grande cadeia de restaurantes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="relative p-8 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-6 hover:border-orange-500/20 transition-all group shadow-sm">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-950">Base</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tabular-nums text-zinc-950">11.990</span>
                                <span className="text-zinc-700 font-semibold text-sm">KZ/mês</span>
                            </div>
                            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                                Trial de 14 dias grátis
                            </div>
                            <p className="text-sm text-zinc-800 font-normal">Ideal para pequenos cafés e bistros.</p>
                        </div>
                        <ul className="space-y-4 text-sm font-normal">
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-800">Até 50 mesas</span></li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-800">Menu QR Interativo</span></li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-800">Carrinho de Pedidos</span></li>
                        </ul>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full rounded-lg font-bold h-11 transition-all group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 border-zinc-200 text-zinc-950" asChild>
                                <Link href="/login?plan=basic">Começar Teste Grátis</Link>
                            </Button>
                            <p className="text-[10px] text-center font-medium text-zinc-400 uppercase tracking-widest">
                                Sem Cartão de Crédito
                            </p>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative p-8 bg-white border-2 border-orange-500 rounded-2xl space-y-6 shadow-xl shadow-orange-500/5 scale-105 z-10 group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">Popular</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-orange-600">Avançado</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tabular-nums text-zinc-900">24.990</span>
                                <span className="text-zinc-500 font-semibold text-sm">KZ/mês</span>
                            </div>
                            <p className="text-sm text-zinc-500 font-normal">Para operações que precisam de KDS.</p>
                        </div>
                        <ul className="space-y-4 text-sm font-normal">
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-600">Até 150 mesas</span></li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <Tooltip content="Kitchen Display System - Sistema de exibição para cozinha que organiza pedidos automaticamente">
                                    <span className="border-b border-dotted border-zinc-400 text-zinc-600 cursor-help">Sistema KDS (Cozinha)</span>
                                </Tooltip>
                            </li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-600">Gestão de Estoque</span></li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <Tooltip content="Painéis visuais com métricas e dados para tomada de decisões">
                                    <span className="border-b border-dotted border-zinc-400 text-zinc-600 cursor-help">Dashboards Gerenciais</span>
                                </Tooltip>
                            </li>
                        </ul>
                        <Button className="w-full rounded-lg font-bold h-11 shadow-sm transition-all text-zinc-950 border-0" style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }} asChild>
                            <Link href="/login?plan=pro">Escolher Avançado</Link>
                        </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="relative p-8 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-6 hover:border-orange-500/20 transition-all group shadow-sm">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tabular-nums text-zinc-900">49.990</span>
                                <span className="text-zinc-500 font-semibold text-sm">KZ/mês</span>
                            </div>
                            <p className="text-sm text-zinc-500 font-normal">Todas as features + VIP Delivery Kit.</p>
                        </div>
                        <ul className="space-y-4 text-sm font-normal">
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-600">Mesas Ilimitadas</span></li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-600">Múltiplos Restaurantes</span></li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <Tooltip content="Análise de dados avançada usando inteligência artificial para insights preditivos">
                                    <span className="border-b border-dotted border-zinc-400 text-zinc-600 cursor-help">Analytics Avançado (AI)</span>
                                </Tooltip>
                            </li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> <span className="text-zinc-600">Suporte Dedicado 24/7</span></li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-lg font-bold h-11 transition-all border-zinc-200 text-zinc-950 hover:bg-zinc-950 hover:text-white" asChild>
                            <Link href="/contact">Falar com Vendas</Link>
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-zinc-400 italic font-medium">
                    * Preços indicativos em Kwanzas (KZ). Valores finais sujeitos à confirmação com a equipa comercial.
                </p>
            </div>
        </section>
    );
}
