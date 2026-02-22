"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    Input,
    Label,
    toast,
} from "@smart-menu/ui";
import { ArrowLeft, Save, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/login'); return; }
            setForm({
                name: session.user.user_metadata?.full_name || "",
                email: session.user.email || "",
                phone: session.user.user_metadata?.phone || "",
            });
            setLoading(false);
        };
        load();
    }, [supabase, router]);

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: form.name, phone: form.phone }
        });
        setSaving(false);
        if (error) {
            toast.error("Erro ao guardar", { description: error.message });
        } else {
            setSaved(true);
            toast.success("Dados guardados com sucesso!");
            setTimeout(() => setSaved(false), 3000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
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
                        Dados <span className="text-orange-700 dark:text-orange-400">Pessoais</span>
                    </h1>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Nome Completo</Label>
                        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-white/5 text-lg font-medium" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email</Label>
                        <Input id="email" value={form.email} disabled
                            className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-zinc-100 dark:border-white/5 text-lg font-medium text-zinc-400" />
                        <p className="text-xs text-zinc-400 font-medium">O email não pode ser alterado.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Telefone</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+244 999 888 777"
                            className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-white/5 text-lg font-medium" />
                    </div>
                </div>

                <Button onClick={handleSave} disabled={saving}
                    className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base gap-2">
                    {saved ? <><CheckCircle className="w-5 h-5" /> Guardado!</> :
                     saving ? <><Loader2 className="w-5 h-5 animate-spin" /> A guardar...</> :
                     <><Save className="w-5 h-5" /> Guardar Alterações</>}
                </Button>
            </PageContainer>
        </AppShell>
    );
}
