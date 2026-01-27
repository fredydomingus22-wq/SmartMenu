"use client";

import { cn } from "@smart-menu/ui";
import { Sparkles, TrendingUp, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

export type BadgeType = "ai_suggested" | "best_seller" | "trending" | "new" | "promo";

interface SmartBadgeProps {
    type: BadgeType;
    label?: string;
    className?: string;
    animate?: boolean;
}

const badgeConfig: Record<BadgeType, { icon: React.ElementType; defaultLabel: string; colors: string }> = {
    ai_suggested: {
        icon: Sparkles,
        defaultLabel: "Sugestão IA",
        colors: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-purple-500/30",
    },
    best_seller: {
        icon: TrendingUp,
        defaultLabel: "Mais Pedido",
        colors: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/30",
    },
    trending: {
        icon: Zap,
        defaultLabel: "Em Alta",
        colors: "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-pink-500/30",
    },
    new: {
        icon: Star,
        defaultLabel: "Novidade",
        colors: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-teal-500/30",
    },
    promo: {
        icon: Zap,
        defaultLabel: "Promo",
        colors: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-rose-500/30",
    },
};

export function SmartBadge({ type, label, className, animate = true }: SmartBadgeProps) {
    const config = badgeConfig[type];
    const Icon = config.icon;

    const content = (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg",
                config.colors,
                className
            )}
        >
            <Icon className="h-3 w-3" />
            <span>{label || config.defaultLabel}</span>
        </div>
    );

    if (!animate) return content;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            {content}
        </motion.div>
    );
}
