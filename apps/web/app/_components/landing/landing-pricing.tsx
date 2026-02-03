"use client";

import { Button, Tooltip } from "@smart-menu/ui";
import Link from "next/link";
import Image from "next/image";

export function LandingPricing() {
    return (
        <section id="pricing" className="py-16 md:py-20 px-6 relative overflow-hidden">
            {/* Decorative Banner Background */}
            <div className="absolute inset-0 -z-10 opacity-5">
                <Image
                    src="/assets/marketing/banner-promo.png"
                    alt="Background Pattern"
                    fill
                    className="object-cover"
                    loading="lazy"
                />
            </div>

            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl md:text-4xl font-bold">Planos para todos os tamanhos</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                        Escolha a solução ideal para o seu negócio, desde o pequeno café até à grande cadeia de restaurantes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="relative p-8 bg-background border rounded-2xl space-y-6 hover:border-primary/20 transition-all group">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Base</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tabular-nums">50.000</span>
                                <span className="text-muted-foreground font-semibold text-sm">KZ/mês</span>
                            </div>
                            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                                Trial de 14 dias grátis
                            </div>
                            <p className="text-sm text-zinc-500 font-normal">Ideal para pequenos cafés e bistros.</p>
                        </div>
                        <ul className="space-y-4 text-sm font-normal">
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Até 50 mesas</span></li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Menu QR Interativo</span></li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Carrinho de Pedidos</span></li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-lg font-bold h-11 transition-all" asChild>
                            <Link href="/login?plan=basic">Começar agora</Link>
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative p-8 bg-background border-2 border-primary rounded-2xl space-y-6 shadow-xl shadow-primary/5 scale-105 z-10 group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">Popular</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-primary">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tabular-nums text-primary">150.000</span>
                                <span className="text-muted-foreground font-semibold text-sm">KZ/mês</span>
                            </div>
                            <p className="text-sm text-zinc-500 font-normal">Para operações que precisam de KDS.</p>
                        </div>
                        <ul className="space-y-4 text-sm font-normal">
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Até 150 mesas</span></li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <Tooltip content="Kitchen Display System - Sistema de exibição para cozinha que organiza pedidos automaticamente">
                                    <span className="border-b border-dotted border-zinc-400">Sistema KDS (Cozinha)</span>
                                </Tooltip>
                            </li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Gestão de Estoque</span></li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <Tooltip content="Painéis visuais com métricas e dados para tomada de decisões">
                                    <span className="border-b border-dotted border-zinc-400">Dashboards Gerenciais</span>
                                </Tooltip>
                            </li>
                        </ul>
                        <Button className="w-full rounded-lg font-bold h-11 shadow-sm transition-all" asChild>
                            <Link href="/login?plan=pro">Escolher Pro</Link>
                        </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="relative p-8 bg-background border rounded-2xl space-y-6 hover:border-primary/20 transition-all group">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Enterprise</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tabular-nums">300.000</span>
                                <span className="text-muted-foreground font-semibold text-sm">KZ/mês</span>
                            </div>
                            <p className="text-sm text-zinc-500 font-normal">Para cadeias e franquias.</p>
                        </div>
                        <ul className="space-y-4 text-sm font-normal">
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Mesas Ilimitadas</span></li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Múltiplos Restaurantes</span></li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <Tooltip content="Análise de dados avançada usando inteligência artificial para insights preditivos">
                                    <span className="border-b border-dotted border-zinc-400">Analytics Avançado (AI)</span>
                                </Tooltip>
                            </li>
                            <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> <span>Suporte Dedicado 24/7</span></li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-lg font-bold h-11 transition-all" asChild>
                            <Link href="/contact">Falar com Vendas</Link>
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-muted-foreground italic font-medium">
                    * Preços indicativos em Kwanzas (KZ). Valores finais sujeitos à confirmação com a equipa comercial.
                </p>
            </div>
        </section>
    );
}
