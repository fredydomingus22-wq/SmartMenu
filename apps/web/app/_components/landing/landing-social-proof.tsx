"use client";

export function LandingSocialProof() {
    const partners = [
        { name: "Oon.dah" },
        { name: "Cais de Quatro" },
        { name: "Lookal" },
        { name: "K. Luanda" },
        { name: "Nikki Beach" }
    ];

    return (
        <section className="py-12 md:py-16 px-6 bg-white border-y border-zinc-100">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
                <p className="text-center text-zinc-700 text-sm font-bold uppercase tracking-[0.2em] mb-12">
                    A escolha dos melhores restaurantes de Angola
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-20 opacity-40 grayscale hover:opacity-100 transition-all duration-700">
                    {partners.map((partner, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent group-hover:via-orange-500 transition-colors" />
                            <span className="font-sans text-lg md:text-xl font-black tracking-tight uppercase group-hover:text-zinc-900 transition-colors">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
