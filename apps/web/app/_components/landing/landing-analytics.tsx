import { motion } from "framer-motion";
import { BarChart3, LineChart, Cpu, ArrowUpRight, Zap, Target, TrendingUp } from "lucide-react";
import { Badge, BRAND_COLORS } from "@smart-menu/ui";

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
        <section id="analytics" className="py-12 md:py-16 px-6 bg-white overflow-hidden relative">
            {/* Background elements - Subtle glows */}
            <div 
                className="absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full -mr-64 -mt-64 opacity-5" 
                style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <Badge className="bg-orange-50 text-orange-600 border-orange-100 font-bold tracking-wider text-[10px] uppercase py-1 px-4 rounded-lg">
                                Business Intelligence Nativo
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                                Transforme o seu <span style={{ color: `oklch(${BRAND_COLORS.orange})` }}>serviço</span> em inteligência.
                            </h2>
                            <p className="text-zinc-800 text-lg md:text-xl font-medium leading-relaxed">
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
                            <motion.div variants={item} className="p-6 rounded-3xl bg-white border border-zinc-200 hover:border-orange-500/50 transition-colors group shadow-sm">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-zinc-950">KPIs em Tempo Real</h4>
                                <p className="text-sm text-zinc-700 font-medium">Vendas, ticket médio e volume de pedidos atualizados ao segundo.</p>
                            </motion.div>

                            <motion.div variants={item} className="p-6 rounded-3xl bg-white border border-zinc-200 hover:border-orange-500/50 transition-colors group shadow-sm">
                                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                    <LineChart className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-zinc-950">Análise de Tendências</h4>
                                <p className="text-sm text-zinc-700 font-medium">Identifique horários de pico e sazonalidade para otimizar a sua escala.</p>
                            </motion.div>

                            <motion.div variants={item} className="p-6 rounded-3xl bg-white border border-zinc-200 hover:border-orange-500/50 transition-colors group shadow-sm">
                                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Target className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-zinc-950">Ranking de Performance</h4>
                                <p className="text-sm text-zinc-700 font-medium">Saiba exatamente quais produtos geram lucro e quais precisam de ajuste.</p>
                            </motion.div>

                            <motion.div variants={item} className="p-6 rounded-3xl bg-white border border-zinc-200 hover:border-orange-500/50 transition-colors group shadow-sm">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Cpu className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-zinc-950">IA Preditiva</h4>
                                <p className="text-sm text-zinc-700 font-medium">Sugestões inteligentes para aumentar o faturamento em dias de baixo movimento.</p>
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
                        <div className="relative z-10 p-4 bg-white border border-zinc-200 rounded-[2rem] shadow-2xl overflow-hidden aspect-[12/9]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50" />
                            
                            <div className="relative space-y-6 h-full flex flex-col">
                                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="h-6 w-32 bg-zinc-100 rounded-full" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="aspect-square rounded-2xl bg-white border border-zinc-100 p-4 space-y-2 shadow-sm">
                                            <div className="h-2 w-12 bg-zinc-100 rounded-full" />
                                            <div className="h-4 w-16 bg-zinc-200 rounded-full" />
                                            <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold">
                                                <TrendingUp className="h-2 w-2" /> +12%
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 rounded-2xl bg-white border border-zinc-100 p-6 relative flex items-end justify-between gap-2 overflow-hidden shadow-inner">
                                     {/* Fake Chart Lines */}
                                     {[40, 70, 55, 90, 60, 85, 45, 100, 75, 95].map((h, i) => (
                                         <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 1 }}
                                            className="flex-1 bg-zinc-100 rounded-t-sm"
                                            style={{ backgroundColor: i % 2 === 0 ? `oklch(${BRAND_COLORS.orange} / 0.4)` : `oklch(${BRAND_COLORS.orange} / 0.1)` }}
                                         />
                                     ))}
                                     <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
                                </div>

                                <div className="h-12 rounded-xl bg-orange-50 border border-orange-100 p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-4 w-4 text-orange-600 animate-pulse" />
                                        <div className="h-3 w-40 bg-orange-200 rounded-full" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 p-4 rounded-2xl bg-white text-zinc-900 font-bold shadow-2xl z-20 flex items-center gap-2 border border-zinc-100"
                        >
                            <Zap className="h-4 w-4 text-orange-500 fill-current" />
                            Power BI Nativo
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-zinc-900 text-white font-bold shadow-2xl z-20 flex items-center gap-2 shadow-orange-500/10"
                        >
                            <Cpu className="h-4 w-4 text-orange-400" />
                            AI-Insights
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
