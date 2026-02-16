import { resendConfirmationEmail } from '../actions/password';
import { SubmitButton } from '@/components/submit-button';
import { MailCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ConfirmEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string; error?: string; message?: string }>;
}) {
    const { email, error, message } = await searchParams;

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-zinc-200/20 dark:shadow-none space-y-8">
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 mb-2 relative">
                            <MailCheck className="w-10 h-10" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full border-4 border-white dark:border-zinc-950" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                Verifique o seu e-mail
                            </h1>
                            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium">
                                Enviámos um link de confirmação para:
                            </p>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 break-all bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-lg inline-block text-sm sm:text-base">
                                {email || 'seu e-mail'}
                            </p>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed px-4">
                            Por favor, clique no botão dentro do e-mail para validar a sua conta e começar a configurar o seu restaurante.
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

                    <div className="space-y-4">
                        <form action={resendConfirmationEmail}>
                            <input type="hidden" name="email" value={email || ''} />
                            <SubmitButton 
                                variant="outline"
                                pendingText="Reenviando..."
                                className="w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold transition-all active:scale-[0.98]"
                            >
                                Reenviar E-mail de Confirmação
                            </SubmitButton>
                        </form>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 hover:text-orange-600 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Voltar ao login
                        </Link>
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <p className="text-[10px] sm:text-xs text-zinc-400 font-medium opacity-60">
                        Não recebeu o e-mail? Verifique a pasta de Spam.
                    </p>
                </div>
            </div>
        </div>
    );
}
