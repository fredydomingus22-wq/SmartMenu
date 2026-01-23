"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { updateLoyaltyConfig } from "@/app/actions/loyalty";
import { Gift, Info, Coins } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const configSchema = z.object({
    isActive: z.boolean(),
    pointsPerUnit: z.coerce.number().min(0),
    currencyUnit: z.coerce.number().min(0.01),
});

type ConfigFormValues = z.infer<typeof configSchema>;

interface LoyaltyConfigFormProps {
    initialData: {
        isActive?: boolean;
        pointsPerUnit?: string | number;
        currencyUnit?: string | number;
    } | null;
}

export function LoyaltyConfigForm({ initialData }: LoyaltyConfigFormProps) {
    const form = useForm<ConfigFormValues>({
        resolver: zodResolver(configSchema),
        defaultValues: {
            isActive: initialData?.isActive ?? false,
            pointsPerUnit: initialData?.pointsPerUnit ? Number(initialData.pointsPerUnit) : 1,
            currencyUnit: initialData?.currencyUnit ? Number(initialData.currencyUnit) : 1,
        },
    });

    async function onSubmit(data: ConfigFormValues) {
        try {
            const result = await updateLoyaltyConfig(data);
            if (result.success) {
                toast.success("Configurações de fidelidade atualizadas!");
            } else {
                toast.error(result.error || "Erro ao atualizar configuração.");
            }
        } catch {
            toast.error("Erro inesperado ao salvar.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Gift className="h-5 w-5 text-orange-600" />
                                Programa de Fidelidade
                            </CardTitle>
                            <CardDescription>
                                Ative e configure como seus clientes ganham pontos.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={form.watch("isActive")}
                            onCheckedChange={(checked: boolean) => form.setValue("isActive", checked)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="currencyUnit">Valor em Dinheiro (Ex: {formatCurrency(1)})</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">Kz</span>
                                <Input
                                    id="currencyUnit"
                                    type="number"
                                    step="0.01"
                                    className="pl-10"
                                    {...form.register("currencyUnit")}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <Info className="h-3 w-3" /> Valor base para cálculo.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pointsPerUnit">Pontos Ganhos</Label>
                            <div className="relative">
                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input
                                    id="pointsPerUnit"
                                    type="number"
                                    className="pl-10"
                                    {...form.register("pointsPerUnit")}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <Info className="h-3 w-3" /> Pontos acumulados por cada unidade monetária.
                            </p>
                        </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 p-4 rounded-lg">
                        <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                            Regra Atual: <span className="font-bold underline">{formatCurrency(form.watch("currencyUnit") || 0)} = {form.watch("pointsPerUnit")} pontos</span>
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                            Um pedido de {formatCurrency(1000)} gerará {(1000 / (Number(form.watch("currencyUnit")) || 1) * Number(form.watch("pointsPerUnit"))).toFixed(0)} pontos.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {form.formState.isSubmitting ? "A guardar..." : "Salvar Configuração"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
