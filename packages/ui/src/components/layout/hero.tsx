"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface HeroProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    badge?: string;
    children?: ReactNode;
    className?: string;
    overlayVariant?: "gradient" | "dark" | "none";
    aspectRatio?: "video" | "pdp" | "banner" | "square";
}

export function Hero({
    title,
    subtitle,
    imageUrl,
    badge,
    children,
    className = "",
    overlayVariant = "gradient",
    aspectRatio = "banner"
}: HeroProps) {
    const aspectRatioClasses = {
        video: "aspect-[16/9] sm:aspect-[21/9]",
        pdp: "aspect-[4/5] sm:aspect-[21/9] md:aspect-[3/1]",
        banner: "aspect-[4/5] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1]",
        square: "aspect-square"
    };

    const overlays = {
        gradient: "bg-gradient-to-t from-black/90 via-black/40 to-transparent",
        dark: "bg-black/50",
        none: ""
    };

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative w-full overflow-hidden bg-primary shadow-2xl",
                "max-h-[60dvh] sm:max-h-[500px]", // Limit absolute height to keep menu visible
                aspectRatioClasses[aspectRatio],
                className
            )}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-[2s] scale-100 group-hover:scale-105"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-primary/10 animate-pulse" />
                )}
            </div>

            {/* Overlay Layer */}
            <div className={cn("absolute inset-0 z-10", overlays[overlayVariant])} />

            {/* Content Layer */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 z-20 text-white flex flex-col justify-end h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-screen-xl mx-auto w-full"
                >
                    {badge && (
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase font-black tracking-widest mb-4 inline-block">
                            {badge}
                        </span>
                    )}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.9] sm:leading-none">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm sm:text-lg opacity-80 max-w-lg font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {subtitle}
                        </p>
                    )}
                    {children && <div className="mt-6">{children}</div>}
                </motion.div>
            </div>
        </motion.section>
    );
}
