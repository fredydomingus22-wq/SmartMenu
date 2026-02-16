import { forgotPassword } from '../actions/password';
import {
    Input,
    Label,
} from "@smart-menu/ui";
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>;
}) {
    const { error, message } = await searchParams;

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Back Link */}
                <div className="flex justify-start">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-orange-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar ao login
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-zinc-200/20 dark:shadow-none space-y-8">
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 mb-2">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Recuperar Senha
                        </h1>
                        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium px-4">
                            Introduza o seu e-mail e enviaremos instruções para redefinir a sua senha.
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

                    <form action={forgotPassword} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-xs uppercase tracking-wider text-zinc-500 ml-1">
                                E-mail Profissional
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="gestao@restaurante.com"
                                required
                                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                            />
                        </div>

                        <SubmitButton 
                            pendingText="Enviando..." 
                            className="w-full h-12 sm:h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20"
                        >
                            Enviar Link de Recuperação
                        </SubmitButton>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-400 font-medium opacity-60">
                    SmartMenu v0.8 • Apoio ao Cliente disponível
                </p>
            </div>
        </div>
    );
}
