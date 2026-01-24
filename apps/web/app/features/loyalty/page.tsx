import { Button } from "@/components/ui/button";
import { ChevronLeft, Gift, Heart, Repeat, Users } from "lucide-react";
import Link from "next/link";

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
                        <span>O EFEITO "TRIBO"</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Não Tenha Clientes,<br />
                        <span className="text-purple-500">Tenha Fãs</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Adquirir um cliente novo custa <strong className="text-foreground">5x mais</strong> do que manter um atual. O nosso sistema de Fidelidade cria um elo emocional que blinda o seu restaurante contra a concorrência.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border border-transparent hover:border-purple-500/20 transition-all hover:shadow-lg">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Repeat className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">O Gatilho do Hábito</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Quando o cliente sabe que está quase a ganhar aquele hambúrguer grátis, ele <strong>não considera ir a outro lugar</strong>. Você torna-se a escolha "default" no cérebro dele.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border border-transparent hover:border-purple-500/20 transition-all hover:shadow-lg">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Gift className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Reciprocidade</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Ao dar algo valioso (recompensas), você ativa o instinto de retribuição. O cliente sente-se valorizado e retribui com <strong>lealdade e recomendações</strong> aos amigos.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border border-transparent hover:border-purple-500/20 transition-all hover:shadow-lg">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Adeus, Anonimato</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Pare de tratar o seu melhor cliente como um estranho. Com o registo obrigatório para pontos, você constrói uma base de dados proprietária valiosíssima.
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
