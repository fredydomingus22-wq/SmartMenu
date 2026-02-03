import { ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface PrivacyPageProps {
    params: Promise<{ id: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
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
                            <ShieldCheck className="h-6 w-6" />
                            <span className="text-sm font-bold uppercase tracking-widest">Segurança</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase">Política de Privacidade</h1>
                        <div className="h-2 w-20 bg-primary rounded-full" />
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            A sua privacidade é importante para nós. Esta política explica como recolhemos, 
                            usamos e protegemos as suas informações ao utilizar o nosso menu digital.
                        </p>

                        <h3 className="text-foreground">1. Recolha de Dados</h3>
                        <p>
                            Recolhemos apenas os dados necessários para o processamento dos seus pedidos, 
                            como o número da mesa e itens selecionados. Se optar por se identificar no nosso 
                            clube de fidelidade, recolheremos o seu nome e telefone/e-mail.
                        </p>

                        <h3 className="text-foreground">2. Uso das Informações</h3>
                        <p>
                            As informações são utilizadas exclusivamente para:
                        </p>
                        <ul>
                            <li>Processar e entregar o seu pedido na mesa correta.</li>
                            <li>Gerir pontos e recompensas no clube de fidelidade.</li>
                            <li>Melhorar a sua experiência de navegação e serviço.</li>
                        </ul>

                        <h3 className="text-foreground">3. Segurança</h3>
                        <p>
                            Implementamos medidas de segurança técnicas e organizacionais para proteger 
                            os seus dados contra acesso não autorizado ou perda.
                        </p>

                        <h3 className="text-foreground">4. Seus Direitos</h3>
                        <p>
                            Pode solicitar a qualquer momento a consulta, correção ou eliminação dos 
                            seus dados pessoais guardados no nosso sistema.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
