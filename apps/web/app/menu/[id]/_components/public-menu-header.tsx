"use client";

import { Search, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TenantBranding } from "../_types";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PublicMenuHeaderProps {
    branding?: TenantBranding | null;
    tableId?: string;
}

export function PublicMenuHeader({ branding, tableId }: PublicMenuHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 z-[var(--z-header)] w-full bg-background/80 backdrop-blur-xl border-b transition-all duration-300">
            <div className="w-full px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
                {/* Brand Section */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {branding?.logoUrl && (
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden flex-shrink-0 border bg-white">
                            <Image
                                src={branding.logoUrl}
                                alt={branding.tenantName || "Logo"}
                                fill
                                className="object-contain p-1"
                                unoptimized
                            />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <h1 className="font-black text-sm sm:text-lg tracking-tight truncate uppercase leading-none">
                            {branding?.tenantName || "SmartMenu"}
                        </h1>
                        {tableId && (
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest mt-1">
                                <MapPin className="h-3 w-3" />
                                Mesa {tableId.padStart(2, '0')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                aria-label="Pesquisar produtos"
                            >
                                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] top-[20%] translate-y-0">
                            <DialogHeader>
                                <DialogTitle>O que vamos pedir hoje?</DialogTitle>
                            </DialogHeader>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Procurar por pizza, burger, bebida..."
                                    className="pl-10 h-12 rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="py-8 text-center text-muted-foreground text-sm italic">
                                Digite para começar a filtrar o cardápio...
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    );
}
