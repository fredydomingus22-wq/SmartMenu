"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateBranding } from "@/app/actions/settings";
import { Palette, Type, Square, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";

const brandingSchema = z.object({
    tenantName: z.string().optional(),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
    secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional().or(z.literal("")),
    borderRadius: z.string().optional(),
    fontFamily: z.string().optional(),
});

export type BrandingData = {
    tenantName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    borderRadius?: string;
    fontFamily?: string;
};

type BrandingFormValues = z.infer<typeof brandingSchema>;

interface BrandingFormProps {
    initialData: BrandingData | null;
}

export function BrandingForm({ initialData }: BrandingFormProps) {
    const previewScale = 0.8;

    const form = useForm<BrandingFormValues>({
        resolver: zodResolver(brandingSchema),
        defaultValues: {
            tenantName: initialData?.tenantName || "",
            primaryColor: initialData?.primaryColor || "#2563EB",
            secondaryColor: initialData?.secondaryColor || "#F97316",
            borderRadius: initialData?.borderRadius || "0.5rem",
            fontFamily: initialData?.fontFamily || "Inter",
        },
    });

    const watchedValues = form.watch();

    async function onSubmit(data: BrandingFormValues) {
        try {
            const result = await updateBranding(data);
            if (result.success) {
                toast.success("Identidade visual personalizada!");
            } else {
                toast.error(result.error || "Erro ao atualizar branding.");
            }
        } catch (error) {
            console.error("Branding form error:", error);
            toast.error("Erro inesperado ao salvar.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
                {/* Cores */}
                <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Palette className="h-5 w-5 text-orange-600" />
                            Cores da Marca
                        </CardTitle>
                        <CardDescription> Defina as cores principais do seu menu digital. </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Cor Primária</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        id="primaryColor"
                                        {...form.register("primaryColor")}
                                        className="w-12 h-10 p-1 rounded-md"
                                    />
                                    <Input
                                        {...form.register("primaryColor")}
                                        placeholder="#000000"
                                        className="font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        id="secondaryColor"
                                        {...form.register("secondaryColor")}
                                        className="w-12 h-10 p-1 rounded-md"
                                    />
                                    <Input
                                        {...form.register("secondaryColor")}
                                        placeholder="#000000"
                                        className="font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Estilo Visual */}
                <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Square className="h-5 w-5 text-orange-600" />
                            Estilo das Bordas
                        </CardTitle>
                        <CardDescription> Ajuste quão arrendondados serão os elementos. </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <Label>Raio da Borda ({watchedValues.borderRadius})</Label>
                            </div>
                            <Slider
                                value={[parseInt(watchedValues.borderRadius?.replace("px", "") || "8") || 0]}
                                max={24}
                                step={2}
                                onValueChange={(vals) => form.setValue("borderRadius", `${vals[0]}px`)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tipografia */}
                <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Type className="h-5 w-5 text-orange-600" />
                            Tipografia
                        </CardTitle>
                        <CardDescription> Escolha a fonte que melhor representa seu negócio. </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fontFamily">Familia de Fonte</Label>
                            <select
                                id="fontFamily"
                                {...form.register("fontFamily")}
                                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                                <option value="Inter">Inter (Padrão)</option>
                                <option value="Roboto">Roboto (Moderno)</option>
                                <option value="Playfair Display">Playfair Display (Elegante)</option>
                                <option value="Montserrat">Montserrat (Geométrico)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]">
                        {form.formState.isSubmitting ? "A guardar..." : "Salvar Identidade"}
                    </Button>
                </div>
            </div>

            {/* Preview Lateral */}
            <div className="sticky top-8 h-fit">
                <Card className="overflow-hidden border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl">
                    <CardHeader className="bg-white dark:bg-zinc-950 border-b">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                            <LayoutTemplate className="h-4 w-4" />
                            Live Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex justify-center items-center h-[500px] overflow-hidden bg-zinc-200/50 dark:bg-zinc-800/50">
                        <motion.div
                            style={{
                                scale: previewScale,
                                borderRadius: watchedValues.borderRadius,
                                fontFamily: watchedValues.fontFamily
                            }}
                            className="w-[320px] bg-white dark:bg-black shadow-2xl overflow-hidden pointer-events-none"
                        >
                            {/* Mock Menu Interface */}
                            <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative">
                                <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: watchedValues.primaryColor }} />
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold">Hamburguer Premium</h4>
                                    <p className="text-xs text-zinc-500">Pão brioche, carne Angus 180g, queijo cheddar...</p>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xl font-black" style={{ color: watchedValues.primaryColor }}>{formatCurrency(1250)}</span>
                                    <div
                                        className="px-6 py-2 text-white text-xs font-bold"
                                        style={{
                                            backgroundColor: watchedValues.primaryColor,
                                            borderRadius: watchedValues.borderRadius
                                        }}
                                    >
                                        ADICIONAR
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-dashed">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: watchedValues.secondaryColor }} />
                                        <span className="text-[10px] font-medium uppercase tracking-tighter" style={{ color: watchedValues.secondaryColor }}>
                                            Destaque da Semana
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
