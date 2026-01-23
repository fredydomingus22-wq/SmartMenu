import { createClient } from "@/utils/supabase/server";
import { getLoyaltyConfig, getLoyaltyRewards } from "@/app/actions/loyalty";
import { redirect } from "next/navigation";
import { LoyaltyConfigForm } from "./_components/loyalty-config-form";
import { LoyaltyRewardList, Reward } from "./_components/loyalty-reward-list";
import { Gift } from "lucide-react";

interface LoyaltyConfig {
    isActive: boolean;
    pointsPerUnit: number;
    currencyUnit: number;
}

export default async function LoyaltyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const tenantId = user.app_metadata?.tenant_id || user.user_metadata?.tenant_id || user.id;
    if (!tenantId) {
        return redirect("/dashboard");
    }

    const [config, rewards] = await Promise.all([
        getLoyaltyConfig(),
        getLoyaltyRewards(tenantId)
    ]) as [LoyaltyConfig | null, Reward[]];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Gestão de Fidelidade</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Configure as regras de pontuação e gerencie as recompensas para seus clientes.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                <LoyaltyConfigForm initialData={config} />
                <LoyaltyRewardList rewards={rewards || []} />
            </div>
        </div>
    );
}
