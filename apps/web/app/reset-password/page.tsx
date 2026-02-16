import { resetPassword } from '../actions/password';
import {
    Input,
    Label,
} from "@smart-menu/ui";
import { SubmitButton } from '@/components/submit-button';
import { ShieldCheck, Lock } from 'lucide-react';

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>;
}) {
    const { error, message } = await searchParams;

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-zinc-200/20 dark:shadow-none space-y-8">
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 mb-2">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Redefinir Senha
                        </h1>
                        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium">
                            Crie uma nova senha segura para a sua conta.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20 animate-in shake duration-500">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20">
                            {message}
                        </div>
                    )}

                    <form action={resetPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nova Senha</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                                />
                            </div>
                        </div>

                        <SubmitButton 
                            pendingText="Atualizando..." 
                            className="w-full h-12 sm:h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20"
                        >
                            Atualizar Senha
                        </SubmitButton>
                    </form>
                </div>

                <div className="flex items-center justify-center gap-2 text-zinc-400">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Conexão Segura AES-256</span>
                </div>
            </div>
        </div>
    );
}
