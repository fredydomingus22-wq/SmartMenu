import { createClient } from "@/utils/supabase/server";
import { getMenuConfig } from "@/app/actions/settings";
import { MenuDesignForm } from "../_components/menu-design-form";
import { redirect } from "next/navigation";
import { MenuSection } from "../../../menu/[id]/_types";

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

    const config = await getMenuConfig(tenantId) as { sections: MenuSection[] } | null;
    const sections = config?.sections || null;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Layout do Cardápio</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Gerencie a estrutura e as seções do seu menu digital nas telas dos clientes.
                </p>
            </div>
            <MenuDesignForm initialSections={sections} />
        </div>
    );
}

