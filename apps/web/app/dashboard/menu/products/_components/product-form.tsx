'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, Save, X, Plus, Trash2 } from "lucide-react";
import { createProduct, updateProduct } from "../../../../actions/menu";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { getTranslatedValue } from "@/lib/utils";

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export interface OptionValue {
    id?: string;
    name: string | Record<string, string>;
    price: number;
    isAvailable?: boolean;
}

export interface ProductOption {
    id?: string;
    name: string | Record<string, string>;
    description?: string | Record<string, string>;
    minChoices: number;
    maxChoices: number;
    isRequired: boolean;
    values: OptionValue[];
}

export interface ProductInitialData {
    id?: string;
    name: string | Record<string, string>;
    description?: string | Record<string, string>;
    price: number;
    categoryId: string;
    imageUrl?: string;
    isAvailable: boolean;
    images?: { url: string }[];
    options?: ProductOption[];
    upsells?: { upsell: { id: string } }[];
    recommendations?: { recommended: { id: string } }[];
    isFeatured?: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
}

interface FormOptionValue {
    id?: string;
    name: string;
    price: number;
    isAvailable?: boolean;
}

interface FormProductOption {
    id?: string;
    name: string;
    description?: string;
    minChoices: number;
    maxChoices: number;
    isRequired: boolean;
    values: FormOptionValue[];
}

function MarketingSelector({
    title,
    description,
    products,
    selectedIds,
    onChange
}: {
    title: string;
    description: string;
    products: { id: string; name: string | Record<string, string> }[];
    selectedIds: string[];
    onChange: (ids: string[]) => void
}) {
    const [search, setSearch] = useState("");
    const { t, locale } = useTranslation();

    const filtered = products.filter(p =>
        getTranslatedValue(p.name, locale).toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(i => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-bold uppercase tracking-wider text-zinc-500">{title}</Label>
                <p className="text-xs text-zinc-400">{description}</p>
            </div>

            <div className="border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
                <div className="p-3 border-b bg-white dark:bg-zinc-900 sticky top-0 z-10">
                    <Input
                        placeholder={t('common.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-9 text-sm"
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-2 space-y-1">
                    {filtered.length === 0 ? (
                        <p className="text-xs text-center py-4 text-zinc-400">Nenhum produto encontrado</p>
                    ) : (
                        filtered.map(p => (
                            <div
                                key={p.id}
                                onClick={() => toggle(p.id)}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(p.id) ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(p.id) ? 'bg-orange-600 border-orange-600' : 'border-zinc-300 dark:border-zinc-600'}`}>
                                    {selectedIds.includes(p.id) && <Plus className="h-3 w-3 text-white" />}
                                </div>
                                <span className={`text-sm ${selectedIds.includes(p.id) ? 'font-bold text-orange-700 dark:text-orange-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                    {getTranslatedValue(p.name, locale)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
                {selectedIds.length > 0 && (
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border-t text-xs text-center text-zinc-500">
                        {selectedIds.length} selecionado(s)
                    </div>
                )}
            </div>
        </div>
    );
}

export function ProductForm({ categories, initialData, products = [] }: {
    categories: { id: string; name: string | Record<string, string> }[],
    initialData?: ProductInitialData,
    products?: { id: string; name: string | Record<string, string> }[]
}) {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const [gallery, setGallery] = useState<{ url: string; file?: File }[]>(
        initialData?.images?.map((img) => ({ url: img.url })) || []
    );
    const [productOptions, setProductOptions] = useState<FormProductOption[]>(
        initialData?.options?.map(opt => ({
            ...opt,
            name: getTranslatedValue(opt.name, locale),
            description: opt.description ? getTranslatedValue(opt.description, locale) : '',
            values: opt.values.map(v => ({
                ...v,
                name: getTranslatedValue(v.name, locale)
            }))
        })) || []
    );
    const [upsells, setUpsells] = useState<string[]>(
        initialData?.upsells?.map(u => u.upsell.id) || []
    );
    const [recommendations, setRecommendations] = useState<string[]>(
        initialData?.recommendations?.map(r => r.recommended.id) || []
    );
    const router = useRouter();
    const { t, locale } = useTranslation();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            // Main Image
            if (initialData?.id) {
                if (!formData.get('image') || (formData.get('image') as File).size === 0) {
                    formData.append('existingImageUrl', initialData.imageUrl || '');
                }
            }

            // Options
            formData.append('options', JSON.stringify(productOptions));

            // Marketing
            if (upsells.length > 0) formData.append('upsells', JSON.stringify(upsells));
            if (recommendations.length > 0) formData.append('recommendations', JSON.stringify(recommendations));

            if (initialData?.id) {
                await updateProduct(initialData.id, formData);
                toast.success("Produto atualizado com sucesso!");
            } else {
                await createProduct(formData);
                toast.success("Produto criado com sucesso!");
            }
            router.push("/dashboard/menu/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(initialData?.id ? t('dashboard.products.form.error_update') : t('dashboard.products.form.error_create'));
        } finally {
            setLoading(false);
        }
    }

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        setGallery(prev => [...prev, ...newImages]);
    };

    const removeGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form action={handleSubmit} className="relative flex flex-col bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl shadow-orange-500/5 group">
            <ScrollArea className="h-[calc(100vh-14rem)] rounded-[2.5rem]">
                <div className="flex-1 p-8 space-y-12 pb-40">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-12"
                    >
                        {/* Seção: Informações Básicas */}
                        <motion.div variants={item} className="p-8 pb-10 rounded-[2rem] border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02] space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">Informações do Produto</h3>
                                <p className="text-sm text-zinc-500">Defina os detalhes fundamentais para venda.</p>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.name_label')}</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={getTranslatedValue(initialData?.name, locale)}
                                        placeholder={t('dashboard.products.form.name_placeholder')}
                                        required
                                        className="h-14 text-xl font-medium focus-visible:ring-orange-500 bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-2xl"
                                    />
                                    <p className="text-xs text-zinc-500 font-medium italic">{t('dashboard.products.form.name_help')}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="grid gap-2">
                                        <Label htmlFor="categoryId" className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.category_label')}</Label>
                                        <Select name="categoryId" defaultValue={initialData?.categoryId} required>
                                            <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                                                <SelectValue placeholder={t('dashboard.products.form.category_placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {getTranslatedValue(cat.name, locale)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="price" className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.price_label')}</Label>
                                        <div className="relative">
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                defaultValue={initialData?.price}
                                                placeholder={t('dashboard.products.form.price_placeholder')}
                                                required
                                                className="h-12 text-lg font-bold pl-12 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-400">AOA</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.description_label')}</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        defaultValue={getTranslatedValue(initialData?.description, locale)}
                                        placeholder={t('dashboard.products.form.description_placeholder')}
                                        className="min-h-[140px] resize-none rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-orange-500"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Imagem e Status */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div variants={item} className="p-8 rounded-[2rem] border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02] space-y-6">
                                <Label className="text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-500">{t('dashboard.products.form.image_label')}</Label>
                                <div className="space-y-4">
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="cursor-pointer file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPreview(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 transition-all hover:border-orange-500/50 group">
                                        {preview ? (
                                            <Image
                                                src={preview}
                                                alt={t('common.preview')}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <ImageIcon className="mx-auto h-12 w-12 text-zinc-300" />
                                                <p className="text-xs text-zinc-500">{t('dashboard.products.form.image_help')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="p-8 rounded-[2rem] border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02] space-y-6">
                                <Label className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.status_label')}</Label>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 transition-all hover:bg-white dark:hover:bg-zinc-900 bg-white/50 dark:bg-zinc-900/50 shadow-sm">
                                        <input
                                            type="checkbox"
                                            id="isAvailable"
                                            name="isAvailable"
                                            value="true"
                                            defaultChecked={initialData ? initialData.isAvailable : true}
                                            className="h-6 w-6 rounded-lg border-zinc-300 text-orange-600 focus:ring-orange-600 transition-all cursor-pointer"
                                        />
                                        <div className="grid gap-1 leading-none">
                                            <Label htmlFor="isAvailable" className="text-base font-bold cursor-pointer">
                                                {t('dashboard.products.form.available_now')}
                                            </Label>
                                            <p className="text-xs text-zinc-500">
                                                {t('dashboard.products.form.unavailable_help')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-orange-600/5 dark:bg-orange-600/10 p-5 border border-orange-600/10">
                                        <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-500">
                                            <Save className="h-4 w-4" />
                                            <h4 className="text-sm font-black uppercase tracking-tighter">{t('dashboard.products.form.pro_tip')}</h4>
                                        </div>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                            {t('dashboard.products.form.pro_tip_desc')}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Galeria e Opções */}
                        <div className="grid lg:grid-cols-5 gap-8">
                            <motion.div variants={item} className="lg:col-span-2 p-8 rounded-[2rem] border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02] space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.gallery_label')}</Label>
                                    <span className="bg-orange-600/10 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-[10px] font-black">{t('dashboard.products.form.gallery_count', { count: gallery.length })}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {gallery.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group shadow-sm">
                                            <Image src={img.url} alt={`Gallery ${idx}`} fill className="object-cover transition-transform group-hover:scale-110" unoptimized />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 cursor-pointer transition-all bg-white/50 dark:bg-zinc-900/50 group shadow-sm">
                                        <div className="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                                            <Plus className="h-4 w-4 text-zinc-400 group-hover:text-orange-600 transition-colors" />
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Adicionar</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleGalleryChange}
                                        />
                                    </label>
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="lg:col-span-3 p-8 rounded-[2rem] border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02] space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">{t('dashboard.products.form.customization_label')}</h3>
                                        <p className="text-xs text-zinc-500 font-medium">{t('dashboard.products.form.customization_desc')}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => setProductOptions([...productOptions, { name: '', minChoices: 0, maxChoices: 1, isRequired: false, values: [{ name: '', price: 0 }] }])}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-orange-500 text-orange-600 hover:bg-orange-50 font-bold"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('dashboard.products.form.new_group')}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {productOptions.map((group, groupIdx) => (
                                        <div key={groupIdx} className="p-6 rounded-2xl border border-white dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 space-y-6 shadow-sm relative group/card">
                                            <button
                                                type="button"
                                                onClick={() => setProductOptions(productOptions.filter((_, i) => i !== groupIdx))}
                                                className="absolute -top-3 -right-3 h-8 w-8 bg-white dark:bg-zinc-800 border border-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hover:bg-red-50 shadow-lg z-10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.group_name')}</Label>
                                                    <Input
                                                        placeholder={t('dashboard.products.form.group_placeholder')}
                                                        value={group.name as string}
                                                        onChange={(e) => {
                                                            const newOptions = [...productOptions];
                                                            newOptions[groupIdx].name = e.target.value;
                                                            setProductOptions(newOptions);
                                                        }}
                                                        className="h-10 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('dashboard.products.form.max_selection')}</Label>
                                                    <Input
                                                        type="number"
                                                        value={group.maxChoices}
                                                        onChange={(e) => {
                                                            const newOptions = [...productOptions];
                                                            newOptions[groupIdx].maxChoices = parseInt(e.target.value);
                                                            setProductOptions(newOptions);
                                                        }}
                                                        className="h-10 rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3 pl-4 border-l-2 border-orange-600/20">
                                                {group.values.map((val, valIdx) => (
                                                    <div key={valIdx} className="flex gap-2 items-center">
                                                        <Input
                                                            placeholder={t('dashboard.products.form.value_placeholder')}
                                                            value={val.name as string}
                                                            onChange={(e) => {
                                                                const newOptions = [...productOptions];
                                                                newOptions[groupIdx].values[valIdx].name = e.target.value;
                                                                setProductOptions(newOptions);
                                                            }}
                                                            className="h-9 text-sm rounded-lg"
                                                        />
                                                        <div className="w-36 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 pr-2 rounded-lg">
                                                            <span className="text-[10px] font-black text-zinc-400 pl-3">AOA</span>
                                                            <Input
                                                                type="number"
                                                                value={val.price}
                                                                onChange={(e) => {
                                                                    const newOptions = [...productOptions];
                                                                    newOptions[groupIdx].values[valIdx].price = parseFloat(e.target.value);
                                                                    setProductOptions(newOptions);
                                                                }}
                                                                className="h-9 text-xs border-0 bg-transparent focus-visible:ring-0 shadow-none font-bold text-orange-600"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                const newOptions = [...productOptions];
                                                                newOptions[groupIdx].values = newOptions[groupIdx].values.filter((_, iIdx) => iIdx !== valIdx);
                                                                setProductOptions(newOptions);
                                                            }}
                                                            disabled={group.values.length <= 1}
                                                            className="h-8 w-8 text-zinc-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOptions = [...productOptions];
                                                        newOptions[groupIdx].values.push({ name: '', price: 0 });
                                                        setProductOptions(newOptions);
                                                    }}
                                                    className="text-[10px] font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 uppercase tracking-tighter transition-all hover:translate-x-1"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    {t('dashboard.products.form.add_value')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {productOptions.length === 0 && (
                                        <div className="py-12 text-center rounded-3xl border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                                            <Plus className="h-8 w-8 text-zinc-200 mx-auto mb-2" />
                                            <p className="text-xs text-zinc-400 font-medium">Nenhum grupo de opções adicionado.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Marketing e Conversão */}
                        <motion.div variants={item} className="p-8 rounded-[2rem] border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02] space-y-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">Marketing & Conversão</h3>
                                <p className="text-sm text-zinc-500">Configure estratégias para aumentar o ticket médio.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <MarketingSelector
                                    title="Upsell (Upgrade)"
                                    description="Sugestões de itens mais caros ou complementares."
                                    products={products}
                                    selectedIds={upsells}
                                    onChange={setUpsells}
                                />
                                <MarketingSelector
                                    title="Recomendações (Cross-sell)"
                                    description="Itens que combinam perfeitamente com este produto."
                                    products={products}
                                    selectedIds={recommendations}
                                    onChange={setRecommendations}
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Actions Footer - Nested in flow */}
                    <div className="mt-12 flex items-center justify-between gap-4 p-8 bg-zinc-50/50 dark:bg-white/[0.02] rounded-[2rem] border border-zinc-100 dark:border-white/5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold h-12 hover:bg-zinc-100 dark:hover:bg-white/5 px-6 rounded-xl"
                        >
                            <X className="mr-2 h-4 w-4" />
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-600 hover:bg-orange-700 h-12 px-10 min-w-[200px] shadow-xl shadow-orange-600/30 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl text-white"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('dashboard.products.form.processing')}
                                </div>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    {initialData?.id ? t('dashboard.products.form.save_changes') : t('dashboard.products.form.create_product')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </form>
    );
}
