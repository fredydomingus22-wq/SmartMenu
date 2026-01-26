"use client";

import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";

interface GlobalLoyaltySummaryProps {
    points?: number;
    restaurantsCount?: number;
    onClick?: () => void;
}

export function GlobalLoyaltySummary({ points = 0, restaurantsCount = 0, onClick }: GlobalLoyaltySummaryProps) {
    if (points === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group"
        >
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />

            <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <Star className="w-4 h-4 text-white fill-white" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-white/80">Clube de Pontos</span>
                    </div>
                    <h3 className="text-3xl font-black italic tracking-tighter">
                        {points} <span className="text-lg not-italic font-medium text-white/70">pontos</span>
                    </h3>
                    <p className="text-xs font-medium text-white/60">
                        Acumulados em {restaurantsCount} {restaurantsCount === 1 ? 'restaurante' : 'restaurantes'}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border-white/10 text-white transition-all hover:translate-x-1"
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </motion.div>
    );
}
