import { LandingHeader } from "@/app/_components/landing/landing-header";
import { LandingFooter } from "@/app/_components/landing/landing-footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col pt-20">
            <LandingHeader />
            <div className="flex-grow container max-w-4xl mx-auto px-4 py-20">
                <h1 className="text-4xl font-black tracking-tight mb-8">Política de Privacidade</h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                        A sua privacidade é importante para nós. É política do SmartMenu respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site SmartMenu, e outros sites que possuímos e operamos.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">1. Coleta de Informações</h2>
                    <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">2. Uso de Dados</h2>
                    <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">3. Partilha de Dados</h2>
                    <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">4. Cookies</h2>
                    <p>Utilizamos cookies para melhorar a sua experiência no nosso site. Pode configurar o seu navegador para recusar todos os cookies ou para indicar quando um cookie está a ser enviado.</p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">5. Compromisso do Usuário</h2>
                    <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o SmartMenu oferece no site e com caráter enunciativo, mas não limitativo:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
                        <li>Não divulgar conteúdo ou propaganda de natureza racista, xenofóbica, ou sobre cassinos, casas de apostas online, jogos de sorte e azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                        <li>Não causar danos aos sistemas físicos (hardware) e lógicos (software) do SmartMenu, de seus fornecedores ou terceiros.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-10 mb-4">6. Contacto</h2>
                    <p>Se tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco através do e-mail: <a href="mailto:smartmenu87@gmail.com" className="text-primary hover:underline font-medium">smartmenu87@gmail.com</a>.</p>
                </div>
            </div>
            <LandingFooter />
        </main>
    );
}
