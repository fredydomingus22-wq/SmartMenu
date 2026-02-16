import { LoginMarketingSidebar } from './_components/login-marketing-sidebar';
import { AuthForms } from './_components/auth-forms';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>;
}) {
    const { error, message } = await searchParams;

    return (
        <div className="flex min-h-screen bg-background overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-[40%] xl:w-[45%] border-r relative z-10">
                <LoginMarketingSidebar />
            </div>

            {/* Main Auth Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 bg-zinc-50 dark:bg-black relative">
                {/* Back Navigation */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-orange-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Página Inicial</span>
                    </Link>
                </div>

                <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center lg:text-left space-y-2">
                        {/* Mobile Logo Only */}
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase lg:hidden mb-6">
                            Smart<span className="text-orange-600">Menu.</span>
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Painel Administrativo
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-500 font-medium">
                            Inicie sessão para gerir o seu restaurante e pedidos.
                        </p>
                    </div>

                    <AuthForms error={error} message={message} />
                </div>

                {/* Footer Brand (Mobile/Tablet) */}
                <div className="mt-12 text-center lg:hidden">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] opacity-60">
                        SmartMenu v0.8.0 • Tech in Luanda
                    </p>
                </div>
            </div>
        </div>
    );
}

