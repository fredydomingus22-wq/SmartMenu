import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

interface TermsPageProps {
    params: Promise<{ id: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="flex h-16 items-center px-4 sm:px-8">
                    <Link 
                        href={`/menu/${id}`}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Voltar ao Menu
                    </Link>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <FileText className="h-6 w-6" />
                            <span className="text-sm font-bold uppercase tracking-widest">Legal</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase">Termos de Utilização</h1>
                        <div className="h-2 w-20 bg-primary rounded-full" />
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Ao utilizar este menu digital, concorda com os seguintes termos e condições. 
                            Por favor, leia-os atentamente.
                        </p>

                        <h3 className="text-foreground">1. Uso do Menu</h3>
                        <p>
                            Este menu destina-se exclusivamente à consulta de produtos e realização de 
                            pedidos dentro das instalações do restaurante. O uso indevido do sistema 
                            poderá resultar na suspensão do acesso.
                        </p>

                        <h3 className="text-foreground">2. Preços e Disponibilidade</h3>
                        <p>
                            Todos os preços estão expressos na moeda local e incluem IVA à taxa legal em vigor. 
                            A disponibilidade dos produtos pode variar e será confirmada no momento da 
                            validação do pedido pela nossa equipa.
                        </p>

                        <h3 className="text-foreground">3. Alergias e Intolerâncias</h3>
                        <p>
                            Embora tomemos precauções, não podemos garantir a ausência total de vestígios 
                            em pratos preparados na mesma cozinha. Consulte a nossa página de Alergénicos 
                            para informações detalhadas.
                        </p>

                        <h3 className="text-foreground">4. Clube de Fidelidade</h3>
                        <p>
                            Os pontos acumulados são pessoais e intransmissíveis, não tendo valor 
                            monetário para além do resgate de recompensas específicas definidas pelo restaurante.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
