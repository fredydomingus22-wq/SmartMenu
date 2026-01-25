"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@smart-menu/ui";
import { Input } from "@smart-menu/ui";
import { Label } from "@smart-menu/ui";
import { toast } from "sonner";
import { createLoyaltyReward, updateLoyaltyReward } from "@/app/actions/loyalty";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@smart-menu/ui";
import { Switch } from "@smart-menu/ui";
import { Textarea } from "@smart-menu/ui";
import { useEffect } from "react";
import { Reward } from "./loyalty-reward-list";

const rewardSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    description: z.string().optional(),
    pointsRequired: z.coerce.number().min(1, "Pontos mínimos: 1"),
    discountAmount: z.coerce.number().min(0).optional(),
    isActive: z.boolean().default(true),
    productId: z.string().optional().nullable(),
});

type RewardFormValues = z.infer<typeof rewardSchema>;

interface LoyaltyRewardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reward: Reward | null;
}

export function LoyaltyRewardDialog({ open, onOpenChange, reward }: LoyaltyRewardDialogProps) {
    const isEditing = !!reward;

    const form = useForm<RewardFormValues>({
        resolver: zodResolver(rewardSchema),
        defaultValues: {
            name: "",
            description: "",
            pointsRequired: 100,
            discountAmount: 0,
            isActive: true,
            productId: null,
        },
    });

    useEffect(() => {
        if (reward) {
            form.reset({
                name: reward.name,
                description: reward.description || "",
                pointsRequired: reward.pointsRequired,
                discountAmount: Number(reward.discountAmount) || 0,
                isActive: reward.isActive,
                productId: reward.productId,
            });
        } else {
            form.reset({
                name: "",
                description: "",
                pointsRequired: 100,
                discountAmount: 0,
                isActive: true,
                productId: null,
            });
        }
    }, [reward, form]);

    async function onSubmit(data: RewardFormValues) {
        try {
            let result;
            const payload = {
                ...data,
                productId: data.productId || null,
                discountAmount: Number(data.discountAmount) || 0,
            };

            if (isEditing) {
                result = await updateLoyaltyReward(reward.id, payload);
            } else {
                result = await createLoyaltyReward(payload);
            }

            if (result.success) {
                toast.success(isEditing ? "Recompensa atualizada!" : "Recompensa criada!");
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Erro ao salvar recompensa.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar Recompensa" : "Nova Recompensa"}</DialogTitle>
                        <DialogDescription>
                            Configure os detalhes do prêmio oferecido no programa de fidelidade.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Recompensa</Label>
                            <Input id="name" {...form.register("name")} placeholder="Ex: Sobremesa Grátis" />
                            {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" {...form.register("description")} placeholder="Opcional." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pointsRequired">Pontos Necessários</Label>
                                <Input id="pointsRequired" type="number" {...form.register("pointsRequired")} />
                                {form.formState.errors.pointsRequired && <p className="text-xs text-red-500">{form.formState.errors.pointsRequired.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discountAmount">Valor do Desconto (Kz)</Label>
                                <Input id="discountAmount" type="number" step="0.01" {...form.register("discountAmount")} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="isActive">Recompensa Ativa?</Label>
                            <Switch
                                id="isActive"
                                checked={form.watch("isActive")}
                                onCheckedChange={(checked: boolean) => form.setValue("isActive", checked)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {form.formState.isSubmitting ? "A guardar..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

