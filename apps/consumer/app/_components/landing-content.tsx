"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    AppShell,
    PageContainer,
    QRScannerOverlay,
    RecentVisitCard,
    GlobalLoyaltySummary,
    useRecentVisits,
    Button,
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@smart-menu/ui";
import { DiscoverySection } from "./discovery-section";
import { QrCode, User, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export function LandingContent() {
    const router = useRouter();
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const { visits } = useRecentVisits();
    const [loyaltyData, setLoyaltyData] = useState({ points: 0, restaurantsCount: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkAuthAndFetchLoyalty = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsLoggedIn(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                try {
                    const res = await fetch(`${apiUrl}/loyalty/global-summary`, {
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setLoyaltyData(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch loyalty summary", err);
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        checkAuthAndFetchLoyalty();
    }, [supabase]);

    const handleScanSuccess = (url: string) => {
        setIsScannerOpen(false);
        try {
            const urlObj = new URL(url);
            // Include pathname, search (query params), and hash
            const fullPath = urlObj.pathname + urlObj.search + urlObj.hash;
            router.push(fullPath);
        } catch {
            // If it's not a full URL, try to parse as ID
            router.push(`/menu/${url}`);
        }
    };

    return (
        <AppShell className="bg-white dark:bg-zinc-950 bg-background" safeArea={true}>
            <PageContainer size="sm" className="pt-12 pb-24 space-y-12">
                {/* Header / Brand */}
                <div className="flex items-center justify-between">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-black italic tracking-tighter"
                    >
                        Smart<span className="text-orange-700 dark:text-orange-400">Menu</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(isLoggedIn ? '/account' : '/auth/loyalty-welcome?returnTo=/account')}
                            className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm"
                        >
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
                            <span className="text-orange-700 dark:text-orange-400 font-black italic">fazer seu pedido?</span>
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

                {/* Persuasive Loyalty Card */}
                <GlobalLoyaltySummary
                    points={loyaltyData.points}
                    restaurantsCount={loyaltyData.restaurantsCount}
                    onClick={() => router.push(isLoggedIn ? '/loyalty' : '/auth/loyalty-welcome')}
                    showMarketingState={!isLoggedIn || loyaltyData.points === 0}
                />

                {/* Recent Visits */}
                {visits.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Vistos Recentemente</h3>
                            <button className="text-[10px] font-black uppercase text-orange-700 dark:text-orange-400 tracking-tighter hover:underline">Ver tudo</button>
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

                {/* Discovery / Nearby Section */}
                <DiscoverySection />

                {/* All Restaurants Section (Temporary) */}
                <AllRestaurantsSection />
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
            <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-md h-16 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl flex items-center justify-evenly z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-orange-700 dark:text-orange-400 flex flex-col items-center gap-1"
                >
                    <QrCode className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Scan</span>
                </button>
                <button
                    onClick={() => router.push(isLoggedIn ? '/loyalty' : '/auth/loyalty-welcome')}
                    className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors"
                >
                    <Star className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Pontos</span>
                </button>
                <button
                    onClick={() => router.push(isLoggedIn ? '/account' : '/auth/loyalty-welcome?returnTo=/account')}
                    className="text-zinc-400 hover:text-zinc-600 flex flex-col items-center gap-1 transition-colors"
                >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Conta</span>
                </button>
            </div>
        </AppShell>
    );
}

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    description?: string;
    images?: string[];
    branding?: {
        logoUrl?: string;
    };
}

function AllRestaurantsSection() {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                const res = await fetch(`${apiUrl}/tenants/all`);
                if (res.ok) {
                    const data = await res.json();
                    setRestaurants(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Todos os Restaurantes</h3>
                </div>
            </div>

            <div className="grid gap-4">
                {restaurants.map((rest, idx) => (
                    <motion.button
                        key={rest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => router.push(`/menu/${rest.id}`)}
                        className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4 text-left">
                            <Avatar className="w-14 h-14 border-2 border-orange-500/10">
                                <AvatarImage src={rest.branding?.logoUrl || rest.images?.[0]} alt={rest.name} />
                                <AvatarFallback className="bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold">{rest.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{rest.name}</h4>
                                <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">
                                    {rest.description || "Sem descrição"}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
