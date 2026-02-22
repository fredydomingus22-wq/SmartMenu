"use client";

import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t py-12 px-6 bg-zinc-50">
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
                        <span className="font-bold text-xl tracking-tight text-zinc-950">
                            SmartMenu
                        </span>
                    </Link>
                    <p className="text-zinc-500 text-xs font-normal max-w-[250px] text-center md:text-left leading-relaxed">
                        A inteligência operacional que escala o seu paladar em Angola.
                    </p>
                </div>

                <div className="text-zinc-400 text-xs font-medium order-3 md:order-2 flex flex-col items-center">
                    <span>© 2026 SmartMenu • Luanda</span>
                    <span className="mt-1 flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100 cursor-default">
                        Powered by <strong className="text-zinc-900 tracking-wide font-bold">Zimbotechia</strong>
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-zinc-500 order-2 md:order-3">
                    <Link href="/features/technology" className="hover:text-primary transition-colors">Tecnologia</Link>
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link>
                </div>
            </div>
        </footer>
    );
}
