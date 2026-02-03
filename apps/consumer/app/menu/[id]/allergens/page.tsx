import { ChevronLeft, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

interface AllergensPageProps {
    params: Promise<{ id: string }>;
}

const ALLERGENS = [
    { name: "Glúten", icon: "🌾", desc: "Trigo, centeio, cevada, aveia, espelta, kamut ou suas estirpes hibridizadas." },
    { name: "Crustáceos", icon: "🦐", desc: "Camarão, lagosta, caranguejo, etc." },
    { name: "Ovos", icon: "🥚", desc: "E produtos à base de ovos." },
    { name: "Peixe", icon: "🐟", desc: "E produtos à base de peixe (exceto gelatina de peixe)." },
    { name: "Amendoins", icon: "🥜", desc: "E produtos à base de amendoins." },
    { name: "Soja", icon: "🌱", desc: "E produtos à base de soja." },
    { name: "Leite", icon: "🥛", desc: "E produtos à base de leite (incluindo lactose)." },
    { name: "Frutos de Casca Rija", icon: "🌰", desc: "Amêndoas, avelãs, nozes, castanhas de caju, pecãs, etc." },
    { name: "Aipo", icon: "🌿", desc: "E produtos à base de aipo." },
    { name: "Mostarda", icon: "🧂", desc: "E produtos à base de mostarda." },
    { name: "Sementes de Sésamo", icon: "🥯", desc: "E produtos à base de sementes de sésamo." },
    { name: "Dióxido de Enxofre/Sulfitos", icon: "🍷", desc: "Em concentrações superiores a 10mg/kg ou 10mg/L." },
    { name: "Tremoço", icon: "🌼", desc: "E produtos à base de tremoço." },
    { name: "Moluscos", icon: "🐚", desc: "Lula, polvo, mexilhão, etc." },
];

export default async function AllergensPage({ params }: AllergensPageProps) {
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

            <main className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="h-6 w-6" />
                            <span className="text-sm font-bold uppercase tracking-widest">Informação Nutricional</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase">Guia de Alergénicos</h1>
                        <div className="h-2 w-20 bg-amber-500 rounded-full" />
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            A sua saúde é a nossa prioridade. Identificamos abaixo os principais alergénicos que podem estar presentes 
                            nos nossos pratos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ALLERGENS.map((a) => (
                            <div key={a.name} className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-muted/50">
                                <span className="text-4xl">{a.icon}</span>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{a.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex gap-4">
                        <Info className="h-6 w-6 text-blue-600 shrink-0" />
                        <div className="space-y-2">
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 italic">Informação Importante</h4>
                            <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                                Devido aos métodos de preparação dos alimentos, não nos é possível garantir que não haja 
                                contaminação cruzada entre os alimentos. Se tiver uma alergia alimentar grave, por favor informe 
                                o nosso pessoal antes de efetuar o pedido.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
