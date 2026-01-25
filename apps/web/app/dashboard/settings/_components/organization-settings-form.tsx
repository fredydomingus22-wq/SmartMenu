"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@smart-menu/ui";
import { Input } from "@smart-menu/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@smart-menu/ui";
import { Label } from "@smart-menu/ui";
import { toast } from "sonner";
import { updateOrganizationProfile } from "@/app/actions/settings";
import { Building2, Mail, Phone, MapPin, Globe } from "lucide-react";

const organizationSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    taxId: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationSettingsFormProps {
    initialData: {
        name?: string;
        taxId?: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        email?: string;
    };
}

export function OrganizationSettingsForm({ initialData }: OrganizationSettingsFormProps) {
    const form = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: initialData.name || "",
            taxId: initialData.taxId || "",
            address: initialData.address || "",
            city: initialData.city || "",
            country: initialData.country || "",
            phone: initialData.phone || "",
            email: initialData.email || "",
        },
    });

    async function onSubmit(data: OrganizationFormValues) {
        console.log("[OrganizationSettingsForm] Submitting data:", data);
        try {
            const result = await updateOrganizationProfile(data);
            if (result.success) {
                toast.success("Perfil da organização atualizado com sucesso!");
            } else {
                console.error("[OrganizationSettingsForm] Update failed:", result.error);
                toast.error(result.error || "Erro ao atualizar o perfil.");
            }
        } catch (error) {
            console.error("[OrganizationSettingsForm] Error in onSubmit:", error);
            toast.error("Ocorreu um erro inesperado ao salvar.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Informações da Empresa */}
                <Card className="md:col-span-2 border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Building2 className="h-5 w-5 text-orange-600" />
                            Dados da Organização (Holding/Empresa)
                        </CardTitle>
                        <CardDescription>
                            Configurações de nível empresarial que abrangem todos os seus restaurantes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Empresa</Label>
                            <Input id="name" {...form.register("name")} />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxId">NIF da Empresa</Label>
                            <Input id="taxId" {...form.register("taxId")} placeholder="Número de Identificação Fiscal" />
                            {form.formState.errors.taxId && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.taxId.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> E-mail Corporativo
                            </Label>
                            <Input id="email" type="email" {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Telefone Sede
                            </Label>
                            <Input id="phone" {...form.register("phone")} />
                            {form.formState.errors.phone && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.phone.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Localização da Sede */}
                <Card className="md:col-span-2 border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <MapPin className="h-5 w-5 text-orange-600" />
                            Localização da Sede
                        </CardTitle>
                        <CardDescription>
                            Endereço legal da sua organização.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input id="address" {...form.register("address")} />
                            {form.formState.errors.address && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.address.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input id="city" {...form.register("city")} />
                            {form.formState.errors.city && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.city.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" /> País
                            </Label>
                            <Input id="country" {...form.register("country")} defaultValue="Angola" />
                            {form.formState.errors.country && (
                                <p className="text-xs text-red-500 font-medium">{form.formState.errors.country.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]">
                    {form.formState.isSubmitting ? "A guardar..." : "Guardar Organização"}
                </Button>
            </div>
        </form>
    );
}
