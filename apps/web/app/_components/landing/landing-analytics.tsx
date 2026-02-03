"use client";

import { motion } from "framer-motion";
import { BarChart3, LineChart, Cpu, ArrowUpRight, Zap, Target, TrendingUp } from "lucide-react";
import { Badge } from "@smart-menu/ui";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { y: 8, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export function LandingAnalytics() {
    return (
        <section id="analytics" className="py-16 md:py-20 px-6 bg-zinc-950 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -ml-64 -mb-64" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold tracking-wider text-[10px] uppercase py-1 px-4 rounded-lg">
                                Business Intelligence Nativo
                            </Badge>
                            <h2 className="text-2xl md:text-5xl font-bold tracking-tight leading-tight text-white">
                                Transforme o seu <span className="text-primary">serviço</span> em inteligência.
                            </h2>
                            <p className="text-zinc-400 text-lg max-w-xl font-normal leading-relaxed">
                                A nossa camada de dados não apenas reporta o que aconteceu, mas revela o que deve ser feito a seguir para escalar a sua rentabilidade.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid sm:grid-cols-2 gap-6"
                        >
                            <motion.div variants={item} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">KPIs em Tempo Real</h4>
                                <p className="text-sm text-zinc-400 font-medium">Vendas, ticket médio e volume de pedidos atualizados ao segundo.</p>
                            </motion.div>

                            <motion.div variants={item} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                    <LineChart className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">Análise de Tendências</h4>
                                <p className="text-sm text-zinc-400 font-medium">Identifique horários de pico e sazonalidade para otimizar a sua escala.</p>
                            </motion.div>

                            <motion.div variants={item} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors group">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                                    <Target className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">Ranking de Performance</h4>
                                <p className="text-sm text-zinc-400 font-medium">Saiba exatamente quais produtos geram lucro e quais precisam de ajuste.</p>
                            </motion.div>

                            <motion.div variants={item} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors group">
                                <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                                    <Cpu className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">IA Preditiva</h4>
                                <p className="text-sm text-zinc-400 font-medium">Sugestões inteligentes para aumentar o faturamento em dias de baixo movimento.</p>
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Shimmering Dashboard Preview Mockup */}
                        <div className="relative z-10 p-4 bg-zinc-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden aspect-[12/9]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5" />
                            
                            <div className="relative space-y-6 h-full flex flex-col">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="h-6 w-32 bg-white/5 rounded-full" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
                                            <div className="h-2 w-12 bg-zinc-700 rounded-full" />
                                            <div className="h-4 w-16 bg-white/20 rounded-full" />
                                            <div className="flex items-center gap-1 text-[8px] text-green-400 font-bold">
                                                <TrendingUp className="h-2 w-2" /> +12%
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-6 relative flex items-end justify-between gap-2 overflow-hidden">
                                     {/* Fake Chart Lines */}
                                     {[40, 70, 55, 90, 60, 85, 45, 100, 75, 95].map((h, i) => (
                                         <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 1 }}
                                            className="flex-1 bg-gradient-to-t from-blue-500/50 to-purple-500/50 rounded-t-sm"
                                         />
                                     ))}
                                     <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-900 to-transparent" />
                                </div>

                                <div className="h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-4 w-4 text-blue-400 animate-pulse" />
                                        <div className="h-3 w-40 bg-blue-400/20 rounded-full" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 p-4 rounded-2xl bg-white text-zinc-950 font-bold shadow-2xl z-20 flex items-center gap-2 border"
                        >
                            <Zap className="h-4 w-4 text-orange-500 fill-current" />
                            Power BI Nativo
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-zinc-900 border border-white/20 text-white font-bold shadow-2xl z-20 flex items-center gap-2"
                        >
                            <Cpu className="h-4 w-4 text-purple-400" />
                            AI-Insights
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
