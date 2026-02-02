"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export interface MarketingCampaign {
    title: string;
    message: string;
    campaignId: string;
    dealId?: string;
}

export function useMarketingNotifications(tenantId: string) {
    const [latestCampaign, setLatestCampaign] = useState<MarketingCampaign | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!tenantId) return;

        const supabase = createClient();
        const channel = supabase.channel(`marketing:${tenantId}`);

        channel
            .on("broadcast", { event: "MARKETING_CAMPAIGN" }, ({ payload }) => {
                const campaign = payload as MarketingCampaign;
                setLatestCampaign(campaign);
                setUnreadCount(prev => prev + 1);

                // Also show a toast immediately
                toast.info(campaign.title, {
                    description: campaign.message,
                    duration: 10000,
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tenantId]);

    return {
        latestCampaign,
        unreadCount,
        clearCampaign: () => setLatestCampaign(null),
        markAsRead: () => setUnreadCount(0)
    };
}
