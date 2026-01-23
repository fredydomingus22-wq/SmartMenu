import { SettingsTabs } from "../_components/settings-tabs";
import { OrganizationSettingsForm } from "../_components/organization-settings-form";
import { getOrganizationProfile } from "@/app/actions/settings";

export default async function OrganizationSettingsPage() {
    const organization = await getOrganizationProfile();

    if (!organization) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed text-zinc-500">
                Não foi possível carregar os dados da organização.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Gerencie as informações do seu restaurante e organização.
                </p>
            </div>

            <SettingsTabs />

            <div className="pt-4">
                <OrganizationSettingsForm initialData={organization} />
            </div>
        </div>
    );
}
