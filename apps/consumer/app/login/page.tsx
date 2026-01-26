import { apiClient } from "@/utils/api-client-server";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea, AuthBrandingWrapper } from "@smart-menu/ui";
import { TenantBranding, MenuConfig } from "../menu/[id]/_types";
import Image from "next/image";
import Link from "next/link";
import { login, signup } from "../actions/auth";

export default async function ConsumerLoginPage({
    searchParams
}: {
    searchParams: Promise<{ tenantId?: string; error?: string; message?: string }>
}) {
    const { tenantId, error, message } = await searchParams;

    let branding: TenantBranding | null = null;
    if (tenantId) {
        try {
            const config = await apiClient.get<MenuConfig>(`/public/menu/${tenantId}/config`);
            branding = config.branding || null;
        } catch (e) {
            console.warn("[LoginPage] Failed to fetch branding", e);
        }
    }

    const restaurantName = branding?.tenantName || "SmartMenu";

    return (
        <AuthBrandingWrapper branding={branding}>
            <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-50 px-4 dark:bg-black">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center flex flex-col items-center gap-4">
                        {branding?.logoUrl ? (
                            <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                                <Image
                                    src={branding.logoUrl}
                                    alt={restaurantName}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Smart<span className="text-primary">Menu</span>
                            </h1>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{restaurantName}</h2>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                {tenantId
                                    ? `Inicie sessão para ganhar pontos no ${restaurantName}.`
                                    : "Bem-vindo ao SmartMenu."}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400 border border-red-100">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400 border border-emerald-100">
                            {message}
                        </div>
                    )}

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Entrar</TabsTrigger>
                            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="mt-4">
                            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Entrar</CardTitle>
                                    <CardDescription>
                                        Aceda à sua conta de cliente.
                                    </CardDescription>
                                </CardHeader>
                                <form action={login}>
                                    <input type="hidden" name="tenantId" value={tenantId} />
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Palavra-passe</Label>
                                            <Input id="password" name="password" type="password" required />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4">
                                        <Button type="submit" className="w-full h-11">
                                            Entrar
                                        </Button>
                                        <div className="relative w-full">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-zinc-200 dark:border-zinc-800"></span>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-zinc-50 dark:bg-black px-2 text-zinc-500">Ou continuar com</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" type="button" className="w-full h-11" disabled>
                                            Google (Brevemente)
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>

                        <TabsContent value="signup" className="mt-4">
                            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Nova Conta</CardTitle>
                                    <CardDescription>
                                        Cadastre-se para aproveitar benefícios exclusivos.
                                    </CardDescription>
                                </CardHeader>
                                <form action={signup}>
                                    <input type="hidden" name="tenantId" value={tenantId} />
                                    <ScrollArea className="max-h-[80dvh]">
                                        <CardContent className="space-y-4 pr-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-name">Nome Completo</Label>
                                                <Input id="reg-name" name="name" placeholder="Ex: João Silva" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-email">Email</Label>
                                                <Input id="reg-email" name="email" type="email" placeholder="seu@email.com" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-password">Palavra-passe</Label>
                                                <Input id="reg-password" name="password" type="password" required minLength={6} />
                                            </div>
                                        </CardContent>
                                    </ScrollArea>
                                    <CardFooter>
                                        <Button type="submit" className="w-full h-11 mt-2">
                                            Criar Minha Conta
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 text-center">
                        <Link
                            href={tenantId ? `/menu/${tenantId}` : "/"}
                            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            Voltar ao Menu
                        </Link>
                    </div>
                </div>
            </div>
        </AuthBrandingWrapper>
    );
}
