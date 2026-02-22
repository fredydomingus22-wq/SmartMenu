"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { Button, BRAND_COLORS } from "@smart-menu/ui";

/**
 * LandingROICalculator
 * Interactive component to visualize the financial gain of using SmartMenu.
 */
export function LandingROICalculator() {
  const [ordersPerMonth, setOrdersPerMonth] = useState(1000);
  const [avgTicket, setAvgTicket] = useState(15000); // 15,000 KZ

  const results = useMemo(() => {
    const currentRevenue = ordersPerMonth * avgTicket;
    const upsellGain = currentRevenue * 0.15;
    const turnoverGain = currentRevenue * 0.10;
    const totalNewRevenue = currentRevenue + upsellGain + turnoverGain;
    const monthlyGain = totalNewRevenue - currentRevenue;
    
    return {
      monthlyGain,
      yearlyGain: monthlyGain * 12,
      percIncrease: 25
    };
  }, [ordersPerMonth, avgTicket]);

  return (
    <section id="demo" className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-10" 
        style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                Veja o seu <span style={{ color: `oklch(${BRAND_COLORS.orange})` }}>Lucro</span> escalar em tempo real.
              </h2>
              <p className="text-zinc-800 text-lg md:text-xl font-medium leading-relaxed">
                Ajuste os valores abaixo para descobrir quanto o seu restaurante está a deixar na mesa todos os meses por não usar o SmartMenu.
              </p>
            </div>

            <div className="space-y-10 bg-zinc-50 border border-zinc-200 p-8 rounded-[2rem]">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-zinc-700">
                  <span>Pedidos Mensais</span>
                  <span className="text-zinc-900 text-lg">{ordersPerMonth.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100"
                  value={ordersPerMonth}
                  onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: `oklch(${BRAND_COLORS.orange})` }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-zinc-700">
                  <span>Ticket Médio (AOA)</span>
                  <span className="text-zinc-900 text-lg">{avgTicket.toLocaleString()} KZ</span>
                </div>
                <input 
                  type="range" 
                  min="2000" 
                  max="100000" 
                  step="500"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: `oklch(${BRAND_COLORS.orange})` }}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              layout
              className="p-12 rounded-[2.5rem] text-white shadow-2xl flex flex-col items-center text-center space-y-8"
              style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }}
            >
              <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center mb-2">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Estimativa de Ganho Mensal</p>
                <h3 className="text-4xl md:text-6xl font-black tabular-nums">
                  +{results.monthlyGain.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} <span className="text-2xl">KZ</span>
                </h3>
              </div>

              <div className="w-full h-px bg-white/20" />

              <div className="grid grid-cols-2 w-full gap-4">
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Impacto Anual</p>
                  <p className="text-xl font-bold">+{results.yearlyGain.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} KZ</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Aumento Médio</p>
                  <p className="text-xl font-bold">+{results.percIncrease}%</p>
                </div>
              </div>

              <Button size="lg" variant="secondary" className="w-full h-16 rounded-2xl text-primary font-black text-lg bg-white hover:bg-zinc-100 transition-all group" asChild>
                <a href="#cta" style={{ color: `oklch(${BRAND_COLORS.orange})` }}>
                  Garantir este Lucro Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
            
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white border border-zinc-200 p-5 rounded-3xl shadow-xl flex items-center gap-4 max-w-[200px]">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-zinc-700 leading-tight">
                Calculado com base em <span className="text-zinc-950">casos reais</span> de restaurantes em Angola.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
