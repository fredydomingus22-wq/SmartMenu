"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    Button,
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@smart-menu/ui";
import { Star, ArrowLeft, Gift, ChevronRight, Loader2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface LoyaltyProfile {
    id: string;
    pointsBalance: number;
    tenant: {
        id: string;
        name: string;
        slug: string;
        images: string[];
    };
}

export default function LoyaltyHubPage() {
    const router = useRouter();
    const [profiles, setProfiles] = useState<LoyaltyProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPoints, setTotalPoints] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                const res = await fetch(`${apiUrl}/loyalty/my-profiles`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfiles(data);
                    setTotalPoints(data.reduce((acc: number, curr: LoyaltyProfile) => acc + curr.pointsBalance, 0));
                }
            } catch (err) {
                console.error("Failed to fetch loyalty profiles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [supabase, router]);

    if (loading) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-orange-700 dark:text-orange-400" />
            </div>
        );
    }

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
                        Clube de <span className="text-orange-700 dark:text-orange-400">Pontos</span>
                    </h1>
                </div>

                {/* Global Stats Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                        <Trophy className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative space-y-1">
                        <span className="text-sm font-bold uppercase tracking-widest text-white/70">Saldo Total na Rede</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black italic tracking-tighter">{totalPoints}</span>
                            <span className="text-xl font-bold opacity-80">pontos</span>
                        </div>
                        <p className="text-sm font-medium text-white/60 pt-2">
                            Você é membro de {profiles.length} estabelecimentos.
                        </p>
                    </div>
                </motion.div>

                {/* Restaurants List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Meus Restaurantes</h3>
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center">
                            <Gift className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {profiles.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 space-y-4"
                                >
                                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
                                        <Star className="w-8 h-8" />
                                    </div>
                                    <p className="text-zinc-500 font-medium">Você ainda não acumulou pontos em nenhum restaurante.</p>
                                    <Button onClick={() => router.push('/')} variant="outline" className="rounded-2xl">
                                        Explorar Restaurantes
                                    </Button>
                                </motion.div>
                            ) : (
                                profiles.map((profile, idx) => (
                                    <motion.button
                                        key={profile.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => router.push(`/menu/${profile.tenant.id}/loyalty`)}
                                        className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <Avatar className="w-14 h-14 border-2 border-orange-500/10">
                                                <AvatarImage src={profile.tenant.images?.[0]} alt={profile.tenant.name} />
                                                <AvatarFallback className="bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold">{profile.tenant.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{profile.tenant.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                                                    <span className="text-sm font-black text-orange-700 dark:text-orange-400">
                                                        {profile.pointsBalance} <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter ml-0.5">pontos</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-orange-700 dark:group-hover:text-orange-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Marketing / Flywheel Section */}
                <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white space-y-4 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl" />
                    <h4 className="text-lg font-bold tracking-tight relative">Como ganhar mais pontos?</h4>
                    <ul className="space-y-3 relative">
                        {[
                            "Faça pedidos em seus restaurantes favoritos.",
                            "Escaneie o QR Code na mesa em cada visita.",
                            "Convide amigos para usar o SmartMenu."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-sm text-zinc-400 font-medium">
                                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-orange-500 font-bold shrink-0">{i + 1}</div>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </PageContainer>

            {/* Footer Nav */}
            <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-6 right-6 h-16 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl flex items-center justify-around px-8 z-50">
                <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors">
                    <Star className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Scan</span>
                </button>
                <button className="text-orange-700 dark:text-orange-400 flex flex-col items-center gap-1">
                    <Star className="w-6 h-6 fill-orange-700/20 dark:fill-orange-400/20" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Pontos</span>
                </button>
                <button onClick={() => router.push('/account')} className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors">
                    <Avatar className="w-6 h-6 border border-zinc-200">
                        <AvatarFallback className="text-[8px]">U</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Conta</span>
                </button>
            </div>
        </AppShell>
    );
}
