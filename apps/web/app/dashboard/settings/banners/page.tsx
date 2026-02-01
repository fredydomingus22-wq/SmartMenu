import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BannersForm } from "../_components/banners-form";
import { apiClient } from "@/utils/api-client-server";

interface Banner {
    id: string;
    type: string;
    title: Record<string, string> | null;
    subtitle: Record<string, string> | null;
    buttonText: Record<string, string> | null;
    buttonLink: string | null;
    imageUrl: string | null;
    isActive: boolean;
    order: number;
}

export default async function BannersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let banners: Banner[] = [];
    try {
        const response = await apiClient<Banner[]>('/marketing/banners', {
            headers: {
                Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
        });
        banners = Array.isArray(response) ? response : [];
    } catch (error) {
        console.error('Failed to fetch banners:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Banners & Links</h3>
                <p className="text-sm text-muted-foreground">
                    Configure os banners do Hero e da secção antes do rodapé do seu menu digital.
                </p>
            </div>
            <BannersForm initialBanners={banners} />
        </div>
    );
}
