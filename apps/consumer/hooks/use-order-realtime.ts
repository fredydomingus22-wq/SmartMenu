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

        channel
            .on("broadcast", { event: "ORDER_CREATED" }, ({ payload }) => {
                console.log("New order received:", payload);
                setLastEvent({ event: "ORDER_CREATED", payload });
            })
            .on("broadcast", { event: "STATUS_UPDATED" }, ({ payload }) => {
                console.log("Order status updated:", payload);
                setLastEvent({ event: "STATUS_UPDATED", payload });
            })
            .subscribe((status) => {
                console.log(`Supabase Realtime status for tenant ${tenantId}:`, status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tenantId]);

    return { lastEvent };
}
