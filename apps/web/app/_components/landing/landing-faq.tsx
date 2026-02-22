"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Como funciona o menu digital para restaurantes em Angola?",
        answer: "O SmartMenu transforma seu restaurante tradicional em um estabelecimento digital. Clientes escaneiam um QR Code na mesa, acessam o menu interativo no celular e fazem pedidos diretamente. Aumente vendas sugerindo pratos típicos angolanos como muamba de galinha ou calulu."
    },
    {
        question: "Quanto custa implementar menu digital QR Code em restaurante Angola?",
        answer: "Nossos planos começam em 50.000 KZ/mês para até 50 mesas. Inclui menu QR interativo, carrinho de pedidos e suporte completo. Ideal para restaurantes em Luanda e outras cidades angolanas."
    },
    {
        question: "O menu digital aumenta vendas em restaurantes angolanos?",
        answer: "Sim! Restaurantes que usam SmartMenu aumentam o ticket médio em até 20%. Sugestões automáticas de pratos e bebidas extras, além de reduzir erros de pedidos e tempo de espera na cozinha."
    },
    {
        question: "Preciso de app para usar menu digital restaurante Angola?",
        answer: "Não! O SmartMenu funciona diretamente no navegador do celular do cliente. Basta escanear o QR Code na mesa. Sem downloads, sem apps, apenas tecnologia simples e eficiente para restaurantes em Angola."
    },
    {
        question: "Como funciona o sistema KDS para cozinha em Angola?",
        answer: "O Kitchen Display System (KDS) organiza pedidos automaticamente na cozinha. Elimina gritos e confusões, mostrando pedidos em tempo real com tempos de preparo estimados. Perfeito para restaurantes angolanos que querem eficiência."
    }
];

export function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-12 md:py-16 px-6 bg-zinc-50 relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                        Respostas para a sua <span className="text-primary">operação</span>.
                    </h2>
                    <p className="text-zinc-800 text-lg md:text-xl font-medium leading-relaxed">
                        Tudo o que precisa de saber sobre a implementação do ecossistema SmartMenu no seu restaurante.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4 group"
                            >
                                <span className="font-bold text-lg text-zinc-950 group-hover:text-primary transition-colors">
                                    {faq.question}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-zinc-700 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-primary" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-zinc-700 font-medium leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
