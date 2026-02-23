import { LandingHeader } from "@/app/_components/landing/landing-header";
import { LandingFooter } from "@/app/_components/landing/landing-footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col pt-20">
            <LandingHeader />
            <div className="flex-grow container max-w-4xl mx-auto px-4 py-20">
                <h1 className="text-4xl font-black tracking-tight mb-8">Termos de Serviço</h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mt-10 mb-4">1. Termos</h2>
                    <p>Ao acessar ao site SmartMenu, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">2. Uso de Licença</h2>
                    <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site SmartMenu, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>modificar ou copiar os materiais;</li>
                        <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                        <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site SmartMenu;</li>
                        <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
                        <li>transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-10 mb-4">3. Isenção de Responsabilidade</h2>
                    <p>Os materiais no site da SmartMenu são fornecidos 'como estão'. SmartMenu não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">4. Limitações</h2>
                    <p>Em nenhum caso o SmartMenu ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em SmartMenu.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">5. Precisão dos Materiais</h2>
                    <p>Os materiais exibidos no site da SmartMenu podem incluir erros técnicos, tipográficos ou fotográficos. SmartMenu não garante que qualquer material em seu site seja preciso, completo ou atual.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">6. Links</h2>
                    <p>O SmartMenu não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por SmartMenu do site.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">Modificações</h2>
                    <p>O SmartMenu pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">Lei Aplicável</h2>
                    <p>Estes termos e condições são regidos e interpretados de acordo com as leis de Angola e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>
                </div>
            </div>
            <LandingFooter />
        </main>
    );
}
