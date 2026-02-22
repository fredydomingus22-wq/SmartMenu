"use client";

import { useState } from "react";
import { LandingHeader } from "../_components/landing/landing-header";
import { LandingFooter } from "../_components/landing/landing-footer";
import { Button, BRAND_COLORS, toast } from "@smart-menu/ui";
import { Send, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { submitContactForm } from "../actions/contact";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const data = {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                restaurant: formData.get("restaurant") as string,
                phone: formData.get("phone") as string,
                message: formData.get("message") as string,
            };

            const result = await submitContactForm(data);

            if (result.success) {
                setSubmitted(true);
                toast.success("Mensagem enviada com sucesso!", { description: "A nossa equipa vai responder em até 24h úteis." });
            } else {
                toast.error("Erro ao enviar mensagem", { description: result.error || "Por favor, tente novamente." });
            }
        } catch {
            toast.error("Erro ao enviar mensagem", { description: "Por favor, verifique a sua ligação à internet." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <LandingHeader />

            <main className="flex-1 pt-28 pb-16 px-6">
                <div className="max-w-2xl mx-auto space-y-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar à página inicial
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                            Falar com <span style={{ color: `oklch(${BRAND_COLORS.orange})` }}>Vendas</span>
                        </h1>
                        <p className="text-zinc-700 text-lg font-medium leading-relaxed">
                            Tem um restaurante com mais de 150 mesas ou precisa de uma solução customizada? 
                            A nossa equipa comercial está pronta para ajudar.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="flex flex-col items-center text-center space-y-6 py-16">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-zinc-950">Mensagem Enviada!</h2>
                                <p className="text-zinc-600 font-medium">A nossa equipa vai responder em até 24 horas úteis.</p>
                            </div>
                            <Button className="mt-4" asChild>
                                <Link href="/">Voltar à Página Inicial</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700" htmlFor="name">Nome Completo</label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        placeholder="João Silva"
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-950 font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700" htmlFor="email">Email Profissional</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="joao@restaurante.ao"
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-950 font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700" htmlFor="restaurant">Nome do Restaurante</label>
                                    <input
                                        id="restaurant"
                                        type="text"
                                        required
                                        placeholder="Elite Burger Luanda"
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-950 font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700" htmlFor="phone">Telefone / WhatsApp</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        placeholder="+244 999 888 777"
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-950 font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700" htmlFor="message">Mensagem</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    required
                                    placeholder="Descreva as suas necessidades, número de mesas, localizações..."
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-950 font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={loading}
                                className="h-14 px-10 text-base font-bold rounded-xl text-zinc-950 w-full sm:w-auto"
                                style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }}
                            >
                                {loading ? "A enviar..." : "Enviar Mensagem"}
                                <Send className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    )}
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
