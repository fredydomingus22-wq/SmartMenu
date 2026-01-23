"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { ChevronRight, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ProductCard } from "./product-card";
import { ProductGrid } from "./product-grid";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Category, MenuConfig, MenuSection } from "../_types";
import { cn } from "@/lib/utils";

interface MenuGridProps {
    categories: Category[];
    config?: MenuConfig | null;
}

export function MenuGrid({ categories, config }: MenuGridProps) {
    const params = useParams();
    const tenantId = params.id as string;
    const [activeCategoryId, setActiveCategoryId] = useState<string | "all">(
        categories.length > 0 ? categories[0].id : "all"
    );

    const [isChangingCategory, setIsChangingCategory] = useState(false);

    const activeCategory = useMemo(() =>
        categories.find(c => c.id === activeCategoryId),
        [categories, activeCategoryId]);

    // Simulate Loading for smoother UX
    const handleCategoryChange = (id: string) => {
        setIsChangingCategory(true);
        setActiveCategoryId(id);
        setTimeout(() => setIsChangingCategory(false), 300); // Small artificial delay for skeleton
    };

    const sections = config?.sections || [
        { type: "hero", isActive: true, config: { title: "Bem-vindo!" } },
        { type: "category_grid", isActive: true }
    ];

    return (
        <div className="space-y-12 sm:space-y-20 pb-12">
            {sections?.map((section: MenuSection, idx: number) => {
                if (!section.isActive) return null;

                switch (section.type) {
                    case "hero":
                        return (
                            <motion.section
                                key={`section-${idx}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-primary shadow-2xl mt-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                {section.config?.imageUrl && (
                                    <Image
                                        src={section.config.imageUrl}
                                        alt="Banner"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 z-20 text-white">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase font-black tracking-widest mb-4 inline-block">
                                            Destaque do Dia
                                        </span>
                                        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 leading-none">
                                            {section.config?.title || "Sabor Incomparável"}
                                        </h1>
                                        <p className="text-base sm:text-lg opacity-80 max-w-lg font-medium leading-relaxed">
                                            {section.config?.subtitle || "Descubra o melhor da nossa cozinha artesanal hoje mesmo."}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.section>
                        );

                    case "featured":
                        const featuredCategory = categories.find(c => c.name.toLowerCase().includes("destaque") || c.name.toLowerCase().includes("queridinhos")) || categories[0];
                        return (
                            <section key={`section-${idx}`} className="space-y-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">{section.config?.label || "Destaque"}</span>
                                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mt-1">{section.config?.title || "Os Queridinhos"}</h2>
                                    </div>
                                    <Button variant="link" className="font-bold gap-1 pr-0 group text-primary">
                                        Ver tudo <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                                <ProductGrid columns={2}>
                                    {featuredCategory?.products.slice(0, 4).map((product) => (
                                        <ProductCard key={product.id} product={product} tenantId={tenantId} />
                                    ))}
                                </ProductGrid>
                            </section>
                        );

                    case "category_grid":
                        return (
                            <div key={`section-${idx}`} className="space-y-10">
                                {/* Horizontal Tabs Navigation */}
                                <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b -mx-4 px-4 py-4 z-[var(--z-category-nav)] overflow-x-auto scrollbar-hide">
                                    <div className="flex gap-2 min-w-max">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryChange(category.id)}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2",
                                                    activeCategoryId === category.id
                                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                                                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Category Content */}
                                <AnimatePresence mode="wait">
                                    <motion.section
                                        key={activeCategoryId}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic px-4 py-1">
                                                {activeCategory?.name}
                                            </h2>
                                            <div className="h-px bg-border flex-1" />
                                        </div>

                                        {isChangingCategory ? (
                                            <ProductGrid columns={4}>
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <ProductCardSkeleton key={i} />
                                                ))}
                                            </ProductGrid>
                                        ) : (
                                            <ProductGrid columns={4}>
                                                {activeCategory?.products.map((product) => (
                                                    <ProductCard key={product.id} product={product} tenantId={tenantId} />
                                                ))}
                                            </ProductGrid>
                                        )}

                                        {activeCategory?.products.length === 0 && (
                                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                                <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center">
                                                    <UtensilsCrossed className="w-10 h-10 text-muted-foreground/50" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold tracking-tight">Categoria Vazia</h3>
                                                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                                                        Ainda não adicionamos delícias nesta seção. Experimente outra categoria!
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setActiveCategoryId(categories.find(c => c.products.length > 0)?.id || "all")}
                                                    className="mt-4 border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5"
                                                >
                                                    Explorar Outras Opções
                                                </Button>
                                            </div>
                                        )}
                                    </motion.section>
                                </AnimatePresence>
                            </div>
                        );

                    case "global_upsell":
                        return (
                            <div key={`section-${idx}`} className="w-full mt-20 sm:mt-32">
                                <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] w-full rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer shadow-xl">
                                    <Image
                                        src={section.config?.imageUrl || "https://images.unsplash.com/photo-1551024601-bec78acc704b?auto=format&fit=crop&q=80&w=1000"}
                                        alt={section.config?.title || "Banner Promocional"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8 sm:p-12 text-white">
                                        <span className="text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs mb-2">Momento Doce</span>
                                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2">
                                            {section.config?.title || "Espaço para Sobremesa?"}
                                        </h2>
                                        <p className="text-sm sm:text-base md:text-lg opacity-80 max-w-xs sm:max-w-md font-medium mb-6">
                                            {section.config?.subtitle || "Confira nossas opções artesanais para fechar com chave de ouro."}
                                        </p>

                                        {section.config?.buttonText && (
                                            <Button className="w-fit bg-primary hover:bg-primary/90 text-white border-0 font-bold rounded-full px-8">
                                                {section.config.buttonText}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
