import { Button } from "@/components/ui/button";
import { Bike, ChevronLeft, ShoppingBag, Utensils, Smartphone } from "lucide-react";
import Link from "next/link";

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

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
                        <span>LIBERDADE OPERACIONAL</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        O Seu Restaurante <br />
                        <span className="text-orange-500">Sem Paredes</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        As suas mesas estão cheias? Ótimo. Mas porquê limitar o seu faturamento ao espaço físico? O SmartMenu permite-lhe vender para quem está no escritório, em casa ou no trânsito.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border hover:border-orange-500/30 transition-colors shadow-sm hover:shadow-xl">
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Utensils className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Dine-In (A Base)</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            O cliente senta e pede. Sem esperar pelo garçom, sem erros de anotação. A rotação das mesas aumenta em <strong>30%</strong> porque o processo é instantâneo.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border hover:border-orange-500/30 transition-colors shadow-sm hover:shadow-xl">
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Takeaway (A Conveniência)</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Luanda corre. Os seus clientes também. Permita que encomendem o almoço às 12:30 para levantar às 13:00. Eles poupam tempo, você ganha volume.
                        </p>
                    </div>
                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-4 border hover:border-orange-500/30 transition-colors shadow-sm hover:shadow-xl">
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Bike className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Delivery (A Expansão)</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Fuja das comissões de 30% das apps de entrega. Gerencie a sua própria frota ou parceiros e mantenha o lucro do lado de cá do balcão.
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
