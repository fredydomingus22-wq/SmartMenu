"use client";

import { motion } from "framer-motion";
import { Clock, TrendingDown, Users, AlertCircle } from "lucide-react";

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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export function LandingFeatures() {
    return (
        <section id="pain" className="py-12 md:py-16 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[11px] font-bold tracking-widest uppercase"
                    >
                        <AlertCircle className="h-4 w-4" />
                        <span>A Realidade do Mercado</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                        O serviço lento está a <span className="text-red-600">destruir</span> as suas avaliações.
                    </h2>
                    <p className="text-zinc-800 text-lg md:text-xl font-medium leading-relaxed">
                        Em Angola, um cliente insatisfeito com a demora não reclama: ele simplesmente nunca mais volta e fala mal de si no grupo do WhatsApp.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-8 md:gap-12"
                >
                    {[
                        {
                            title: "Falta de Mão de Obra",
                            desc: "Mais garçons não resolvem processos caóticos. A conta nunca fecha.",
                            stat: "-15%",
                            statDesc: "Margem de lucro engolida por custos",
                            icon: Users,
                            color: "text-amber-600",
                            bg: "bg-amber-50"
                        },
                        {
                            title: "Demora nos Pedidos",
                            desc: "20 minutos para anotar um pedido numa sexta-feira à noite é inaceitável.",
                            stat: "40%",
                            statDesc: "Dos clientes desistem de pedir sobremesa",
                            icon: Clock,
                            color: "text-red-600",
                            bg: "bg-red-50"
                        },
                        {
                            title: "Perda de Upsell",
                            desc: "O garçom na pressa esquece de oferecer a bebida premium ou o extra.",
                            stat: "-30%",
                            statDesc: "De receita perdida por esquecimento",
                            icon: TrendingDown,
                            color: "text-orange-600",
                            bg: "bg-orange-50"
                        }
                    ].map((pain, i) => (
                        <motion.div key={i} variants={item} className="relative p-8 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="space-y-6">
                                <div className={`h-14 w-14 rounded-2xl ${pain.bg} flex items-center justify-center`}>
                                    <pain.icon className={`h-6 w-6 ${pain.color}`} />
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-zinc-950">{pain.title}</h3>
                                    <p className="text-zinc-800 font-medium leading-relaxed">
                                        {pain.desc}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-zinc-200">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-3xl font-black ${pain.color}`}>{pain.stat}</span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-zinc-700 w-1/2 leading-tight">
                                            {pain.statDesc}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
