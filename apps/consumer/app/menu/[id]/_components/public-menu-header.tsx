"use client";

import { Search, MapPin } from "lucide-react";
import Image from "next/image";
import { TenantBranding } from "../_types";
import { ProductSearch } from "./product-search";
import { useParams } from "next/navigation";
import { OrderHistory } from "./order-history";
import { LanguageSelector } from "./language-selector";
import { SessionActions } from "./session-actions";
import { useTranslation } from "@/hooks/use-translation";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Gift, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    PublicMenuHeader as SharedHeader
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
    const router = useRouter();
    const [user, setUser] = useState<unknown>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

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
                            <DialogTrigger
                                className="inline-flex items-center justify-center rounded-full h-10 w-10 sm:h-12 sm:w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={t('menu.search_aria_label')}
                            >
                                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
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
                    {hasMounted && (
                        user ? (
                            <button
                                onClick={() => router.push(`/menu/${tenantId}/loyalty`)}
                                className="inline-flex items-center justify-center rounded-full h-10 w-10 sm:h-12 sm:w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
                                aria-label={t('menu.view_points')}
                            >
                                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push(`/login?tenantId=${tenantId}&returnUrl=${encodeURIComponent(window.location.pathname)}`)}
                                className="inline-flex items-center justify-center rounded-full h-10 w-10 sm:h-12 sm:w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                aria-label={t('cart.login_now')}
                            >
                                <LogIn className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400" />
                            </button>
                        )
                    )}
                    {tableId && <SessionActions tenantId={tenantId} tableId={tableId} />}
                    {hasMounted && <OrderHistory tenantId={tenantId} />}
                </div>
            }
        />
    );
}


