"use client";

import { useState } from "react";
import { Card, Button } from "@smart-menu/ui";
import { Gift, Star, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Reward {
    id: string;
    name: string;
    description: string | null;
    pointsRequired: number;
    isActive: boolean;
}

interface LoyaltyRewardsClientProps {
    rewards: Reward[];
    currentPoints: number;
    tenantId: string;
}

export function LoyaltyRewardsClient({ rewards, currentPoints: initialPoints, tenantId }: LoyaltyRewardsClientProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [points, setPoints] = useState(initialPoints);
    const [redeemingId, setRedeemingId] = useState<string | null>(null);
    const supabase = createClient();

    const handleRedeem = async (reward: Reward) => {
        try {
            setRedeemingId(reward.id);
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                toast.error(t('menu.loyalty_locked'));
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/loyalty/redeem/${reward.id}?tenantId=${tenantId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || t('menu.redeem_error'));
            }

            // Success!
            toast.success(t('menu.redeem_success'), {
                description: reward.name,
                icon: <CheckCircle2 className="h-5 w-5 text-orange-500" />
            });

            // Deduct points locally for immediate feedback
            setPoints(prev => prev - reward.pointsRequired);

            // Refresh the server-side data
            router.refresh();

        } catch (error: unknown) {
            console.error("Redemption failed:", error);
            const message = error instanceof Error ? error.message : t('menu.redeem_error');
            toast.error(message);
        } finally {
            setRedeemingId(null);
        }
    };

    return (
        <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
                {rewards.map((reward, index) => {
                    const canAfford = points >= reward.pointsRequired;
                    const progress = Math.min(100, (points / reward.pointsRequired) * 100);
                    const isRedeeming = redeemingId === reward.id;

                    return (
                        <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`overflow-hidden border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all ${canAfford ? 'ring-2 ring-orange-500/10 shadow-lg shadow-orange-500/5' : ''}`}>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                                {reward.name}
                                                {canAfford && (
                                                    <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                                                )}
                                            </h3>
                                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                                {reward.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <div className={`flex items-center gap-1 font-black text-xs uppercase tracking-wider ${canAfford ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-400'}`}>
                                                <Star className={`h-3 w-3 ${canAfford ? 'fill-orange-500 text-orange-500' : ''}`} />
                                                {reward.pointsRequired}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full bg-gradient-to-r from-amber-400 to-orange-600`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                            <span className={canAfford ? 'text-orange-600' : 'text-zinc-400'}>
                                                {canAfford ? 'Disponível!' : `${reward.pointsRequired - points} pts faltantes`}
                                            </span>
                                            <span className="text-zinc-400">
                                                {Math.round(progress)}%
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        className={`w-full font-bold h-10 transition-all ${canAfford
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md active:scale-95'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed grayscale'
                                            }`}
                                        disabled={!canAfford || isRedeeming}
                                        onClick={() => handleRedeem(reward)}
                                    >
                                        {isRedeeming ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : canAfford ? (
                                            <span className="flex items-center gap-2">
                                                <Gift className="h-4 w-4" />
                                                {t('menu.redeem_button')}
                                            </span>
                                        ) : (
                                            t('menu.insufficient_points')
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
