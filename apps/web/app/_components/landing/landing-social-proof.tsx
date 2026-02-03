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
        <section className="py-12 bg-zinc-50 dark:bg-zinc-950/40 border-y">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
                <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-[0.3em]">
                    A escolha dos melhores restaurantes de Luanda
                </p>
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 md:gap-x-20 opacity-40 grayscale hover:opacity-10 transition-all duration-700 pointer-events-none sm:pointer-events-auto sm:hover:opacity-100 sm:hover:grayscale-0">
                    {partners.map((partner, i) => (
                        <span
                            key={i}
                            className="font-sans text-xl md:text-2xl font-bold tracking-tight hover:text-primary transition-colors cursor-default"
                        >
                            {partner.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
