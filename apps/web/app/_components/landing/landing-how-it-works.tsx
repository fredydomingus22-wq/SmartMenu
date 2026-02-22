"use client";

import { motion } from "framer-motion";
import { Armchair, QrCode, ShoppingBag, Bell } from "lucide-react";
import { BRAND_COLORS } from "@smart-menu/ui";
import Image from "next/image";

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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
};

const steps = [
    { 
        step: "01", 
        action: "Sente", 
        title: "Chegada Confortável",
        desc: "O cliente senta-se. Sem esperar pelo garçom, a magia está na própria mesa.",
        icon: Armchair,
        color: "text-orange-600 border-orange-100 bg-orange-50"
    },
    { 
        step: "02", 
        action: "Escaneie", 
        title: "Acesso Imediato",
        desc: "Um QR Code de luxo abre a montra digital no telemóvel, sem apps para instalar.",
        icon: QrCode,
        color: "text-orange-600 border-orange-100 bg-orange-50"
    },
    { 
        step: "03", 
        action: "Peça", 
        title: "Upsell Silencioso",
        desc: "Com fotografias apetitosas e extras sugeridos, o pedido é feito com 3 toques.",
        icon: ShoppingBag,
        color: "text-orange-600 border-orange-100 bg-orange-50"
    },
    { 
        step: "04", 
        action: "Acompanhe", 
        title: "Status em Tempo Real",
        desc: "O KDS da cozinha avisa o telemóvel do cliente quando a comida está pronta.",
        icon: Bell,
        color: "text-emerald-600 border-emerald-100 bg-emerald-50"
    }
];

export function LandingHowItWorks() {
    return (
        <section id="how-it-works" className="py-12 md:py-16 px-6 bg-zinc-50 relative overflow-hidden">
            <div className="absolute inset-0 -z-20">
                <Image 
                    src="/assets/marketing/restaurant_ambience.png"
                    alt="Restaurante luxuoso em Angola"
                    fill
                    className="object-cover opacity-5"
                />
            </div>
            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                        O Fluxo <span style={{ color: `oklch(${BRAND_COLORS.orange})` }}>Mágico</span>.
                    </h2>
                    <p className="text-zinc-800 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
                        Esqueça os menus rasgados e os braços levantados. A experiência do seu cliente passa a ser premium, rápida e totalmente sob o controlo dele.
                    </p>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
                >
                    {/* Visual Connector Line (Lg only) */}
                    <div className="hidden lg:block absolute top-12 left-[12.5%] w-[75%] h-px bg-gradient-to-r from-zinc-200 via-orange-500/50 to-emerald-500/50 -z-0" />

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div key={i} variants={item} className="text-center space-y-6 relative z-10 group">
                                <div className={`h-24 w-24 mx-auto rounded-3xl border flex flex-col items-center justify-center shadow-lg shadow-zinc-100 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 ${step.color}`}>
                                    <Icon className="h-8 w-8 mb-1" />
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{step.action}</span>
                                </div>
                                <div className="space-y-2 px-2">
                                    <h3 className="text-lg font-bold text-zinc-950">{step.title}</h3>
                                    <p className="text-zinc-700 text-sm font-medium leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
