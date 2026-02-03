"use client";

import { motion } from "framer-motion";
import { Button } from "@smart-menu/ui";
import { Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98]
        }
    }
};

export function LandingHero() {
    return (
        <section className="relative min-h-[75vh] flex items-center py-12 md:py-16 px-6 overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/assets/marketing/hero-luanda.png"
                    alt="Ambiente Restaurante Luanda"
                    fill
                    className="object-cover opacity-30 grayscale contrast-125"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background to-background" />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8 relative z-20 flex flex-col items-center lg:items-start"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold tracking-wider uppercase text-zinc-500">
                        <Zap className="h-3 w-3" />
                        <span>SaaS de Próxima Geração</span>
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                        A tecnologia que escala o <span className="text-primary">paladar</span> e o lucro do seu restaurante.
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="text-base md:text-lg text-muted-foreground max-w-lg font-normal leading-relaxed">
                        Nascemos para eliminar a fricção entre a cozinha e a mesa. O SmartMenu centraliza a sua operação, automatiza vendas e fideliza clientes com precisão angolana.
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                        <Button size="lg" className="h-12 px-8 text-sm font-semibold rounded-lg shadow-sm" asChild>
                            <Link href="/login">Começar Agora</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-semibold rounded-lg" asChild>
                            <Link href="#features">Recursos Técnicos</Link>
                        </Button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ 
                        opacity: 1, 
                        y: [12, 0, -4, 0],
                    }}
                    transition={{ 
                        opacity: { duration: 0.8, delay: 0.4 },
                        y: { duration: 0.8, delay: 0.4, times: [0, 0.4, 0.7, 1] },
                        rotate: { duration: 0.8, delay: 0.4 }
                    }}
                    className="relative w-full"
                >
                    <div className="relative z-10 rounded-2xl border border-border bg-card shadow-lg overflow-hidden aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3]">
                        <Image
                            src="/assets/marketing/friends-dining.png"
                            alt="Equipa SmartMenu em Operação"
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
