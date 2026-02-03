import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@smart-menu/api";
import { MenuConfig } from "../_types";

interface AboutPageProps {
    params: Promise<{ id: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
    const { id } = await params;
    const config = await apiClient.get<MenuConfig>(`/public/menu/${id}/config`);
    const branding = config?.branding;
    
    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="flex h-16 items-center px-4 sm:px-8">
                    <Link 
                        href={`/menu/${params.id}`}
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
                        <h1 className="text-4xl font-black tracking-tight uppercase">Sobre Nós</h1>
                        <div className="h-2 w-20 bg-primary rounded-full" />
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Bem-vindo ao <span className="text-foreground font-bold">{branding?.tenantName || "nosso espaço"}</span>. 
                            Estamos comprometidos em oferecer a melhor experiência gastronómica aos nossos clientes.
                        </p>
                        
                        <p>
                            O nosso restaurante combina ingredientes frescos e sazonais com técnicas culinárias tradicionais e modernas 
                            para criar pratos que encantam os sentidos. Cada detalhe do nosso menu foi cuidadosamente pensado 
                            para proporcionar momentos memoráveis à mesa.
                        </p>

                        <h3>A Nossa Missão</h3>
                        <p>
                            Transformar cada refeição num momento especial, unindo sabor, qualidade e um atendimento de excelência.
                        </p>

                        <h3>Qualidade Garantida</h3>
                        <p>
                            Trabalhamos com produtores locais e selecionamos pessoalmente cada ingrediente que entra na nossa cozinha. 
                            Acreditamos que a base de um bom prato é a integridade dos seus componentes.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
