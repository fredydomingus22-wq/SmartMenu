"use client";

import { Button } from "@smart-menu/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@smart-menu/ui";
import { Plus, Trash2, Edit2, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteLoyaltyReward } from "@/app/actions/loyalty";
import { LoyaltyRewardDialog } from "./loyalty-reward-dialog";
import { Badge } from "@smart-menu/ui";
import { formatCurrency } from "@/lib/utils";

export interface Reward {
    id: string;
    name: string;
    description: string | null;
    pointsRequired: number;
    discountAmount: number | string | null;
    isActive: boolean;
    productId: string | null;
}

interface LoyaltyRewardListProps {
    rewards: Reward[];
}

export function LoyaltyRewardList({ rewards }: LoyaltyRewardListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

    async function handleDelete(id: string) {
        if (!confirm("Tem a certeza que deseja excluir esta recompensa?")) return;

        try {
            const result = await deleteLoyaltyReward(id);
            if (result.success) {
                toast.success("Recompensa excluída!");
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Erro ao excluir recompensa.");
        }
    }

    return (
        <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">Catálogo de Recompensas</CardTitle>
                    <CardDescription>
                        Prêmios que seus clientes podem resgatar com pontos.
                    </CardDescription>
                </div>
                <Button
                    onClick={() => {
                        setSelectedReward(null);
                        setIsDialogOpen(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                >
                    <Plus className="h-4 w-4" /> Nova Recompensa
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    {rewards.length === 0 ? (
                        <div className="col-span-2 py-10 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                            <Gift className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
                            <p className="text-sm text-zinc-500 font-medium">Nenhuma recompensa criada ainda.</p>
                        </div>
                    ) : (
                        rewards.map((reward) => (
                            <div
                                key={reward.id}
                                className="group relative border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 transition-all hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/30 bg-white dark:bg-zinc-900"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{reward.name}</h4>
                                            {!reward.isActive && (
                                                <Badge variant="outline" className="text-[10px] uppercase border-zinc-200 text-zinc-400">Inativo</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 line-clamp-2">{reward.description || "Sem descrição."}</p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-blue-600"
                                            onClick={() => {
                                                setSelectedReward(reward);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-red-600"
                                            onClick={() => handleDelete(reward.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-1.5 font-black text-orange-600">
                                        <span className="text-lg">{reward.pointsRequired}</span>
                                        <span className="text-[10px] uppercase tracking-tighter">Pontos</span>
                                    </div>
                                    {Number(reward.discountAmount) > 0 && (
                                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                            -{formatCurrency(reward.discountAmount || 0)} Desconto
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>

            <LoyaltyRewardDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                reward={selectedReward}
            />
        </Card>
    );
}
