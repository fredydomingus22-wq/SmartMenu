import { LandingHeader } from "../_components/landing/landing-header";
import { LandingFooter } from "../_components/landing/landing-footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <LandingHeader />

            <main className="flex-1 pt-28 pb-16 px-6">
                <article className="max-w-3xl mx-auto prose prose-zinc prose-headings:font-black prose-headings:tracking-tight prose-h1:text-4xl prose-p:text-zinc-700 prose-p:leading-relaxed">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors no-underline mb-8">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>

                    <h1>Termos de Uso</h1>
                    <p className="text-sm text-zinc-400 font-bold">Última atualização: Fevereiro 2026</p>

                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao utilizar a plataforma SmartMenu, o utilizador concorda com os presentes Termos de Uso. 
                        Se não concordar com alguma disposição, não deverá utilizar o serviço.
                    </p>

                    <h2>2. Descrição do Serviço</h2>
                    <p>
                        O SmartMenu é uma plataforma SaaS de menu digital para restaurantes em Angola. 
                        Fornecemos ferramentas de gestão de cardápio, pedidos digitais via QR Code, 
                        analytics de negócio e programas de fidelidade.
                    </p>

                    <h2>3. Contas de Utilizador</h2>
                    <p>
                        Para aceder a funcionalidades completas, pode ser necessário criar uma conta. 
                        O utilizador é responsável por manter a confidencialidade das suas credenciais 
                        e por todas as atividades realizadas na sua conta.
                    </p>

                    <h2>4. Uso Aceitável</h2>
                    <p>
                        O utilizador compromete-se a não utilizar a plataforma para fins ilegais, 
                        não introduzir conteúdo ofensivo ou malicioso, e não tentar aceder a áreas 
                        restritas do sistema sem autorização.
                    </p>

                    <h2>5. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo da plataforma SmartMenu (design, código, marca) é propriedade 
                        da Zimbotechia Lda. Os restaurantes mantêm a propriedade dos seus conteúdos 
                        (fotos, descrições, marcas próprias).
                    </p>

                    <h2>6. Pagamentos e Planos</h2>
                    <p>
                        Os preços dos planos são indicados em Kwanzas (KZ) e estão sujeitos a alteração 
                        com aviso prévio de 30 dias. Todos os planos incluem um período de teste gratuito 
                        de 14 dias.
                    </p>

                    <h2>7. Limitação de Responsabilidade</h2>
                    <p>
                        O SmartMenu não se responsabiliza por interrupções no serviço causadas por 
                        fatores externos (conectividade, infraestrutura do restaurante), nem por 
                        perdas indiretas resultantes do uso da plataforma.
                    </p>

                    <h2>8. Modificações aos Termos</h2>
                    <p>
                        Reservamo-nos o direito de alterar estes Termos a qualquer momento. 
                        As alterações serão comunicadas por email e entrarão em vigor 15 dias 
                        após a notificação.
                    </p>

                    <h2>9. Lei Aplicável</h2>
                    <p>
                        Estes Termos são regidos pela legislação da República de Angola. 
                        Quaisquer litígios serão resolvidos nos tribunais de Luanda.
                    </p>

                    <h2>10. Contacto</h2>
                    <p>
                        Para questões legais: <strong>legal@smartmenu.ao</strong><br />
                        Zimbotechia Lda • Luanda, Angola
                    </p>
                </article>
            </main>

            <LandingFooter />
        </div>
    );
}
