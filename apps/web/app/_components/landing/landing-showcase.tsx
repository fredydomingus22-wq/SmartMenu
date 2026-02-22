"use client";

import { motion, useReducedMotion } from "framer-motion";
import { QrCode, MonitorPlay, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@smart-menu/ui";

export function LandingShowcase() {
    const prefersReducedMotion = useReducedMotion();

    const floatAnimation = prefersReducedMotion ? {} : {
        y: [0, -15, 0],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    };

    return (
        <section id="showcase" className="py-12 md:py-16 px-6 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-32 relative z-10">
                
                {/* Section 4: A Solução Elegante (Consumer Mobile) */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-bold tracking-wider uppercase text-orange-600">
                            <QrCode className="h-3 w-3" />
                            <span>Para o Cliente Final</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                            Uma montra digital que <span className="text-orange-600 italic">vende sozinha.</span>
                        </h2>
                        <p className="text-zinc-800 text-lg leading-relaxed">
                            O seu cardápio em PDF é o passado. Apresente os seus pratos com fotografias vibrantes e sugestões feitas sob medida (upsell) diretamente no telemóvel do cliente. Nenhuma app necessária.
                        </p>
                        <Button className="mt-4 border border-zinc-200 bg-white text-zinc-950 shadow-xs hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300" asChild>
                            <Link href="https://smart-menu-consumer.vercel.app//menu/c02dc8bc-112e-4def-9a71-dcf4950ed7bf" target="_blank">Ver Demo do Menu <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-[1000px]">
                        <motion.div 
                            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotateY: 15, rotateX: 5 }}
                            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotateY: -5, rotateX: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                            animate={floatAnimation}
                            className="w-[280px] h-[580px] bg-white border-[8px] border-zinc-100 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col"
                        >
                            <div className="relative w-full h-full">
                                <Image 
                                    src="/assets/marketing/consumer-mockup.jpg"
                                    alt="Menu Digital no Smartphone"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Section 5: Ordem no Caos (KDS) */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="order-1 flex justify-center lg:justify-start">
                        <motion.div
                            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="w-full max-w-lg aspect-[4/3] bg-white border-4 border-zinc-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="relative w-full h-full">
                                <Image 
                                    src="/assets/marketing/kds-mockup.png"
                                    alt="Kitchen Display System"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                    <div className="space-y-6 order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold tracking-wider uppercase text-emerald-600">
                            <MonitorPlay className="h-3 w-3" />
                            <span>Para a Cozinha</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                            Ordem absoluta durante as <span className="text-emerald-600">horas de pico.</span>
                        </h2>
                        <p className="text-zinc-800 text-lg leading-relaxed">
                            O Kitchen Display System (KDS) roteia os pedidos automaticamente. Reduza o tempo de preparação em 25% e acabe com os erros de anotação e papelões perdidos.
                        </p>
                    </div>
                </div>

                {/* Section 6: Retenção Automática (Mini CRM) */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[10px] font-bold tracking-wider uppercase text-purple-600">
                            <MessageSquare className="h-3 w-3" />
                            <span>Mini CRM & Fidelização</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                            Traga os clientes de volta no <span className="text-purple-600">piloto automático.</span>
                        </h2>
                        <p className="text-zinc-800 text-lg leading-relaxed">
                            Com o Clube de Pontos, todos os pedidos registados viram ouro. Crie campanhas via notificação ou WhatsApp para clientes que não visitam há 30 dias.
                        </p>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center relative">
                        {/* Abstract Notification UI */}
                        <div className="relative w-full max-w-sm h-64">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-4 left-0 right-8 bg-white border border-zinc-100 p-4 rounded-2xl shadow-xl flex items-start gap-4"
                            >
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex-shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 w-1/2 bg-zinc-200 rounded-full" />
                                    <div className="h-2 w-full bg-zinc-100 rounded-full" />
                                    <div className="h-2 w-4/5 bg-zinc-100 rounded-full" />
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="absolute bottom-4 left-8 right-0 bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
                            >
                                <div className="space-y-1">
                                    <div className="text-sm font-bold">Oferta Enviada!</div>
                                    <div className="text-[10px] font-medium text-zinc-400">245 clientes inativos notificados</div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    +12
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
