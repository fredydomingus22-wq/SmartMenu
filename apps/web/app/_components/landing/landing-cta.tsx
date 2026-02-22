"use client";

import { motion } from "framer-motion";
import { Button, BRAND_COLORS } from "@smart-menu/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { LeadCaptureModal } from "./lead-capture-modal";

export function LandingCTA() {
    return (
        <section className="py-12 md:py-16 px-6 relative overflow-hidden bg-white border-t border-zinc-100">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-orange-100">
                        <Sparkles className="h-4 w-4" />
                        <span>Ação Limitada</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                        Pare de Perder Dinheiro em Cada Sexta-Feira.
                    </h2>
                    
                    <p className="text-zinc-800 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Restam apenas <span className="text-zinc-950 font-bold">14 vagas</span> para o setup gratuito este mês. Junte-se à elite da restauração angolana e eleve o seu lucro.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <LeadCaptureModal>
                        <Button size="lg" className="h-14 px-10 text-base font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all group w-full sm:w-auto text-zinc-950" style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }}>
                            Criar Conta Gratuita
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </LeadCaptureModal>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest sm:hidden">
                        Sem Cartão de Crédito
                    </p>
                </motion.div>
                
                <p className="text-sm font-medium text-zinc-500 hidden sm:block">
                    Sem fidelização. Sem taxas ocultas. Cancele quando quiser.
                </p>
            </div>
        </section>
    );
}
