import { Button } from "@/components/ui/button";
import { ChevronLeft, TrendingUp, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function UpsellPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">
                        <TrendingUp className="h-3 w-3 fill-current" />
                        <span>PARE DE PERDER DINHEIRO</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        O Vendedor que <br />
                        <span className="text-blue-500">Nunca Dorme</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Cada pedido que sai da cozinha sem uma bebida ou sobremesa é <strong className="text-foreground">dinheiro deixado na mesa</strong>. O SmartMenu elimina esse prejuízo invisível usando psicologia de consumo avançada.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/10">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold">O Poder do "Sim, aceito"</h3>
                            </div>
                            <p className="text-muted-foreground pl-16 text-lg leading-relaxed">
                                Humanos odeiam pressão, mas amam conveniência. A nossa IA sabe que sugerir uma "Coca-Cola gelada" com o hambúrguer aumenta a conversão em <strong>40%</strong> comparado a uma pergunta genérica do garçom.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/10">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold">Timing Cirúrgico</h3>
                            </div>
                            <p className="text-muted-foreground pl-16 text-lg leading-relaxed">
                                Sugerir cedo demais irrita. Sugerir tarde demais é inútil. O SmartMenu apresenta a oferta irresistível no <strong>microssegundo exato</strong> em que o cliente está com o dedo no botão de "Confirmar".
                            </p>
                        </div>
                    </div>

                    {/* Visual Simulation */}
                    <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">SIMULAÇÃO</div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-background rounded-xl shadow-sm opacity-50">
                                <span>Hambúrguer Clássico</span>
                                <span>2.500 KZ</span>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-500/30 animate-pulse">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-blue-700 dark:text-blue-300">Vai bem com...</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 bg-zinc-200 rounded-lg" />
                                    <div>
                                        <div className="font-medium">Batata Frita</div>
                                        <div className="text-sm text-muted-foreground">+500 KZ</div>
                                        <Button size="sm" className="mt-2 h-7 text-xs bg-blue-600 hover:bg-blue-700">Adicionar +</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROI Stat */}
                <div className="text-center py-12 border-y">
                    <h3 className="text-5xl font-black text-blue-600 mb-2">+15%</h3>
                    <p className="text-muted-foreground uppercase tracking-widest font-semibold">Aumento médio no Ticket</p>
                </div>
            </main>
        </div>
    );
}
