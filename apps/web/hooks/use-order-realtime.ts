"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useOrderRealtime(tenantId: string) {
    const [lastEvent, setLastEvent] = useState<{
        event: string;
        payload: unknown;
    } | null>(null);

    useEffect(() => {
        if (!tenantId) return;

        const supabase = createClient();
        const channel = supabase.channel(`orders:${tenantId}`);

        console.log(`[KDS] Subscribing to channel: orders:${tenantId}`);

        channel
            .on("broadcast", { event: "ORDER_CREATED" }, ({ payload }) => {
                console.log("[KDS] New order received:", payload);
                setLastEvent({ event: "ORDER_CREATED", payload });
            })
            .on("broadcast", { event: "STATUS_UPDATED" }, ({ payload }) => {
                console.log("[KDS] Order status updated:", payload);
                setLastEvent({ event: "STATUS_UPDATED", payload });
            })
            .subscribe((status, err) => {
                console.log(`[KDS] Supabase Realtime status for tenant ${tenantId}:`, status);
                if (err) console.error('[KDS] Subscription error:', err);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tenantId]);

    return { lastEvent };
}
