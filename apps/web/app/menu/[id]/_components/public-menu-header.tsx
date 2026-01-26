"use client";

import { Search, MapPin } from "lucide-react";
import Image from "next/image";
import { Button, PublicMenuHeader as SharedHeader } from "@smart-menu/ui";
import { TenantBranding } from "../_types";
import { ProductSearch } from "./product-search";
import { OrderHistory } from "./order-history";
import { LanguageSelector } from "./language-selector";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { useHasMounted } from "@/hooks/use-has-mounted";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@smart-menu/ui";

interface PublicMenuHeaderProps {
    branding?: TenantBranding | null;
    tableId?: string;
    enabledLanguages?: string[];
}

export function PublicMenuHeader({ branding, tableId, enabledLanguages }: PublicMenuHeaderProps) {
    const params = useParams();
    const tenantId = params.id as string;
    const { t } = useTranslation();
    const hasMounted = useHasMounted();

    return (
        <SharedHeader
            logo={branding?.logoUrl ? (
                <Image
                    src={branding.logoUrl}
                    alt={branding.tenantName || "Logo"}
                    fill
                    className="object-contain p-1"
                    unoptimized
                />
            ) : undefined}
            title={branding?.tenantName || "SmartMenu"}
            subtitle={tableId ? (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest mt-1">
                    <MapPin className="h-3 w-3" />
                    {t('menu.table')} {tableId.padStart(2, '0')}
                </div>
            ) : undefined}
            actions={
                <div className="flex items-center gap-2">
                    {hasMounted && (
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
                            <DialogContent className="sm:max-w-3xl h-[80dvh] flex flex-col p-6 overflow-hidden">
                                <DialogHeader>
                                    <DialogTitle>{t('menu.search_placeholder')}</DialogTitle>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto mt-4 pr-2">
                                    <ProductSearch tenantId={tenantId} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    <div className="hidden sm:block">
                        <LanguageSelector enabledLanguages={enabledLanguages} />
                    </div>
                    {hasMounted && <OrderHistory tenantId={tenantId} />}
                </div>
            }
        />
    );
}
