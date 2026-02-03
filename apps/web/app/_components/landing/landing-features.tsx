"use client";

import { motion } from "framer-motion";
import { TrendingUp, QrCode, ClipboardList, ChevronRight, Zap, BarChart3 } from "lucide-react";
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
    hidden: { y: 8, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export function LandingFeatures() {
    return (
        <section id="features" className="py-16 md:py-24 px-6 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold tracking-wider uppercase text-zinc-500"
                    >
                        <Zap className="h-3 w-3 text-primary" />
                        <span>Módulos de Transformação</span>
                    </motion.div>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
                        Engenharia de precisão para <span className="text-primary">servir</span> melhor.
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-normal leading-relaxed">
                        Desenhamos cada módulo para ser invisível na operação, mas visível nos resultados. Tecnologia nativa que resolve problemas reais.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Feature cards simplified */}
                    {[
                        {
                            title: "Upsell Inteligente",
                            desc: "Sugestões automáticas baseadas em IA no momento exato do pedido.",
                            tag: "+15% Ticket",
                            icon: TrendingUp,
                            link: "/features/upsell"
                        },
                        {
                            title: "Smart BI",
                            desc: "Dashboards de Power BI nativo para decisões baseadas em dados reais.",
                            tag: "Real-time",
                            icon: BarChart3,
                            link: "/dashboard/analytics"
                        },
                        {
                            title: "Loyalty Club",
                            desc: "Programa de fidelização customizável para reter os seus melhores clientes.",
                            tag: "Fidelização",
                            icon: QrCode,
                            link: "/features/loyalty"
                        },
                        {
                            title: "Multi-Canal",
                            desc: "Gestão unificada de Dine-in, Takeaway e Delivery numa única tela.",
                            tag: "Gestão 360",
                            icon: ClipboardList,
                            link: "/features/context-ordering"
                        }
                    ].map((f, i) => (
                        <Link key={i} href={f.link} className="group">
                            <motion.div variants={item} className="p-8 h-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-8">
                                <div className="space-y-6">
                                    <div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <f.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold leading-tight">{f.title}</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                        {f.tag}
                                    </span>
                                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
