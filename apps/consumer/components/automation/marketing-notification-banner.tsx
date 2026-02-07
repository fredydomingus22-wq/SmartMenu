"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { Button } from "@smart-menu/ui";
import { useMarketingNotifications } from "@/hooks/use-marketing-notifications";
import { useParams } from "next/navigation";

export function MarketingNotificationBanner() {
    const params = useParams();
    const tenantId = params.id as string;
    const { latestCampaign, clearCampaign } = useMarketingNotifications(tenantId);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (latestCampaign) {
            setIsVisible(true);
        }
    }, [latestCampaign]);

    if (!latestCampaign || !isVisible) return null;

    return (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 p-4 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <Zap className="h-5 w-5 text-white" />
                </div>

                <div className="flex-1 pt-0.5">
                    <h4 className="text-sm font-black tracking-tight">{latestCampaign.title}</h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1 leading-relaxed">
                        {latestCampaign.message}
                    </p>
                    {latestCampaign.dealId && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-3 h-8 text-[10px] font-black uppercase tracking-widest px-4 rounded-full bg-zinc-800 dark:bg-zinc-200"
                        >
                            Ver Oferta
                        </Button>
                    )}
                </div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        clearCampaign();
                    }}
                    className="p-1 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors"
                >
                    <X className="h-4 w-4 opacity-50" />
                </button>
            </div>
        </div>
    );
}
