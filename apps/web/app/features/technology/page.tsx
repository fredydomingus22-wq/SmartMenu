import { Button } from "@smart-menu/ui";
import { ChevronLeft, Database, Globe, Lock, Server, Zap } from "lucide-react";
import Link from "next/link";

export default function TechPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center max-w-7xl mx-auto px-6">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar ao Início
                    </Link>
                    <div className="ml-auto font-mono text-sm">v1.0.0-beta</div>
                </div>
            </header>

            <main className="container max-w-5xl mx-auto px-6 py-12 space-y-24">
                {/* Header */}
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Especificações Técnicas</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        O SmartMenu não é apenas uma interface bonita. É um sistema distribuído robusto, construído com arquitetura de ponta para escalar com o seu negócio.
                    </p>
                </div>

                {/* Stack Grid */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Server className="h-6 w-6 text-primary" />
                            Arquitetura & Performance
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Utilizamos uma arquitetura **Serverless & Edge** para garantir que o menu carrega instantaneamente, mesmo em conexões 3G/4G instáveis.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">• <strong className="text-foreground">Next.js 15:</strong> Renderização otimizada (SSR/ISR).</li>
                            <li className="flex items-center gap-2">• <strong className="text-foreground">Edge Caching:</strong> Conteúdo distribuído globalmente.</li>
                            <li className="flex items-center gap-2">• <strong className="text-foreground">Offline-First:</strong> O sistema continua a funcionar mesmo com quebras de rede momentâneas.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Lock className="h-6 w-6 text-primary" />
                            Segurança & Dados
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Os seus dados são isolados. Utilizamos **Row-Level Security (RLS)** para garantir que nenhum dado do seu restaurante vaza para outros tenants.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">• <strong className="text-foreground">Multi-tenant Isolation:</strong> Separação lógica estrita.</li>
                            <li className="flex items-center gap-2">• <strong className="text-foreground">GDPR/APD Compliant:</strong> Proteção de dados dos clientes.</li>
                            <li className="flex items-center gap-2">• <strong className="text-foreground">Backups Automáticos:</strong> Snapshot diário de toda a operação.</li>
                        </ul>
                    </div>
                </div>

                {/* System Diagram (Visual) */}
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border">
                    <h3 className="text-lg font-bold mb-8">Fluxo de Dados:</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="p-6 bg-background rounded-xl border shadow-sm">
                            <Globe className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                            <div className="font-bold">Client Edge</div>
                            <div className="text-xs text-muted-foreground mt-1">QR Scan & Load</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="h-0.5 w-full bg-border relative">
                                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                            </div>
                        </div>
                        <div className="p-6 bg-background rounded-xl border shadow-sm">
                            <Database className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                            <div className="font-bold">Server & DB</div>
                            <div className="text-xs text-muted-foreground mt-1">Order Processing</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-12 border-t">
                    <h3 className="text-2xl font-bold mb-6">Pronto para a tecnologia certa?</h3>
                    <Button size="lg" asChild>
                        <Link href="/login">Começar Trial Técnico</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
