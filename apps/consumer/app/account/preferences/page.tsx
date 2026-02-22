"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    toast,
} from "@smart-menu/ui";
import { ArrowLeft, Moon, Sun, Globe, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Theme = "light" | "dark" | "system";
type Language = "pt" | "en" | "es";

export default function PreferencesPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [theme, setTheme] = useState<Theme>("system");
    const [language, setLanguage] = useState<Language>("pt");

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/login'); return; }
            const prefs = session.user.user_metadata?.preferences;
            if (prefs) {
                setTheme(prefs.theme || "system");
                setLanguage(prefs.language || "pt");
            }
            setLoading(false);
        };
        load();
    }, [supabase, router]);

    const savePrefs = async (newTheme: Theme, newLang: Language) => {
        setTheme(newTheme);
        setLanguage(newLang);
        const { error } = await supabase.auth.updateUser({
            data: { preferences: { theme: newTheme, language: newLang } }
        });
        if (error) {
            toast.error("Erro ao guardar preferência", { description: error.message });
        } else {
            toast.success("Preferência guardada!");
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
        { value: "light", label: "Claro", icon: Sun },
        { value: "dark", label: "Escuro", icon: Moon },
        { value: "system", label: "Sistema", icon: Globe },
    ];

    const languages: { value: Language; label: string; flag: string }[] = [
        { value: "pt", label: "Português", flag: "🇦🇴" },
        { value: "en", label: "English", flag: "🇬🇧" },
        { value: "es", label: "Español", flag: "🇪🇸" },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <div className="w-8 h-8 animate-spin text-orange-600 border-2 border-orange-600 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <AppShell className="bg-zinc-50 dark:bg-black min-h-screen">
            <PageContainer size="sm" className="pt-12 pb-24 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/account')}
                        className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        <span className="text-orange-700 dark:text-orange-400">Preferências</span>
                    </h1>
                    {saved && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />}
                </div>

                {/* Theme */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Tema</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map(t => (
                            <button key={t.value}
                                onClick={() => savePrefs(t.value, language)}
                                className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border transition-all active:scale-[0.97] ${
                                    theme === t.value
                                        ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400"
                                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-white/5 text-zinc-400"
                                }`}>
                                <t.icon className="w-6 h-6" />
                                <span className="text-xs font-bold">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Idioma</h3>
                    <div className="space-y-3">
                        {languages.map(l => (
                            <button key={l.value}
                                onClick={() => savePrefs(theme, l.value)}
                                className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all active:scale-[0.98] ${
                                    language === l.value
                                        ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
                                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-white/5"
                                }`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{l.flag}</span>
                                    <span className={`font-bold ${language === l.value ? "text-orange-700 dark:text-orange-400" : "text-zinc-600 dark:text-zinc-300"}`}>
                                        {l.label}
                                    </span>
                                </div>
                                {language === l.value && <CheckCircle className="w-5 h-5 text-orange-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            </PageContainer>
        </AppShell>
    );
}
