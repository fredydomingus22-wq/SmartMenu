import { Button } from "@/components/ui/button";
import { Bike, ChevronLeft, ShoppingBag, Utensils, Smartphone } from "lucide-react";
import Link from "next/link";

export default function ContextOrderingPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                        <Smartphone className="h-3 w-3 fill-current" />
                        <span>OMNICHANNEL REAL</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Venda em Qualquer <br />
                        <span className="text-orange-500">Contexto</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        O SmartMenu adapta-se à jornada do cliente. Seja na mesa, em casa ou a caminho, a experiência é fluida e unificada.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border hover:border-orange-500/30 transition-colors">
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Utensils className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Dine-In (Na Mesa)</h3>
                        <p className="text-muted-foreground">
                            O clássico QR Code na mesa. O cliente senta, escaneia e o pedido vai direto para a cozinha com o número da mesa identificado. Sem erros.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border hover:border-orange-500/30 transition-colors">
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Takeaway (Levantar)</h3>
                        <p className="text-muted-foreground">
                            O cliente encomenda antes de chegar. O sistema avisa quando está pronto para levantar. Ideal para almoços rápidos ou café on-the-go.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border hover:border-orange-500/30 transition-colors">
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Bike className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Delivery Próprio</h3>
                        <p className="text-muted-foreground">
                            Receba encomendas para entrega direta. Faça a gestão dos estafetas e taxas de entrega sem pagar comissões abusivas a terceiros.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-zinc-900 text-zinc-50 rounded-3xl p-12 text-center space-y-6">
                    <h2 className="text-3xl font-bold">Um Sistema, Múltiplos Canais</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Centralize toda a sua operação num único dashboard.
                    </p>
                    <Button size="lg" className="font-bold rounded-full bg-white text-black hover:bg-zinc-200" asChild>
                        <Link href="/login">Testar Gratuitamente</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
