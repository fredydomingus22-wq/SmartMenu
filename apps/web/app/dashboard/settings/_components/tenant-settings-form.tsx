"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@smart-menu/ui";
import { Input } from "@smart-menu/ui";
import { Textarea } from "@smart-menu/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@smart-menu/ui";
import { Label } from "@smart-menu/ui";
import { toast } from "sonner";
import { updateTenantProfile } from "@/app/actions/settings";
import { Building2, Globe, ShoppingBag, Instagram, Facebook } from "lucide-react";

const tenantSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    description: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().url("URL inválida. Certifique-se de incluir http:// ou https://").optional().or(z.literal("")),
    fiscalName: z.string().optional(),
    nif: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantSettingsFormProps {
    initialData: {
        name?: string;
        description?: string;
        address?: string;
        city?: string;
        phone?: string;
        email?: string;
        whatsapp?: string;
        instagram?: string;
        facebook?: string;
        website?: string;
        fiscalName?: string;
        nif?: string;
    };
}

export function TenantSettingsForm({ initialData }: TenantSettingsFormProps) {
    const form = useForm<TenantFormValues>({
        resolver: zodResolver(tenantSchema),
        defaultValues: {
            name: initialData.name || "",
            description: initialData.description || "",
            address: initialData.address || "",
            city: initialData.city || "",
            phone: initialData.phone || "",
            email: initialData.email || "",
            whatsapp: initialData.whatsapp || "",
            instagram: initialData.instagram || "",
            facebook: initialData.facebook || "",
            website: initialData.website || "",
            fiscalName: initialData.fiscalName || "",
            nif: initialData.nif || "",
        },
    });

    async function onSubmit(data: TenantFormValues) {
        console.log("[TenantSettingsForm] Submitting data:", data);
        try {
            const result = await updateTenantProfile(data);
            if (result.success) {
                toast.success("Perfil do restaurante atualizado com sucesso!");
            } else {
                console.error("[TenantSettingsForm] Update failed:", result.error);
                toast.error(result.error || "Erro ao atualizar o perfil.");
            }
        } catch (error) {
            console.error("[TenantSettingsForm] Error in onSubmit:", error);
            toast.error("Ocorreu um erro inesperado ao salvar.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Informações Básicas */}
                <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Store className="h-5 w-5 text-orange-600" />
                            Informações do Restaurante
                        </CardTitle>
                        <CardDescription>
                            Dados públicos que aparecerão no seu menu digital.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Restaurante</Label>
                            <Input id="name" {...form.register("name")} />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição / Slogan</Label>
                            <Textarea id="description" {...form.register("description")} placeholder="Ex: O melhor grelhado da cidade" />
                            {form.formState.errors.description && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.description.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input id="city" {...form.register("city")} />
                                {form.formState.errors.city && (
                                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.city.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone de Contacto</Label>
                                <Input id="phone" {...form.register("phone")} />
                                {form.formState.errors.phone && (
                                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.phone.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <Input id="address" {...form.register("address")} />
                            {form.formState.errors.address && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.address.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Dados Fiscais */}
                <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Building2 className="h-5 w-5 text-orange-600" />
                            Dados Fiscais
                        </CardTitle>
                        <CardDescription>
                            Informações para facturação e identificação legal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fiscalName">Razão Social / Nome Fiscal</Label>
                            <Input id="fiscalName" {...form.register("fiscalName")} />
                            {form.formState.errors.fiscalName && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.fiscalName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nif">NIF / Número de Contribuinte</Label>
                            <Input id="nif" {...form.register("nif")} />
                            {form.formState.errors.nif && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.nif.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail para Facturação</Label>
                            <Input id="email" type="email" {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Redes Sociais e Website */}
                <Card className="md:col-span-2 border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Globe className="h-5 w-5 text-orange-600" />
                            Presença Digital
                        </CardTitle>
                        <CardDescription>
                            Links para as suas redes sociais e website oficial.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" /> WhatsApp
                            </Label>
                            <Input id="whatsapp" {...form.register("whatsapp")} placeholder="+244..." />
                            {form.formState.errors.whatsapp && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.whatsapp.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram" className="flex items-center gap-2">
                                <Instagram className="h-4 w-4" /> Instagram
                            </Label>
                            <Input id="instagram" {...form.register("instagram")} placeholder="@seu_restaurante" />
                            {form.formState.errors.instagram && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.instagram.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebook" className="flex items-center gap-2">
                                <Facebook className="h-4 w-4" /> Facebook
                            </Label>
                            <Input id="facebook" {...form.register("facebook")} placeholder="fb.com/seu_restaurante" />
                            {form.formState.errors.facebook && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.facebook.message}</p>
                            )}
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label htmlFor="website">Website Oficial</Label>
                            <Input id="website" {...form.register("website")} placeholder="https://www.doseurestaurante.com" />
                            {form.formState.errors.website && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.website.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]">
                    {form.formState.isSubmitting ? "A guardar..." : "Guardar Alterações"}
                </Button>
            </div>
        </form>
    );
}

function Store(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 10V7" />
        </svg>
    )
}
