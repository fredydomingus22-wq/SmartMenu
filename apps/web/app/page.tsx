"use client";

import { Button } from "@/components/ui/button";
import { Utensils, QrCode, ClipboardList, TrendingUp, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
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
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 -right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
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
                <span>PHASE 2 ENGINE AGORA DISPONÍVEL</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                O Futuro da <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  Gastronomia Digital
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Transforme seu restaurante com menus QR interativos, gestão de pedidos em tempo real e inteligência artificial. Premium, rápido e eficiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:justify-start">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full gap-2 shadow-xl shadow-primary/20" asChild>
                  <Link href="/login">
                    Começar Agora <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-2" asChild>
                  <Link href="#features">Ver Demonstração</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:block"
            >
              <div className="relative z-10 rounded-2xl border-4 border-white/10 shadow-2xl overflow-hidden bg-black/40 backdrop-blur-3xl aspect-[16/10] flex flex-col">
                <div className="h-8 bg-white/5 flex items-center px-4 gap-1.5 border-b border-white/5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                  <div className="grid grid-cols-2 gap-4 h-full pb-8">
                    <div className="bg-primary/20 rounded-xl border border-primary/30 p-4 space-y-3">
                      <div className="h-3 w-3/4 bg-primary/40 rounded" />
                      <div className="h-8 w-full bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-20 w-full bg-white/5 rounded-lg" />
                    </div>
                    <div className="bg-zinc-800/40 rounded-xl border border-white/5 p-4 space-y-3">
                      <div className="h-3 w-1/2 bg-white/20 rounded" />
                      <div className="h-24 w-full bg-white/5 rounded-lg flex items-center justify-center">
                        <QrCode className="h-12 w-12 text-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
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

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950/40 border-y">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Potência em cada detalhe</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Desenvolvemos ferramentas robustas para digitalizar a experiência do seu cliente e otimizar sua operação de ponta a ponta.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-shadow group">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <QrCode className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">QR Menu Inteligente</h3>
                <p className="text-muted-foreground">Substitua o papel por uma experiência rica, com fotos, customização e pedidos instantâneos.</p>
              </motion.div>

              <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-shadow group">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Sistema KDS (Cozinha)</h3>
                <p className="text-muted-foreground">Elimine erros com um painel digital intuitivo para gerir os pedidos em tempo real diretamente na cozinha.</p>
              </motion.div>

              <motion.div variants={item} className="p-8 bg-background border rounded-3xl space-y-4 hover:shadow-xl transition-shadow group">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Analytics & Growth</h3>
                <p className="text-muted-foreground">Descubra quais pratos vendem mais e entenda o comportamento dos seus clientes através de dados precisos.</p>
              </motion.div>
            </motion.div>
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
            <Link href="#" className="hover:text-foreground transition-colors">Termos</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
