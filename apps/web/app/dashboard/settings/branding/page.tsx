import { createClient } from "@/utils/supabase/server";
import { getBranding } from "@/app/actions/settings";
import { BrandingForm, type BrandingData } from "../_components/branding-form";
import { redirect } from "next/navigation";

export default async function BrandingPage() {
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

    const branding = await getBranding(tenantId);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Identidade Visual</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Personalize a aparência do seu menu digital para os seus clientes.
                </p>
            </div>
            <BrandingForm initialData={branding as BrandingData} />
        </div>
    );
}
