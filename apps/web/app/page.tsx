"use client";

import { Button } from "@/components/ui/button";
import { Utensils, QrCode, ClipboardList, TrendingUp, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">SmartMenu</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Funcionalidades</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">Como funciona</Link>
            <Link href="/login" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors">Aceder</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-black/60">
            <Image
              src="/assets/marketing/hero-luanda.png"
              alt="Restaurante em Luanda - Ambiente"
              fill
              className="object-cover opacity-60 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto text-center md:text-left grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <Zap className="h-3 w-3 fill-current" />
                <span>TECNOLOGIA DE PONTA PARA O SEU RESTAURANTE</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Digitalize o seu <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  Sucesso Gastronómico
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Aumente o seu ticket médio em 20% com menus interativos, KDS inteligente e fidelização de clientes. A plataforma SaaS definitiva para restauração moderna.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:justify-start">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full gap-2 shadow-xl shadow-primary/20" asChild>
                  <Link href="/login">
                    Começar Gratuitamente <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-2" asChild>
                  <Link href="#features">Explorar Recursos</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:block"
            >
              <div className="relative z-10 rounded-2xl border-4 border-white/10 shadow-2xl overflow-hidden bg-black/40 backdrop-blur-3xl aspect-[4/3] flex flex-col">
                <Image
                  src="/assets/marketing/friends-dining.png"
                  alt="Amigas angolanas a usar o SmartMenu"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-6 -right-6 h-20 w-20 bg-orange-500/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="absolute -bottom-6 -left-6 h-16 w-16 bg-primary/20 rounded-full blur-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950/40 border-y">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-4">
                <Zap className="h-3 w-3 fill-current" />
                <span>EXPERIÊNCIA COMPLETA</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">O Seu Restaurante em Piloto Automático</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tecnologia invisível que organiza a sua operação e fideliza os seus clientes, sem complexidade.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Feature 1: Vendas Sugestivas */}
              <Link href="/features/upsell" className="block h-full no-underline">
                <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-all hover:border-blue-500/50 group h-full relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                  <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors relative z-10">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold relative z-10 flex items-center gap-2">
                    Vendas Sugestivas <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                    O sistema sugere (&quot;Que tal um vinho?&quot;) no momento certo, aumentando o consumo de forma natural.
                    <span className="block mt-2 font-medium text-blue-500">+15% Ticket Médio</span>
                  </p>
                </motion.div>
              </Link>

              {/* Feature 2: Club de Pontos */}
              <Link href="/features/loyalty" className="block h-full no-underline">
                <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-all hover:border-purple-500/50 group h-full relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                  <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors relative z-10">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold relative z-10 flex items-center gap-2">
                    O Seu Clube de Pontos <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                    Crie regras próprias (ex: 100 KZ = 1 ponto). Os clientes acumulam saldo e voltam para trocar por prémios.
                    <span className="block mt-2 font-medium text-purple-500">100% Configurável</span>
                  </p>
                </motion.div>
              </Link>

              {/* Feature 3: Context Ordering (Replaced Stock) */}
              <Link href="/features/context-ordering" className="block h-full no-underline">
                <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-all hover:border-orange-500/50 group h-full relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                  <div className="h-12 w-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors relative z-10">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold relative z-10 flex items-center gap-2">
                    Pedidos Multi-Canal <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                    Gerencie pedidos de <strong>Dine-in, Takeaway e Delivery</strong> numa única plataforma centralizada.
                    <span className="block mt-2 font-medium text-orange-500">Gestão 360º</span>
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 relative overflow-hidden">
          {/* Decorative Banner Background */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <Image
              src="/assets/marketing/banner-promo.png"
              alt="Background Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Planos para todos os tamanhos</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Escolha a solução ideal para o seu negócio, desde o pequeno café até à grande cadeia de restaurantes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="relative p-8 bg-background border rounded-3xl space-y-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">50.000</span>
                    <span className="text-muted-foreground">KZ/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ideal para começar a digitalizar.</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Até 50 mesas</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Menu QR Interativo</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Carrinho de Pedidos</li>
                </ul>
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link href="/login?plan=basic">Começar Basic</Link>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="relative p-8 bg-background border-2 border-primary/20 rounded-3xl space-y-6 shadow-2xl shadow-primary/10 scale-105 z-10">
                <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">150.000</span>
                    <span className="text-muted-foreground">KZ/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Para operações que precisam de KDS.</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Até 150 mesas</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary lead" /> <strong>Sistema KDS (Cozinha)</strong></li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Gestão de Estoque</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Dashboards Gerenciais</li>
                </ul>
                <Button className="w-full rounded-full font-bold" asChild>
                  <Link href="/login?plan=pro">Escolher Pro</Link>
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="relative p-8 bg-background border rounded-3xl space-y-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">300.000</span>
                    <span className="text-muted-foreground">KZ/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Para cadeias e franquias.</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Mesas Ilimitadas</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Múltiplos Restaurantes</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Analytics Avançado (AI)</li>
                  <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Suporte Dedicado 24/7</li>
                </ul>
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link href="/contact">Falar com Vendas</Link>
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground italic">
              * Preços indicativos em Kwanzas (KZ). Valores finais sujeitos à confirmação com a equipa comercial.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Simples. Rápido. Eficiente.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Implementação em minutos, resultados no primeiro dia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative items-center">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-[20%] left-[16%] w-[68%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10" />

              <div className="text-center space-y-6 bg-background p-4 relative group">
                <div className="h-24 w-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold border-8 border-background shadow-xl group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold">Scan QR</h3>
                <p className="text-muted-foreground text-sm">O cliente senta e escaneia o código na mesa. Sem apps, sem downloads.</p>
              </div>

              <div className="text-center space-y-6 bg-background p-4 relative group">
                <div className="h-24 w-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold border-8 border-background shadow-xl group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold">Pedido & Upsell</h3>
                <p className="text-muted-foreground text-sm">O menu interativo sugere os melhores pratos e bebidas extra automaticamente.</p>
              </div>

              <div className="text-center space-y-6 bg-background p-4 relative group">
                <div className="relative h-24 w-40 mx-auto rounded-xl overflow-hidden border-4 border-background shadow-xl group-hover:scale-110 transition-transform">
                  <Image
                    src="/assets/marketing/kds-mockup.png"
                    alt="KDS Dashboard"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Cozinha & Entrega</h3>
                <p className="text-muted-foreground text-sm">O pedido vai direto para o KDS da cozinha. Sem gritos, sem erros.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-12 bg-zinc-50 dark:bg-zinc-900 border-y">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              A escolha dos melhores restaurantes de Luanda
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for Partner Logos - Text based for now to keep it lightweight */}
              <span className="text-xl font-bold font-serif">Oon.dah</span>
              <span className="text-xl font-bold font-mono">Cais de Quatro</span>
              <span className="text-xl font-bold font-sans">Lookal</span>
              <span className="text-xl font-bold font-serif">K. Luanda</span>
              <span className="text-xl font-bold font-mono">Nikki Beach</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 p-8 text-white/10 select-none">
              <Utensils className="h-48 w-48 rotate-12" />
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight z-10 relative">
              Pronto para levar seu <br /> negócio ao próximo nível?
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-xl mx-auto z-10 relative">
              Junte-se a dezenas de restaurantes que já modernizaram seu atendimento com SmartMenu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 z-10 relative">
              <Button size="lg" className="h-16 px-10 text-xl font-bold bg-white text-primary hover:bg-zinc-100 rounded-full" asChild>
                <Link href="/login">Criar Conta Grátis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <Utensils className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">SmartMenu</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 SmartMenu. Proudly built for the future of dining.</p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/features/technology" className="hover:text-foreground transition-colors">Tecnologia</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Termos</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
