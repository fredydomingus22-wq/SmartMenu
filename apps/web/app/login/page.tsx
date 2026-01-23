import { login, signup } from '../actions/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>;
}) {
    const { error, message } = await searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Smart<span className="text-orange-600">Menu</span>
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        O seu restaurante digital começa aqui.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400">
                        {message}
                    </div>
                )}

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Entrar</TabsTrigger>
                        <TabsTrigger value="signup">Registar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Entrar</CardTitle>
                                <CardDescription>
                                    Aceda ao seu painel de controlo.
                                </CardDescription>
                            </CardHeader>
                            <form action={login}>
                                <ScrollArea className="max-h-[60vh]">
                                    <CardContent className="space-y-4 pr-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Palavra-passe</Label>
                                            <Input id="password" name="password" type="password" required />
                                        </div>
                                    </CardContent>
                                </ScrollArea>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                                        Entrar
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Criar Conta</CardTitle>
                                <CardDescription>
                                    Registe o seu restaurante hoje.
                                </CardDescription>
                            </CardHeader>
                            <form action={signup}>
                                <ScrollArea className="max-h-[60vh]">
                                    <CardContent className="space-y-4 pr-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="restaurantName">Nome do Restaurante</Label>
                                            <Input id="restaurantName" name="restaurantName" placeholder="O Meu Bistro" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-email">Email</Label>
                                            <Input id="reg-email" name="email" type="email" placeholder="nome@exemplo.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-password">Palavra-passe</Label>
                                            <Input id="reg-password" name="password" type="password" required minLength={6} />
                                        </div>
                                    </CardContent>
                                </ScrollArea>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                                        Começar Agora
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
}
