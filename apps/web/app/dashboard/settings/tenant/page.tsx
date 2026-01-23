import { SettingsTabs } from "../_components/settings-tabs";
import { TenantSettingsForm } from "../_components/tenant-settings-form";
import { getTenantProfile } from "@/app/actions/settings";

export default async function TenantSettingsPage() {
    const tenant = await getTenantProfile();

    if (!tenant) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed text-zinc-500">
                Não foi possível carregar os dados do restaurante.
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
                <TenantSettingsForm initialData={tenant} />
            </div>
        </div>
    );
}
