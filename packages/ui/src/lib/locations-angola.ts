export interface Municipality {
    id: string;
    name: string;
}

export interface Province {
    id: string;
    name: string;
    municipalities: Municipality[];
}

export const ANGOLA_LOCATIONS: Province[] = [
    {
        id: "luanda",
        name: "Luanda",
        municipalities: [
            { id: "belas", name: "Belas" },
            { id: "cacuaco", name: "Cacuaco" },
            { id: "cazenga", name: "Cazenga" },
            { id: "icuau-itela", name: "Icolo e Bengo" },
            { id: "luanda-municipio", name: "Luanda" },
            { id: "quilamba-quiaxi", name: "Kilamba Kiaxi" },
            { id: "talatona", name: "Talatona" },
            { id: "viana", name: "Viana" },
            { id: "quissama", name: "Quiçama" }
        ]
    },
    {
        id: "benguela",
        name: "Benguela",
        municipalities: [
            { id: "baia-farta", name: "Baía Farta" },
            { id: "balombo", name: "Balombo" },
            { id: "benguela-mun", name: "Benguela" },
            { id: "bocoio", name: "Bocoio" },
            { id: "catumbela", name: "Catumbela" },
            { id: "chongoroi", name: "Chongoroi" },
            { id: "ganda", name: "Ganda" },
            { id: "lobito", name: "Lobito" },
            { id: "ubanje", name: "Cubal" }
        ]
    },
    {
        id: "huambo",
        name: "Huambo",
        municipalities: [
            { id: "bailundo", name: "Bailundo" },
            { id: "caala", name: "Caála" },
            { id: "catchiungo", name: "Catchiungo" },
            { id: "huambo-mun", name: "Huambo" },
            { id: "londuimbali", name: "Londuimbali" },
            { id: "longonjo", name: "Longonjo" },
            { id: "mungo", name: "Mungo" }
        ]
    },
    {
        id: "huila",
        name: "Huíla",
        municipalities: [
            { id: "lubango", name: "Lubango" },
            { id: "humpata", name: "Humpata" },
            { id: "chibia", name: "Chibia" },
            { id: "quipungo", name: "Quipungo" },
            { id: "matala", name: "Matala" }
        ]
    }
    // Adicionar mais conforme necessário
];
