"use client";

import { useEffect, useState } from "react";
import { SalesChart } from "./sales-chart";
import { SalesTrendData } from "../_types/analytics";
import { getSalesTrend } from "@/app/actions/analytics";
import { getCategories, getProducts } from "@/app/actions/menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Button
} from "@smart-menu/ui";
import { X, Loader2 } from "lucide-react";

interface SalesAnalysisSectionProps {
    initialData: SalesTrendData[];
    startDate?: string;
    endDate?: string;
    locale: string;
}

export function SalesAnalysisSection({
    initialData,
    startDate,
    endDate,
    locale
}: SalesAnalysisSectionProps) {
    const [data, setData] = useState<SalesTrendData[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    // Filters
    const [categories, setCategories] = useState<{ id: string; name: any }[]>([]);
    const [products, setProducts] = useState<{ id: string; name: any; categoryId: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<string>("");

    // Load filter options on mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    getCategories(),
                    getProducts()
                ]);

                if (catsRes?.success && Array.isArray(catsRes.data)) {
                    setCategories(catsRes.data);
                }
                if (prodsRes?.success && Array.isArray(prodsRes.data)) {
                    setProducts(prodsRes.data);
                }
            } catch (error) {
                console.error("Failed to load filter options", error);
            }
        };
        loadOptions();
    }, []);

    // Filter products based on selected category
    const filteredProducts = selectedCategory
        ? products.filter(p => p.categoryId === selectedCategory)
        : products;

    // Refetch data when filters change
    useEffect(() => {
        // Skip first render if using initialData matching default filters (empty)
        if (!selectedCategory && !selectedProduct && data === initialData) return;

        const fetchData = async () => {
            setIsLoading(true);
            const res = await getSalesTrend(startDate, endDate, selectedCategory, selectedProduct);
            if (res.success) {
                setData(res.data);
            }
            setIsLoading(false);
        };

        const debounce = setTimeout(fetchData, 300);
        return () => clearTimeout(debounce);
    }, [selectedCategory, selectedProduct, startDate, endDate, data, initialData]);

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedProduct("");
    };

    const getLocalizedName = (name: any) => {
        if (!name) return "";
        if (typeof name === 'string') return name;
        return name[locale] || name['pt'] || Object.values(name)[0] || "";
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 hidden sm:block">
                    Análise Detalhada
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Todas Categorias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all_cats">Todas Categorias</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {getLocalizedName(cat.name)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Todos Produtos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all_prods">Todos Produtos</SelectItem>
                            {filteredProducts.map((prod) => (
                                <SelectItem key={prod.id} value={prod.id}>
                                    {getLocalizedName(prod.name)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(selectedCategory || selectedProduct) && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={clearFilters}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="relative">
                <SalesChart data={data} />
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 flex items-center justify-center backdrop-blur-[1px]">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                )}
            </div>
        </div>
    );
}
