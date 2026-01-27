"use client";

import Image from "next/image";

export function LandingHowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">Simples. Rápido. Eficiente.</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                        Implementação em minutos, resultados no primeiro dia.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative items-center">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[20%] left-[16%] w-[68%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -z-10" />

                    <div className="text-center space-y-6 bg-background p-4 relative group">
                        <div className="h-24 w-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-black border-8 border-background shadow-xl group-hover:scale-110 transition-transform cursor-default">
                            1
                        </div>
                        <h3 className="text-xl font-bold">Scan QR</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            O cliente senta e escaneia o código na mesa. <span className="text-primary font-bold">Sem apps, sem downloads.</span>
                        </p>
                    </div>

                    <div className="text-center space-y-6 bg-background p-4 relative group">
                        <div className="h-24 w-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-black border-8 border-background shadow-xl group-hover:scale-110 transition-transform cursor-default">
                            2
                        </div>
                        <h3 className="text-xl font-bold">Pedido & Upsell</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            O menu interativo sugere os melhores pratos e bebidas extra <span className="text-orange-700 dark:text-orange-400 font-bold">automaticamente.</span>
                        </p>
                    </div>

                    <div className="text-center space-y-6 bg-background p-4 relative group">
                        <div className="relative h-24 w-40 mx-auto rounded-xl overflow-hidden border-4 border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                            <Image
                                src="/assets/marketing/kds-mockup.png"
                                alt="KDS Dashboard"
                                fill
                                className="object-cover"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-xl font-bold">Cozinha & Entrega</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            O pedido vai direto para o KDS da cozinha. <span className="text-blue-600 dark:text-blue-400 font-bold">Sem gritos, sem erros.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
