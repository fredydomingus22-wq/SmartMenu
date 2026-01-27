"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
} from "@smart-menu/ui";
import { Star, Gift, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

function LoyaltyWelcomeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo") || "/";
    const tenantId = searchParams.get("tenantId");

    const benefits = [
        {
            icon: Star,
            title: "Pontos em cada pedido",
            desc: "Cada Kwanza gasto vira pontos para você trocar por pratos grátis."
        },
        {
            icon: Zap,
            title: "Ofertas Relâmpago",
            desc: "Acesso antecipado a novidades e descontos exclusivos da rede."
        },
        {
            icon: Gift,
            title: "Presente de Boas-vindas",
            desc: "Ganhe seus primeiros pontos logo após completar seu perfil."
        }
    ];

    const handleProceed = () => {
        const loginUrl = tenantId
            ? `/login?tenantId=${tenantId}&returnTo=${encodeURIComponent(returnTo)}`
            : `/login?returnTo=${encodeURIComponent(returnTo)}`;
        router.push(loginUrl);
    };

    return (
        <PageContainer size="sm" className="pt-12 pb-24 flex flex-col items-center">
            {/* Back Button */}
            <div className="w-full mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(returnTo)}
                    className="rounded-full bg-zinc-50 dark:bg-zinc-900 shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* Hero Section */}
            <header className="text-center space-y-4 mb-12">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6"
                >
                    <Star className="w-10 h-10 text-orange-600 fill-orange-600" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-black italic tracking-tighter leading-tight uppercase"
                >
                    PEÇA O SEU FAVORITO E <br />
                    <span className="text-orange-600">GANHE RECOMPENSAS</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-500 font-medium max-w-[280px] mx-auto text-sm"
                >
                    O Clube SmartMenu é a sua chave para experiências exclusivas e pratos por conta da casa.
                </motion.p>

                {/* Social Proof Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-zinc-900 border border-orange-100 dark:border-white/5 mx-auto"
                >
                    <div className="flex -space-x-1.5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-4 h-4 rounded-full bg-orange-200 border border-white dark:border-zinc-900 flex items-center justify-center overflow-hidden">
                                <Star className="w-2 h-2 text-orange-600 fill-orange-600" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-orange-700 dark:text-orange-500 uppercase tracking-tighter">
                        +10k membros na rede
                    </span>
                </motion.div>
            </header>

            {/* Benefits List */}
            <div className="w-full space-y-4 mb-12">
                {benefits.map((benefit, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="flex gap-4 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                            <benefit.icon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{benefit.title}</h3>
                            <p className="text-xs text-zinc-400 font-medium leading-relaxed">{benefit.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Fixed Primary CTA */}
            <div className="fixed bottom-10 left-6 right-6 space-y-4">
                <Button
                    onClick={handleProceed}
                    className="w-full h-18 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold shadow-2xl shadow-orange-600/30 gap-3"
                >
                    Quero meus benefícios VIP
                    <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    Grátis para sempre • Seguro • 100% Digital
                </p>
            </div>
        </PageContainer>
    );
}

export default function LoyaltyWelcomePage() {
    return (
        <AppShell className="bg-white dark:bg-black min-h-screen">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                    <div className="w-8 h-8 animate-spin text-orange-600 border-4 border-current border-t-transparent rounded-full" />
                </div>
            }>
                <LoyaltyWelcomeContent />
            </Suspense>
        </AppShell>
    );
}
