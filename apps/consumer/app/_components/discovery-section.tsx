"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Loader2, ChevronRight } from "lucide-react";
import {
    Button,
    useGeolocation,
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@smart-menu/ui";
import { useRouter } from "next/navigation";

interface NearbyRestaurant {
    id: string;
    name: string;
    logoUrl?: string;
    distance: string;
    description: string;
}

export function DiscoverySection() {
    const router = useRouter();
    const { loading, error, coords, getPosition } = useGeolocation();
    const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
    const [fetching, setFetching] = useState(false);

    // Real API call for nearby restaurants
    useEffect(() => {
        if (coords) {
            setFetching(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            fetch(`${apiUrl}/tenants/nearby?lat=${coords.latitude}&lng=${coords.longitude}&radius=5000`)
                .then(res => res.json())
                .then(data => {
                    setRestaurants(data);
                    setFetching(false);
                })
                .catch(err => {
                    console.error("Error fetching nearby restaurants", err);
                    setFetching(false);
                });
        }
    }, [coords]);

    if (!coords) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-xl shadow-orange-500/5 flex flex-col items-center text-center gap-6"
            >
                <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                    <MapPin className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Descobrir Sabores</h4>
                    <p className="text-sm text-zinc-500 max-w-[240px] mx-auto">
                        Ative sua localização para encontrar os melhores menus ao seu redor.
                    </p>
                </div>
                <Button
                    onClick={getPosition}
                    disabled={loading}
                    className="h-12 px-8 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold gap-2 group transition-all active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Navigation className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                    Ativar Localização
                </Button>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Perto de você</h3>
                </div>
                <button className="text-[10px] font-black uppercase text-orange-600 tracking-tighter">Limpar</button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {fetching ? (
                        [1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-24 w-full rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 animate-pulse"
                            />
                        ))
                    ) : (
                        restaurants.map((rest, idx) => (
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
                                        <AvatarImage src={rest.logoUrl} alt={rest.name} />
                                        <AvatarFallback className="bg-orange-50 text-orange-600 font-bold">{rest.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{rest.name}</h4>
                                            <span className="text-[9px] font-black bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2 py-0.5 rounded-full">
                                                {rest.distance}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">
                                            {rest.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-orange-600 group-hover:bg-orange-50 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </motion.button>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
