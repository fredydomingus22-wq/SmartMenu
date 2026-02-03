"use client";

import Link from "next/link";
import Image from "next/image";

export function LandingHeader() {
    return (
        <header id="navigation" className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 relative transition-transform duration-500 group-hover:rotate-[15deg]" aria-label="SmartMenu Logo">
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
                
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    <Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link>
                    <Link href="#analytics" className="hover:text-primary transition-colors">Analytics</Link>
                    <Link href="#how-it-works" className="hover:text-primary transition-colors">Como Funciona</Link>
                    
                    <Link href="/login" className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-all font-bold">
                        Entrar
                    </Link>
                </nav>
            </div>
        </header>
    );
}
