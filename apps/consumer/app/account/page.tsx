"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    Avatar,
    AvatarFallback,
} from "@smart-menu/ui";
import { User, ArrowLeft, LogOut, Shield, Settings, Bell, ChevronRight, Loader2, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "../actions/auth";

interface UserInfo {
    id: string;
    email: string;
    name?: string;
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.full_name
            });
            setLoading(false);
        };
        getSession();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await signOut();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    const menuItems = [
        { icon: User, label: "Dados Pessoais", desc: "Nome, email e telefone" },
        { icon: MapPin, label: "Meus Endereços", desc: "Para entregas e takeaway" },
        { icon: Bell, label: "Notificações", desc: "Alertas de pedidos e promoções" },
        { icon: Shield, label: "Segurança", desc: "Senha e autenticação" },
        { icon: Settings, label: "Preferências", desc: "Idioma e tema" },
    ];

    return (
        <AppShell className="bg-zinc-50 dark:bg-black min-h-screen">
            <PageContainer size="sm" className="pt-12 pb-24 space-y-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/')}
                        className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        Minha <span className="text-orange-700 dark:text-orange-400">Conta</span>
                    </h1>
                </div>

                {/* Profile Card */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="w-24 h-24 border-4 border-white dark:border-zinc-900 shadow-xl">
                        <AvatarFallback className="bg-orange-600 text-white text-3xl font-black italic">
                            {user?.name?.[0] || user?.email[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{user?.name || "Usuário"}</h2>
                        <p className="text-sm text-zinc-500 font-medium">{user?.email}</p>
                    </div>
                </div>

                {/* Menu List */}
                <div className="space-y-3">
                    {menuItems.map((item, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-orange-700 dark:group-hover:text-orange-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 transition-colors">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{item.label}</h4>
                                    <p className="text-xs text-zinc-400 font-medium">{item.desc}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-300" />
                        </motion.button>
                    ))}
                </div>

                {/* Sign Out Button */}
                <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full h-16 rounded-3xl bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 font-bold gap-3"
                >
                    <LogOut className="w-5 h-5" />
                    Encerrar Sessão
                </Button>

                {/* Version Info */}
                <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    SmartMenu v0.8.0-alpha • Angola
                </p>
            </PageContainer>

            {/* Footer Nav */}
            <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-6 right-6 h-16 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl flex items-center justify-around px-8 z-50">
                <button onClick={() => router.push('/')} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex flex-col items-center gap-1 transition-colors">
                    <User className="w-6 h-6" /> { /* Should be Scan but using User for visual test if icons are swapped */}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Scan</span>
                </button>
                <button onClick={() => router.push('/loyalty')} className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors">
                    <Star className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Pontos</span>
                </button>
                <button className="text-orange-700 dark:text-orange-400 flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-700 dark:border-orange-400 overflow-hidden bg-orange-700/10 dark:bg-orange-400/10 flex items-center justify-center">
                        <span className="text-[8px] font-black">{user?.name?.[0] || 'U'}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Conta</span>
                </button>
            </div>
        </AppShell>
    );
}
