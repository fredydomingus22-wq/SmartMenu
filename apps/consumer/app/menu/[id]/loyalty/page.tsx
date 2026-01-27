import { apiClient } from "@/utils/api-client-server";
import { Card, CardContent, AppShell, PageContainer, Button } from "@smart-menu/ui";
import { Gift, History, Star, ArrowLeft, Trophy, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { getAuthorizedClient } from "@/utils/auth-server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoyaltyRewardsClient } from "./_components/loyalty-rewards-client";
import { AnimatedCounter } from "./_components/animated-counter";

interface Reward {
    id: string;
    name: string;
    description: string | null;
    pointsRequired: number;
    isActive: boolean;
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    createdAt: string;
}

export default async function LoyaltyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: tenantId } = await params;
    const { token } = await getAuthorizedClient();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);

    let points = 0;
    let transactions: Transaction[] = [];
    let rewards: Reward[] = [];

    try {
        const [pointsData, transactionsData, rewardsData] = await Promise.all([
            apiClient.get<{ points: number }>(`/loyalty/my-points?tenantId=${tenantId}`, {
                cache: 'no-store',
                headers: authHeader
            }),
            apiClient.get<Transaction[]>(`/loyalty/my-transactions?tenantId=${tenantId}`, {
                cache: 'no-store',
                headers: authHeader
            }),
            apiClient.get<Reward[]>(`/loyalty/rewards/public?tenantId=${tenantId}`, { cache: 'no-store' })
        ]);
        points = pointsData.points;
        transactions = transactionsData;
        rewards = rewardsData;
    } catch (e) {
        console.error("Failed to fetch loyalty data", e);
        return (
            <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center bg-zinc-50 dark:bg-zinc-950">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full mb-6">
                    <Star className="h-12 w-12 text-amber-500 fill-amber-500" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Club de Pontos</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-xs mx-auto leading-relaxed">
                    Identifique-se para começar a acumular pontos e desbloquear sabores exclusivos.
                </p>
                <Button className="mt-8 h-12 px-8 font-black rounded-2xl w-full max-w-xs shadow-lg shadow-primary/20" asChild>
                    <Link href={`/login?tenantId=${tenantId}`}>Entrar agora</Link>
                </Button>
            </div>
        );
    }

    // Logic for next reward
    const sortedRewards = [...rewards].sort((a, b) => a.pointsRequired - b.pointsRequired);
    const nextReward = sortedRewards.find(r => r.pointsRequired > points);
    const progressToNext = nextReward ? (points / nextReward.pointsRequired) * 100 : 100;

    return (
        <AppShell
            className="bg-zinc-50 dark:bg-zinc-950"
            safeArea={true}
            header={
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 px-4 py-4">
                    <div className="max-w-xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/menu/${tenantId}`}>
                                <Button variant="ghost" size="icon" className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 h-10 w-10">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">Club Gourmet</h1>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-orange-600 mt-1">Status: Cliente VIP</p>
                            </div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-2xl">
                            <Trophy className="h-5 w-5 text-amber-500" />
                        </div>
                    </div>
                </header>
            }
        >
            <PageContainer size="sm" className="py-6 pb-24 space-y-8 px-4 sm:px-0">
                {/* Points Hero Section */}
                <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 text-white p-6 sm:p-8 shadow-2xl shadow-zinc-950/20 group">
                    {/* Abstract background shapes */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all duration-700" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 opacity-80">Saldo Acumulado</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl sm:text-6xl font-black italic tracking-tighter">
                                        <AnimatedCounter value={points} />
                                    </span>
                                    <span className="text-xl font-bold opacity-60">pts</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-amber-400 fill-amber-400" />
                            </div>
                        </div>

                        {nextReward && (
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end text-[10px] uppercase font-black tracking-widest text-orange-100/60">
                                    <span>Próximo Resgate: {nextReward.name}</span>
                                    <span>{Math.round(progressToNext)}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressToNext}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium italic">
                                    Faltam apenas {nextReward.pointsRequired - points} pontos para sua próxima delícia.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rewards Showcase */}
                <div className="space-y-6">
                    <div className="flex items-baseline justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Gift className="h-4 w-4 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-black tracking-tight">Vantagens Disponíveis</h2>
                        </div>
                    </div>

                    {rewards.length === 0 ? (
                        <Card className="border-dashed border-2 bg-transparent">
                            <CardContent className="py-12 text-center text-zinc-500">
                                <p className="font-medium italic">Em breve teremos novas recompensas para você!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <LoyaltyRewardsClient
                            rewards={rewards}
                            currentPoints={points}
                            tenantId={tenantId}
                        />
                    )}
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <History className="h-4 w-4 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-black tracking-tight">Atividade Recente</h2>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <Calendar className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
                            <p className="text-sm text-zinc-400 font-medium px-6">Sua jornada começa com seu próximo pedido.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map(tx => (
                                <div
                                    key={tx.id}
                                    className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${tx.amount > 0
                                            ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600'
                                            : 'bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400'
                                            }`}>
                                            {tx.amount > 0 ? <Zap className="h-5 w-5 fill-current" /> : <Gift className="h-5 w-5" />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-black text-xs text-zinc-900 dark:text-zinc-50 leading-tight">
                                                {tx.description || (tx.type === 'EARNED' ? 'Pontos Recebidos' : 'Resgate Efetuado')}
                                            </p>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                                {format(new Date(tx.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-black tracking-tighter text-lg tabular-nums ${tx.amount > 0 ? 'text-orange-600' : 'text-zinc-500'}`}>
                                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PageContainer>
        </AppShell>
    );
}


