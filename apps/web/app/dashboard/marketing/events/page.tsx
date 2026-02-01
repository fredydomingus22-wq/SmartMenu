import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EventsClient } from "./_components/events-client";
import { apiClient } from "@/utils/api-client-server";

interface Event {
    id: string;
    name: Record<string, string>;
    description: Record<string, string> | null;
    imageUrl: string | null;
    date: string;
    endDate: string | null;
    location: string | null;
    ticketLink: string | null;
    isActive: boolean;
}

export default async function EventsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let events: Event[] = [];
    try {
        const response = await apiClient<Event[]>('/marketing/events', {
            headers: {
                Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
        });
        events = Array.isArray(response) ? response : [];
    } catch (error) {
        console.error('Failed to fetch events:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Eventos</h3>
                <p className="text-sm text-muted-foreground">
                    Promova eventos no seu restaurante: noites temáticas, música ao vivo, festivais, etc.
                </p>
            </div>
            <EventsClient initialEvents={events} />
        </div>
    );
}
