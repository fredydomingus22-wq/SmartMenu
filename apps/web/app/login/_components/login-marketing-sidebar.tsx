"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Star, Zap, TrendingUp, Users } from "lucide-react";

export function LoginMarketingSidebar() {
    const benefits = [
        {
            icon: TrendingUp,
            title: "Aumente suas vendas",
            desc: "Sugestões inteligentes que aumentam o ticket médio em 20%."
        },
        {
            icon: Zap,
            title: "Operação veloz",
            desc: "Reduza o tempo de espera com pedidos diretos para a cozinha."
        },
        {
            icon: Users,
            title: "Fidelidade integrada",
            desc: "Crie seu próprio clube de pontos e retenha mais clientes."
        }
    ];

    return (
        <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white relative overflow-hidden h-full">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-12">
                    <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Star className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tighter italic">SmartMenu<span className="text-orange-600">.</span></span>
                </div>

                <div className="space-y-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black italic tracking-tighter leading-[0.9] uppercase"
                    >
                        Lidere a revolução <br />
                        <span className="text-orange-600">Digital no seu</span> <br />
                        Restaurante.
                    </motion.h2>

                    <div className="space-y-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <benefit.icon className="h-6 w-6 text-orange-500" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{benefit.title}</h3>
                                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">{benefit.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10 border-t border-white/10 pt-8 mt-12 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900" />
                    ))}
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">+500 Restaurantes em Angola</p>
            </div>
        </div>
    );
}
