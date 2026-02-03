"use client";

import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t py-12 px-6 bg-zinc-50 dark:bg-zinc-950/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-8 w-8 relative transition-transform duration-500 group-hover:rotate-[15deg]">
                            <Image
                                src="/logo.png"
                                alt="SmartMenu Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            Smart<span className="text-primary">Menu</span>
                        </span>
                    </Link>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal max-w-[250px] text-center md:text-left leading-relaxed">
                        A inteligência operacional que escala o seu paladar em Angola.
                    </p>
                </div>

                <p className="text-zinc-400 dark:text-zinc-600 text-xs font-medium order-3 md:order-2">
                    © 2026 SmartMenu • Luanda
                </p>

                <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-zinc-500 dark:text-zinc-400 order-2 md:order-3">
                    <Link href="/dashboard/analytics" className="hover:text-primary transition-colors">Analytics</Link>
                    <Link href="/features/technology" className="hover:text-primary transition-colors">Tecnologia</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
                </div>
            </div>
        </footer>
    );
}
