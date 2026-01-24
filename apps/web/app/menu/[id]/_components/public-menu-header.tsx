"use client";

import { Search, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TenantBranding } from "../_types";
import { ProductSearch } from "./product-search";
import { OrderHistory } from "./order-history";
import { LanguageSelector } from "./language-selector";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface PublicMenuHeaderProps {
    branding?: TenantBranding | null;
    tableId?: string;
    enabledLanguages?: string[];
}

export function PublicMenuHeader({ branding, tableId, enabledLanguages }: PublicMenuHeaderProps) {
    const params = useParams();
    const tenantId = params.id as string;
    const { t } = useTranslation();

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
                                {t('menu.table')} {tableId.padStart(2, '0')}
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
                                aria-label={t('menu.search_aria_label')}
                            >
                                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-6 overflow-hidden">
                            <DialogHeader>
                                <DialogTitle>{t('menu.search_placeholder')}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto mt-4 pr-2">
                                <ProductSearch tenantId={tenantId} />
                            </div>
                        </DialogContent>
                    </Dialog>
                    <div className="hidden sm:block">
                        <LanguageSelector enabledLanguages={enabledLanguages} />
                    </div>
                    <OrderHistory tenantId={tenantId} />
                </div>
            </div>
        </header>
    );
}
