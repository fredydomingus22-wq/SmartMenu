"use client";

import { motion } from "framer-motion";
import { TrendingUp, QrCode, ClipboardList, ChevronRight, Zap } from "lucide-react";
import { Tooltip } from "@smart-menu/ui";
import Link from "next/link";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export function LandingFeatures() {
    return (
        <section id="features" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950/40 border-y">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-4">
                        <Zap className="h-3 w-3 fill-current" />
                        <span>EXPERIÊNCIA COMPLETA</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold">O Seu Restaurante em Piloto Automático</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                        Tecnologia invisível que organiza a sua operação e fideliza os seus clientes, sem complexidade.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {/* Feature 1: Vendas Sugestivas */}
                    <Link href="/features/upsell" className="block h-full no-underline">
                        <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-all hover:border-blue-500/50 group h-full relative overflow-hidden cursor-pointer active:scale-[0.98]">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                            <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold relative z-10 flex items-center gap-2">
                                <Tooltip content="Sistema de sugestão automática de produtos complementares para aumentar vendas">Vendas Sugestivas</Tooltip> <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10 font-medium">
                                O sistema sugere (&quot;Que tal um vinho?&quot;) no momento certo, aumentando o consumo de forma natural.
                                <span className="block mt-2 font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">+15% Ticket Médio</span>
                            </p>
                        </motion.div>
                    </Link>

                    {/* Feature 2: Club de Pontos */}
                    <Link href="/features/loyalty" className="block h-full no-underline">
                        <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-all hover:border-purple-500/50 group h-full relative overflow-hidden cursor-pointer active:scale-[0.98]">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                            <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors relative z-10">
                                <QrCode className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold relative z-10 flex items-center gap-2">
                                <Tooltip content="Programa de fidelização onde clientes acumulam pontos para trocar por recompensas">O Seu Clube de Pontos</Tooltip> <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10 font-medium">
                                Crie regras próprias (ex: 100 KZ = 1 ponto). Os clientes acumulam saldo e voltam para trocar por prémios.
                                <span className="block mt-2 font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[10px]">100% Configurável</span>
                            </p>
                        </motion.div>
                    </Link>

                    {/* Feature 3: Pedidos Multi-Canal */}
                    <Link href="/features/context-ordering" className="block h-full no-underline">
                        <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-all hover:border-orange-700/50 dark:hover:border-orange-400/50 group h-full relative overflow-hidden cursor-pointer active:scale-[0.98]">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-700/5 dark:bg-orange-400/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                            <div className="h-12 w-12 bg-orange-700/10 dark:bg-orange-400/10 rounded-2xl flex items-center justify-center text-orange-700 dark:text-orange-400 group-hover:bg-orange-700 dark:group-hover:bg-orange-400 group-hover:text-white transition-colors relative z-10">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold relative z-10 flex items-center gap-2">
                                <Tooltip content="Gestão unificada de pedidos através de diferentes canais de venda">Pedidos Multi-Canal</Tooltip> <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10 font-medium">
                                Gerencie pedidos de <strong>Dine-in, Takeaway e Delivery</strong> numa única plataforma centralizada.
                                <span className="block mt-2 font-black text-orange-700 dark:text-orange-400 uppercase tracking-wider text-[10px]">Gestão 360º</span>
                            </p>
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
