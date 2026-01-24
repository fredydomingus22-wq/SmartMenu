import { Button } from "@/components/ui/button";
import { ChevronLeft, Gift, Heart, Repeat, Users, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoyaltyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container flex h-16 items-center max-w-7xl mx-auto px-6">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar
                    </Link>
                </div>
            </header>

            <main className="container max-w-5xl mx-auto px-6 py-12 space-y-24">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold border border-purple-500/20">
                        <Heart className="h-3 w-3 fill-current" />
                        <span>RETENÇÃO DE CLIENTES</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Transforme Visitantes em <br />
                        <span className="text-purple-500">Fãs Leais</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Não basta vender uma vez. O Club de Pontos do SmartMenu cria um ciclo vicioso positivo onde quanto mais o cliente come, mais ele ganha.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Repeat className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Aumente a Frequência</h3>
                        <p className="text-muted-foreground">
                            Clientes membros de programas de fidelidade visitam 20% mais vezes. Dê-lhes um motivo para escolher o seu restaurante hoje.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Gift className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Recompensas Reais</h3>
                        <p className="text-muted-foreground">
                            Configure o valor do ponto (ex: 1000 KZ = 1 Ponto). O cliente troca pontos por sobremesas ou descontos direto no carrinho.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Dados de Ouro</h3>
                        <p className="text-muted-foreground">
                            Para ganhar pontos, o cliente regista-se. Agora você sabe quem eles são, o que pedem e quando fazem anos.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-purple-600 rounded-3xl p-12 text-center text-white space-y-6">
                    <h2 className="text-3xl font-bold">Pronto para criar a sua comunidade?</h2>
                    <p className="text-purple-100 max-w-xl mx-auto">
                        Comece hoje mesmo a construir a sua base de dados de clientes fiéis.
                    </p>
                    <Button size="lg" variant="secondary" className="font-bold rounded-full" asChild>
                        <Link href="/login">Começar Agora</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
