"use client";

import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
};

export function LandingHowItWorks() {
    return (
        <section id="how-it-works" className="py-16 md:py-24 px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
                        Simplicidade em cada <span className="text-primary">etapa</span>.
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-normal leading-relaxed">
                        Desenhamos o fluxo perfeito para que a tecnologia nunca seja o centro das atenções, mas sim a base de uma operação sem falhas.
                    </p>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative"
                >
                    {/* Visual Connector Line (Lg only) */}
                    <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-[70%] h-px bg-zinc-200 dark:bg-zinc-800 -z-0" />

                    {[
                        { 
                            step: "01", 
                            title: "Smart Scan", 
                            desc: "O cliente escaneia o QR Code na mesa. Sem aplicativos, carregamento instantâneo."
                        },
                        { 
                            step: "02", 
                            title: "AI Upsell", 
                            desc: "O menu sugere acompanhamentos e bebidas de forma inteligente, elevando o ticket."
                        },
                        { 
                            step: "03", 
                            title: "KDS Sync", 
                            desc: "O pedido entra na cozinha em tempo real. Ordem e velocidade sem falhas de comunicação."
                        },
                        { 
                            step: "04", 
                            title: "BI Growth", 
                            desc: "Visualize cada métrica de venda no Power BI e cresça com decisões precisas."
                        }
                    ].map((s, i) => (
                        <motion.div key={i} variants={item} className="text-center space-y-8 relative z-10">
                            <div className="h-24 w-24 mx-auto rounded-full bg-white dark:bg-zinc-900 border-4 border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-3xl font-bold shadow-xl shadow-zinc-200/50 dark:shadow-black/50 transition-transform hover:scale-105 duration-300">
                                <span className={i === 3 ? "text-emerald-500" : "text-primary"}>{s.step}</span>
                            </div>
                            <div className="space-y-2 px-4">
                                <h3 className="text-xl font-bold">{s.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
