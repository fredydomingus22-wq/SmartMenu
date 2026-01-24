'use client';

import { useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ImageIcon, Trash2, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { apiClient } from '@/utils/api-client';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';
import { getTranslatedValue } from "@/lib/utils";

interface Product {
    id: string;
    name: string | Record<string, string>;
    description?: string | Record<string, string> | null;
    price: number | string;
    imageUrl: string | null;
    isAvailable: boolean;
    category?: { name: string | Record<string, string> };
}

interface ProductListClientProps {
    initialProducts: Product[];
}

export function ProductListClient({ initialProducts }: ProductListClientProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { t, locale } = useTranslation();

    console.log(`[ProductListClient] Hydrating with ${initialProducts?.length} products. Locale: ${locale}`);

    const toggleSelectAll = () => {
        if (selectedIds.length === initialProducts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(initialProducts.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!confirm(t('dashboard.products.delete_confirm', { count: selectedIds.length }))) return;

        startTransition(async () => {
            try {
                await apiClient.post('/products/bulk/delete', { ids: selectedIds });
                toast.success(t('dashboard.products.delete_success'));
                setSelectedIds([]);
                router.refresh();
            } catch (error) {
                toast.error(t('dashboard.products.delete_error'));
            }
        });
    };

    const handleBulkAvailability = async (isAvailable: boolean) => {
        startTransition(async () => {
            try {
                await apiClient.patch('/products/bulk/availability', { ids: selectedIds, isAvailable });
                toast.success(t('dashboard.products.update_success'));
                setSelectedIds([]);
                router.refresh();
            } catch (error) {
                toast.error(t('dashboard.products.update_error'));
            }
        });
    };

    const handleDuplicate = async (id: string) => {
        startTransition(async () => {
            try {
                await apiClient.post(`/products/${id}/duplicate`);
                toast.success(t('dashboard.products.duplicate_success'));
                router.refresh();
            } catch (error) {
                toast.error(t('dashboard.products.duplicate_error'));
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between sticky top-0 z-20 py-2 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-md -mx-4 px-4 rounded-b-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="select-all"
                            checked={selectedIds.length === initialProducts.length && initialProducts.length > 0}
                            onCheckedChange={toggleSelectAll}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium leading-none cursor-pointer">
                            {t('dashboard.products.select_all')}
                        </label>
                    </div>
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full border border-orange-100 dark:border-orange-900/30">
                                {t('dashboard.products.selected_count', { count: selectedIds.length })}
                            </span>
                        </div>
                    )}
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2"
                            onClick={() => handleBulkAvailability(true)}
                            disabled={isPending}
                        >
                            <Eye className="h-4 w-4" />
                            Disponível
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2"
                            onClick={() => handleBulkAvailability(false)}
                            disabled={isPending}
                        >
                            <EyeOff className="h-4 w-4" />
                            Indisponível
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-9 gap-2"
                            onClick={handleBulkDelete}
                            disabled={isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                            {t('dashboard.products.delete')}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {initialProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
                        <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">{t('dashboard.products.empty')}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-6">{t('dashboard.products.empty_desc')}</p>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700">
                            <Link href="/dashboard/menu/products/new">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('dashboard.products.add_new')}
                            </Link>
                        </Button>
                    </div>
                ) : (
                    initialProducts.map((product) => (
                        <Card
                            key={product.id}
                            className={`group relative overflow-hidden border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-lg py-0 ${selectedIds.includes(product.id) ? 'ring-2 ring-orange-500 border-orange-200' : ''
                                }`}
                        >
                            <div className="absolute top-3 left-3 z-30">
                                <Checkbox
                                    checked={selectedIds.includes(product.id)}
                                    onCheckedChange={() => toggleSelect(product.id)}
                                    className="h-5 w-5 bg-white/80 backdrop-blur-sm border-zinc-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 shadow-sm"
                                />
                            </div>

                            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={getTranslatedValue(product.name, locale)}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${product.isAvailable
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {product.isAvailable ? t('dashboard.products.status_active') : t('dashboard.products.status_unavailable')}
                                    </span>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2 space-y-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                                        {getTranslatedValue(product.category?.name, locale)}
                                    </p>
                                    <p className="font-black text-zinc-900 dark:text-zinc-50">
                                        {(() => {
                                            try {
                                                return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(Number(product.price));
                                            } catch (e) {
                                                console.warn("Intl format failed for product:", product.id);
                                                return `${product.price} Kz`;
                                            }
                                        })()}
                                    </p>
                                </div>
                                <CardTitle className="text-lg leading-tight px-0">{getTranslatedValue(product.name, locale)}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 min-h-[2.5rem] mb-4">
                                    {getTranslatedValue(product.description, locale) || t('dashboard.products.no_desc')}
                                </p>
                                <div className="flex items-center justify-between gap-2 border-t pt-4 border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-500 hover:text-orange-600 hover:bg-orange-50"
                                            onClick={() => handleDuplicate(product.id)}
                                            disabled={isPending}
                                            title={t('common.duplicate')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-8 font-bold" asChild>
                                            <Link href={`/dashboard/menu/products/${product.id}/edit`}>
                                                {t('common.edit')}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {isPending && (
                <div className="fixed inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-[1px] flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-full shadow-2xl border flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                        <span className="text-sm font-bold">{t('dashboard.products.processing')}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
