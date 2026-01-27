"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Star } from "lucide-react";

interface PointsEarnedToastProps {
    points: number;
    isVisible: boolean;
    onClose: () => void;
    autoCloseMs?: number;
}

export function PointsEarnedToast({
    points,
    isVisible,
    onClose,
    autoCloseMs = 5000,
}: PointsEarnedToastProps) {
    useEffect(() => {
        if (isVisible && autoCloseMs > 0) {
            const timer = setTimeout(onClose, autoCloseMs);
            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseMs, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]"
                >
                    <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center gap-4">
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ rotate: -20, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                            className="flex-shrink-0"
                        >
                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Gift className="h-6 w-6" />
                            </div>
                        </motion.div>

                        {/* Content */}
                        <div>
                            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
                                Parabéns!
                            </p>
                            <div className="flex items-baseline gap-1">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-black"
                                >
                                    +{points}
                                </motion.span>
                                <span className="text-sm font-bold">pontos</span>
                            </div>
                            <p className="text-xs opacity-80">Acumulados neste pedido!</p>
                        </div>

                        {/* Floating Stars Animation */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, x: Math.random() * 100 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        y: -30,
                                        x: Math.random() * 100,
                                    }}
                                    transition={{
                                        delay: 0.5 + i * 0.15,
                                        duration: 1.5,
                                        ease: "easeOut",
                                    }}
                                    className="absolute bottom-0"
                                    style={{ left: `${20 + i * 15}%` }}
                                >
                                    <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-amber-600 flex items-center justify-center text-xs font-bold shadow-lg hover:scale-110 transition-transform"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook for easy usage
export function usePointsToast() {
    const [state, setState] = useState<{ isVisible: boolean; points: number }>({
        isVisible: false,
        points: 0,
    });

    const showPoints = (points: number) => {
        setState({ isVisible: true, points });
    };

    const hidePoints = () => {
        setState((prev) => ({ ...prev, isVisible: false }));
    };

    return {
        ...state,
        showPoints,
        hidePoints,
    };
}
