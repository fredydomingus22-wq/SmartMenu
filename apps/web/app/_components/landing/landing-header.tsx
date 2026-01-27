"use client";

import { Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "@smart-menu/ui";

export function LandingHeader() {
    return (
        <header id="navigation" className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center" aria-label="SmartMenu Logo">
                        <Utensils className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">SmartMenu</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-foreground transition-colors">Funcionalidades</Link>
                    <Link href="#how-it-works" className="hover:text-foreground transition-colors">Como funciona</Link>
                    <Link href="/login" className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all active:scale-95 font-bold">
                        Aceder
                    </Link>
                </nav>
            </div>
        </header>
    );
}
