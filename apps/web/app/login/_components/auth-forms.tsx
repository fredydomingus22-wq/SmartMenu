'use client';

import { useState, useEffect } from 'react';
import { login, signup } from '../../actions/auth';
import {
    Input,
    Label,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@smart-menu/ui";
import { SubmitButton } from '@/components/submit-button';
import Link from 'next/link';

interface AuthFormsProps {
    error?: string;
    message?: string;
}

export function AuthForms({ error, message }: AuthFormsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full space-y-8">
                <div className="h-12 bg-zinc-200/50 dark:bg-zinc-900 rounded-xl animate-pulse" />
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                        <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-zinc-200/50 dark:bg-zinc-900 rounded-xl h-12">
                <TabsTrigger value="login" className="rounded-lg font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
                    Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
                    Criar Conta
                </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-8">
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
                                className="h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Palavra-passe</Label>
                                <Link href="/forgot-password" title="Recuperar senha" className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                    Esqueceu-se da senha?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                            />
                        </div>
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
                    <SubmitButton 
                        pendingText="Acedendo..." 
                        className="w-full h-12 sm:h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20"
                    >
                        Entrar no Sistema
                    </SubmitButton>
                </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-8">
                <form action={signup} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="restaurantName">Nome do Restaurante</Label>
                            <Input
                                id="restaurantName"
                                name="restaurantName"
                                placeholder="Ex: Luanda Grill"
                                required
                                className="h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
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
                                className="h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reg-password">Palavra-passe</Label>
                            <Input
                                id="reg-password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Mínimo 6 caracteres"
                                className="h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-orange-600/20"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20 animate-in shake duration-500">
                            {error}
                        </div>
                    )}
                    <SubmitButton 
                        pendingText="Criando conta..." 
                        className="w-full h-12 sm:h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20"
                    >
                        Criar Conta Agora
                    </SubmitButton>
                    <p className="text-[10px] text-center text-zinc-400 font-medium px-4 leading-relaxed">
                        Ao clicar em continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                    </p>
                </form>
            </TabsContent>
        </Tabs>
    );
}
