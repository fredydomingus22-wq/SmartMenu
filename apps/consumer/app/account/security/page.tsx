"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    Input,
    Label,
    toast,
} from "@smart-menu/ui";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SecurityPage() {
    const router = useRouter();
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    const handleSave = async () => {
        setError("");
        
        if (!form.currentPassword) {
            setError("Por favor, introduza a sua senha atual.");
            return;
        }
        if (form.newPassword.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        
        setSaving(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
            setError("Sessão inválida. Por favor, faça login novamente.");
            setSaving(false);
            return;
        }

        // Verify current password
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: session.user.email,
            password: form.currentPassword,
        });

        if (verifyError) {
            setSaving(false);
            setError("Senha atual incorreta.");
            toast.error("Erro de validação", { description: "A senha atual está incorreta." });
            return;
        }

        const { error: err } = await supabase.auth.updateUser({ password: form.newPassword });
        setSaving(false);
        if (err) {
            setError(err.message);
            toast.error("Erro ao alterar senha", { description: err.message });
        } else {
            setSaved(true);
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Senha alterada com sucesso!");
            setTimeout(() => setSaved(false), 3000);
        }
    };

    return (
        <AppShell className="bg-zinc-50 dark:bg-black min-h-screen">
            <PageContainer size="sm" className="pt-12 pb-24 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/account')}
                        className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        <span className="text-orange-700 dark:text-orange-400">Segurança</span>
                    </h1>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-orange-700 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Alterar Senha</h3>
                            <p className="text-xs text-zinc-400">Mínimo de 8 caracteres</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password" className="text-sm font-bold">Senha Atual</Label>
                            <Input id="current-password" type="password"
                                value={form.currentPassword}
                                onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                className="h-14 rounded-2xl" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2 border-t border-zinc-100 dark:border-white/5 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password" className="text-sm font-bold">Nova Senha</Label>
                                <div className="relative">
                                    <Input id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.newPassword}
                                        onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                        className="h-14 rounded-2xl pr-12" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="text-sm font-bold">Confirmar Senha</Label>
                                <Input id="confirm-password" type="password"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="h-14 rounded-2xl" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>
                    )}
                </div>

                <Button onClick={handleSave} disabled={saving || !form.newPassword}
                    className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base gap-2">
                    {saved ? <><CheckCircle className="w-5 h-5" /> Senha Alterada!</> :
                     saving ? <><Loader2 className="w-5 h-5 animate-spin" /> A guardar...</> :
                     <><Lock className="w-5 h-5" /> Alterar Senha</>}
                </Button>
            </PageContainer>
        </AppShell>
    );
}
