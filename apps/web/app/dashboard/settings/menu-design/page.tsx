import { createClient } from "@/utils/supabase/server";
import { getMenuConfig } from "@/app/actions/settings";
import { MenuDesignForm } from "../_components/menu-design-form";
import { redirect } from "next/navigation";
import { MenuSection } from "../../../menu/[id]/_types";
import { apiClient } from "@/utils/api-client-server";
import { Banner } from "../../../menu/[id]/_types/marketing";

async function getBanners(tenantId: string): Promise<Banner[]> {
    try {
        const banners = await apiClient.get(`/marketing/public/banners/${tenantId}`, { cache: 'no-store' });
        return banners as Banner[];
    } catch (e) {
        console.error("Failed to fetch banners", e);
        return [];
    }
}

export default async function MenuDesignPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { getTenantProfile } = await import("@/app/actions/settings");
    const tenantProfile = await getTenantProfile() as { id: string } | null;

    interface UserMetadata {
        tenant_id?: string;
    }

    const tenantId = tenantProfile?.id ||
        (user.app_metadata as UserMetadata)?.tenant_id ||
        (user.user_metadata as UserMetadata)?.tenant_id;

    if (!tenantId) {
        return redirect("/dashboard");
    }

    const [config, banners] = await Promise.all([
        getMenuConfig(tenantId) as Promise<{ sections: MenuSection[] } | null>,
        getBanners(tenantId)
    ]);

    const sections = config?.sections || null;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Layout do Cardápio</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Gerencie a estrutura e as seções do seu menu digital nas telas dos clientes.
                </p>
            </div>
            <MenuDesignForm initialSections={sections} banners={banners} />
        </div>
    );
}
