"use client";

import { motion } from "framer-motion";
import { Button } from "@smart-menu/ui";
import { ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LandingHero() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-black/60">
                <Image
                    src="/assets/marketing/hero-luanda.png"
                    alt="Restaurante em Luanda - Ambiente"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto text-center md:text-left grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8 relative z-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        <Zap className="h-3 w-3 fill-current" />
                        <span>TECNOLOGIA DE PONTA PARA O SEU RESTAURANTE</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        A Nova Era do <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-500 dark:from-orange-400 dark:to-orange-500">
                            Paladar Digital.
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
                        Venda mais e opere com precisão cirúrgica. O sistema líder em Angola para menus QR Code, gestão de pedidos e fidelização.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:justify-start">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full gap-2 shadow-xl shadow-primary/20 transition-transform active:scale-95" asChild>
                            <Link href="/login">
                                Começar Grátis Agora <ChevronRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-2 transition-transform active:scale-95" asChild>
                            <Link href="#features">Explorar Recursos</Link>
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative lg:block"
                >
                    <div className="relative z-10 rounded-2xl border-4 border-white/10 shadow-2xl overflow-hidden bg-black/40 backdrop-blur-3xl aspect-[4/3] flex flex-col">
                        <Image
                            src="/assets/marketing/friends-dining.png"
                            alt="Amigas angolanas a usar o SmartMenu"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                    </div>
                    {/* Decorative floating elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -top-6 -right-6 h-20 w-20 bg-orange-700/20 dark:bg-orange-400/20 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 5 }}
                        className="absolute -bottom-6 -left-6 h-16 w-16 bg-primary/20 rounded-full blur-2xl"
                    />
                </motion.div>
            </div>
        </section>
    );
}
