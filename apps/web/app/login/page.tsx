import { login, signup } from '../actions/auth';
import {
    Button,
    Input,
    Label,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@smart-menu/ui";
import { LoginMarketingSidebar } from './_components/login-marketing-sidebar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>;
}) {
    const { error, message } = await searchParams;

    return (
        <div className="flex min-h-screen bg-background">
            {/* Lado Esquerdo: Marketing (Visível apenas em Desktop) */}
            <div className="hidden lg:block w-[45%] border-r">
                <LoginMarketingSidebar />
            </div>

            {/* Lado Direito: Formulários */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-zinc-50 dark:bg-black">
                {/* Back Link Mobile */}
                <div className="absolute top-8 left-8 lg:left-12">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-orange-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar à página inicial
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase lg:hidden">
                            Smart<span className="text-orange-600">Menu.</span>
                        </h1>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Aceda à sua conta
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium">
                            Digite suas credenciais abaixo para entrar no painel.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20">
                            {message}
                        </div>
                    )}

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl h-14">
                            <TabsTrigger value="login" className="rounded-xl font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
                                Entrar
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-xl font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
                                Criar Conta
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="mt-6 space-y-4">
                            <form action={login} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail Profissional</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="gestao@restaurante.com"
                                            required
                                            className="h-12 rounded-xl bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Palavra-passe</Label>
                                            <Link href="/forgot-password" className="text-xs font-bold text-orange-600 hover:underline">Esqueceu a senha?</Link>
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="h-12 rounded-xl bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-bold shadow-xl shadow-orange-600/20 transition-all active:scale-[0.98]">
                                    Entrar no Painel
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup" className="mt-6 space-y-4">
                            <form action={signup} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurantName">Nome do Estabelecimento</Label>
                                        <Input
                                            id="restaurantName"
                                            name="restaurantName"
                                            placeholder="Ex: Luanda Grill"
                                            required
                                            className="h-12 rounded-xl bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">E-mail Profissional</Label>
                                        <Input
                                            id="reg-email"
                                            name="email"
                                            type="email"
                                            placeholder="gestao@restaurante.com"
                                            required
                                            className="h-12 rounded-xl bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password">Criar Senha Forte</Label>
                                        <Input
                                            id="reg-password"
                                            name="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            className="h-12 rounded-xl bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-bold shadow-xl shadow-orange-600/20 transition-all active:scale-[0.98]">
                                    Começar Teste Grátis
                                </Button>
                                <p className="text-[10px] text-center text-zinc-400 font-medium px-6 leading-relaxed">
                                    Ao clicar em continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                                </p>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer Brand (Mobile/Tablet) */}
                <div className="mt-12 text-center lg:hidden">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        SmartMenu v0.8.0-alpha • Angola
                    </p>
                </div>
            </div>
        </div>
    );
}
