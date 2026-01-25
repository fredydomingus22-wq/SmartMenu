"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@smart-menu/ui";
import { Button } from "@smart-menu/ui";
import { apiClient } from "@/utils/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { ProductGrid } from "./product-grid";

interface ProductSearchProps {
    tenantId: string;
    onClose?: () => void;
}

export function ProductSearch({ tenantId, onClose }: ProductSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await apiClient.get(`/public/menu/${tenantId}/search?q=${encodeURIComponent(searchQuery)}`);
            setResults(data as any[]);
            setHasSearched(true);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [tenantId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="O que você deseja hoje? (ex: Hamburguer, Pizza...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 pr-12 h-14 text-lg rounded-2xl border-2 focus-visible:ring-primary/20 bg-muted/30"
                    autoFocus
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                    >
                        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                        <p className="font-medium">Buscando as melhores opções...</p>
                    </motion.div>
                ) : hasSearched && results.length > 0 ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                            Encontramos {results.length} coincidências
                        </h3>
                        <ProductGrid columns={4}>
                            {results.map((product) => (
                                <ProductCard key={product.id} product={product} tenantId={tenantId} />
                            ))}
                        </ProductGrid>
                    </motion.div>
                ) : hasSearched && query.length >= 2 ? (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Nenhum resultado para "{query}"</h3>
                            <p className="text-muted-foreground">Tente buscar por outro termo ou categoria.</p>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
