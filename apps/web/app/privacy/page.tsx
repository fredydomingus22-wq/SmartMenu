import { LandingHeader } from "../_components/landing/landing-header";
import { LandingFooter } from "../_components/landing/landing-footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <LandingHeader />

            <main className="flex-1 pt-28 pb-16 px-6">
                <article className="max-w-3xl mx-auto prose prose-zinc prose-headings:font-black prose-headings:tracking-tight prose-h1:text-4xl prose-p:text-zinc-700 prose-p:leading-relaxed">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors no-underline mb-8">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>

                    <h1>Política de Privacidade</h1>
                    <p className="text-sm text-zinc-400 font-bold">Última atualização: Fevereiro 2026</p>

                    <h2>1. Informações que Recolhemos</h2>
                    <p>
                        O SmartMenu recolhe as informações que o utilizador fornece voluntariamente ao criar uma conta, 
                        fazer pedidos, ou entrar em contacto connosco. Estas podem incluir: nome, endereço de email, 
                        número de telefone, e endereços de entrega.
                    </p>

                    <h2>2. Como Utilizamos as Informações</h2>
                    <p>
                        As informações recolhidas são utilizadas para: processar pedidos, personalizar a experiência 
                        do utilizador, enviar comunicações sobre o serviço, e melhorar a nossa plataforma. 
                        Não vendemos dados pessoais a terceiros.
                    </p>

                    <h2>3. Armazenamento e Segurança</h2>
                    <p>
                        Os dados são armazenados de forma segura utilizando encriptação de nível bancário (AES-256). 
                        Utilizamos o Supabase como infraestrutura de base de dados, que cumpre com os padrões 
                        SOC 2 Type II e GDPR.
                    </p>

                    <h2>4. Cookies e Tecnologias de Rastreamento</h2>
                    <p>
                        Utilizamos cookies essenciais para manter a sessão do utilizador e cookies analíticos 
                        (anonimizados) para entender como a plataforma é utilizada. O utilizador pode desativar 
                        cookies não essenciais nas definições do navegador.
                    </p>

                    <h2>5. Direitos do Utilizador</h2>
                    <p>
                        O utilizador tem o direito de: aceder aos seus dados pessoais, solicitar a sua correção 
                        ou eliminação, e retirar o consentimento para o tratamento de dados. Para exercer estes 
                        direitos, contacte-nos através do email <strong>privacidade@smartmenu.ao</strong>.
                    </p>

                    <h2>6. Partilha com Terceiros</h2>
                    <p>
                        Partilhamos dados apenas com os restaurantes parceiros necessários para processar os pedidos 
                        do utilizador, e com prestadores de serviços de pagamento. Todos os parceiros estão vinculados 
                        por acordos de proteção de dados.
                    </p>

                    <h2>7. Contacto</h2>
                    <p>
                        Para questões relacionadas com privacidade, contacte-nos:<br />
                        Email: <strong>privacidade@smartmenu.ao</strong><br />
                        Endereço: Luanda, Angola
                    </p>
                </article>
            </main>

            <LandingFooter />
        </div>
    );
}
