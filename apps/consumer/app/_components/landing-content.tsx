"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    QRScannerOverlay,
    RecentVisitCard,
    GlobalLoyaltySummary,
    useRecentVisits,
    Button
} from "@smart-menu/ui";
import { QrCode, User, MapPin, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingContent() {
    const router = useRouter();
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const { visits } = useRecentVisits();

    // Mock user points (will be fetched from API in full implementation)
    const userPoints = 450;
    const restaurantsCount = 3;

    const handleScanSuccess = (url: string) => {
        setIsScannerOpen(false);
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            router.push(path);
        } catch {
            // If it's not a full URL, try to parse as ID
            router.push(`/menu/${url}`);
        }
    };

    return (
        <AppShell className="bg-zinc-50 dark:bg-black">
            <PageContainer size="sm" className="pt-12 pb-24 space-y-12">
                {/* Header / Brand */}
                <div className="flex items-center justify-between">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-black italic tracking-tighter"
                    >
                        Smart<span className="text-orange-600">Menu</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                            <User className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>

                {/* Hero / Main CTA */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                        >
                            Pronto para <br />
                            <span className="text-orange-600 font-black italic">fazer seu pedido?</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-500 font-medium"
                        >
                            Escaneie o código na mesa ou explore seus lugares favoritos.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button
                            onClick={() => setIsScannerOpen(true)}
                            className="w-full h-20 rounded-[2.5rem] bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold shadow-2xl shadow-orange-600/30 gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <QrCode className="w-6 h-6" />
                            </div>
                            Escanear Menu
                        </Button>
                    </motion.div>
                </div>

                {/* Global Loyalty Summary */}
                <GlobalLoyaltySummary points={userPoints} restaurantsCount={restaurantsCount} />

                {/* Recent Visits */}
                {visits.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Vistos Recentemente</h3>
                            <button className="text-[10px] font-black uppercase text-orange-600 tracking-tighter hover:underline">Ver tudo</button>
                        </div>
                        <div className="space-y-3">
                            {visits.map((visit) => (
                                <RecentVisitCard
                                    key={visit.id}
                                    visit={visit}
                                    onClick={() => router.push(`/menu/${visit.id}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Discovery / Nearby (Placeholder) */}
                <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                        <MapPin className="ml-0.5 mt-0.5 w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50">Explorar arredores</h4>
                        <p className="text-xs text-zinc-400 max-w-[200px]">Encontre restaurantes parceiros perto de você.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 dark:border-white/10 font-bold">
                        Habilitar GPS
                    </Button>
                </div>
            </PageContainer>

            {/* Modal Scanner */}
            <AnimatePresence>
                {isScannerOpen && (
                    <QRScannerOverlay
                        onScanSuccess={handleScanSuccess}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Footer Nav (Floating style) */}
            <div className="fixed bottom-6 left-6 right-6 h-16 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl flex items-center justify-around px-8">
                <button className="text-orange-600 flex flex-col items-center gap-1">
                    <QrCode className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Scan</span>
                </button>
                <button className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors">
                    <Star className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Pontos</span>
                </button>
                <button className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Conta</span>
                </button>
            </div>
        </AppShell>
    );
}
