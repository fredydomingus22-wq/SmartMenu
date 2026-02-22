"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    toast,
} from "@smart-menu/ui";
import { ArrowLeft, Bell, ShoppingBag, Tag, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface NotificationPrefs {
    orders: boolean;
    promotions: boolean;
    loyalty: boolean;
}

export default function NotificationsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [prefs, setPrefs] = useState<NotificationPrefs>({ orders: true, promotions: true, loyalty: true });

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/login'); return; }
            const saved = session.user.user_metadata?.notification_prefs;
            if (saved) setPrefs(saved);
            setLoading(false);
        };
        load();
    }, [supabase, router]);

    const toggle = async (key: keyof NotificationPrefs) => {
        const updated = { ...prefs, [key]: !prefs[key] };
        setPrefs(updated);
        const { error } = await supabase.auth.updateUser({ data: { notification_prefs: updated } });
        if (error) {
            toast.error("Erro ao atualizar", { description: error.message });
        } else {
            toast.success(updated[key] ? "Notificação ativada" : "Notificação desativada");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
    );

    const items = [
        { key: "orders" as const, icon: ShoppingBag, label: "Pedidos", desc: "Atualizações de status dos seus pedidos" },
        { key: "promotions" as const, icon: Tag, label: "Promoções", desc: "Ofertas e descontos dos restaurantes" },
        { key: "loyalty" as const, icon: Bell, label: "Fidelidade", desc: "Pontos acumulados e recompensas" },
    ];

    return (
        <AppShell className="bg-zinc-50 dark:bg-black min-h-screen">
            <PageContainer size="sm" className="pt-12 pb-24 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/account')}
                        className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        <span className="text-orange-700 dark:text-orange-400">Notificações</span>
                    </h1>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => toggle(item.key)}
                            className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                    prefs[item.key] 
                                        ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400" 
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                }`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{item.label}</h4>
                                    <p className="text-xs text-zinc-400 font-medium">{item.desc}</p>
                                </div>
                            </div>
                            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                                prefs[item.key] ? "bg-orange-600" : "bg-zinc-200 dark:bg-zinc-700"
                            }`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                                    prefs[item.key] ? "translate-x-5" : "translate-x-0"
                                }`} />
                            </div>
                        </button>
                    ))}
                </div>

                <p className="text-center text-xs text-zinc-400 font-medium">
                    As notificações push requerem permissão do navegador.
                </p>
            </PageContainer>
        </AppShell>
    );
}
