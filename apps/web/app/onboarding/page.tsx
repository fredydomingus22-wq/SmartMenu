
import { OnboardingWizard } from "./_components/onboarding-wizard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Quick check if already onboarded (secondary check to middleware)
    if (user.user_metadata?.organization_id) {
        return redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Bem-vindo ao Smart<span className="text-orange-600">Menu</span>
                    </h1>
                    <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                        Vamos configurar o seu restaurante em poucos passos.
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <OnboardingWizard />
                </div>
            </div>
        </div>
    );
}
