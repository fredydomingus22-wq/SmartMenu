import { apiClient } from "@/utils/api-client-server";
import { Card, CardContent, CardHeader, CardTitle } from "@smart-menu/ui";
import { Button } from "@smart-menu/ui";
import { Gift, History, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAuthorizedClient } from "@/utils/auth-server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    const { id } = await params;
    const { token } = await getAuthorizedClient();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);

    let points = 0;
    let transactions: Transaction[] = [];
    let rewards: Reward[] = [];

    try {
        const [pointsData, transactionsData, rewardsData] = await Promise.all([
            apiClient.get<number>('/loyalty/my-points', {
                cache: 'no-store',
                headers: authHeader
            }),
            apiClient.get<Transaction[]>('/loyalty/my-transactions', {
                cache: 'no-store',
                headers: authHeader
            }),
            apiClient.get<Reward[]>(`/loyalty/rewards/public?tenantId=${id}`, { cache: 'no-store' })
        ]);
        points = pointsData;
        transactions = transactionsData;
        rewards = rewardsData;
    } catch {
        // If not logged in or other error, we might want to redirect to login
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <Star className="h-16 w-16 text-amber-300 mb-4" />
                <h1 className="text-2xl font-bold">Club de Pontos</h1>
                <p className="text-muted-foreground mt-2">Você precisa estar logado para ver seus pontos.</p>
                <Button className="mt-6" asChild>
                    <Link href="/login">Entrar agora</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-10 px-4 py-4">
                <div className="max-w-xl mx-auto flex items-center gap-4">
                    <Link href={`/menu/${id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold">Fidelidade</h1>
                </div>
            </header>

            <main className="max-w-xl mx-auto p-4 space-y-6">
                {/* Points Balance */}
                <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-amber-100 uppercase text-xs tracking-widest font-bold">Saldo Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Star className="h-10 w-10 fill-current" />
                            <span className="text-5xl font-black">{points}</span>
                            <span className="text-xl opacity-80 font-medium">pontos</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Rewards List */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-bold">Recompensas Disponíveis</h2>
                    </div>
                    {rewards.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Nenhuma recompensa disponível no momento.</p>
                    ) : (
                        <div className="grid gap-4">
                            {rewards.map(reward => (
                                <Card key={reward.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                                    <div className="flex p-4 items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold">{reward.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{reward.description}</p>
                                            <div className="flex items-center gap-1 mt-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                                                <Star className="h-3 w-3 fill-current" />
                                                {reward.pointsRequired} pontos
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={points >= reward.pointsRequired ? "default" : "secondary"}
                                            disabled={points < reward.pointsRequired}
                                        >
                                            Resgatar
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* History */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-zinc-500" />
                        <h2 className="text-lg font-bold">Histórico</h2>
                    </div>
                    {transactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Nenhuma movimentação ainda.</p>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y dark:divide-zinc-800">
                            {transactions.map(tx => (
                                <div key={tx.id} className="p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-sm">{tx.description || tx.type}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(tx.createdAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <span className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
