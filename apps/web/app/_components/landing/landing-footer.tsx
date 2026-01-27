"use client";

import { Utensils } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t py-12 px-6 bg-zinc-50 dark:bg-zinc-950/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <Utensils className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tighter italic">Smart<span className="text-primary">Menu</span></span>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium max-w-[200px] text-center md:text-left">
                        Transformando a experiência gastronómica em Angola, um QR Code de cada vez.
                    </p>
                </div>

                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] order-3 md:order-2">
                    © 2026 SmartMenu • Luada, Angola
                </p>

                <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-muted-foreground order-2 md:order-3">
                    <Link href="/features/technology" className="hover:text-primary transition-colors">Tecnologia</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
                </div>
            </div>
        </footer>
    );
}
