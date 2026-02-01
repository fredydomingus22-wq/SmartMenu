import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PromotionalCalendarClient } from "./_components/promotional-calendar-client";
import { apiClient } from "@/utils/api-client-server";

interface PromotionalSchedule {
    id: string;
    productId: string;
    startDate: string;
    endDate: string | null;
    isSpecial: boolean;
    label: string | null;
    discount: number | null;
    product: {
        id: string;
        name: Record<string, string>;
        imageUrl: string | null;
    };
}

interface Product {
    id: string;
    name: Record<string, string>;
    imageUrl: string | null;
}

export default async function PromotionalCalendarPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let promotions: PromotionalSchedule[] = [];
    let products: Product[] = [];

    try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const headers = { Authorization: `Bearer ${token}` };

        const [promoRes, productsRes] = await Promise.all([
            apiClient<PromotionalSchedule[]>('/marketing/promotions', { headers }),
            apiClient<Product[]>('/products', { headers }),
        ]);

        promotions = Array.isArray(promoRes) ? promoRes : [];
        products = Array.isArray(productsRes) ? productsRes : [];
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Calendário Promocional</h3>
                <p className="text-sm text-muted-foreground">
                    Agende promoções para dias normais ou datas especiais (Natal, Dia dos Namorados, etc.)
                </p>
            </div>
            <PromotionalCalendarClient initialPromotions={promotions} products={products} />
        </div>
    );
}
