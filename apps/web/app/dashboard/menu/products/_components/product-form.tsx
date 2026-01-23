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

interface OptionValue {
    id?: string;
    name: string;
    price: number;
    isAvailable?: boolean;
}

interface ProductOption {
    id?: string;
    name: string;
    description?: string;
    minChoices: number;
    maxChoices: number;
    isRequired: boolean;
    values: OptionValue[];
}

interface ProductInitialData {
    id?: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    imageUrl?: string;
    isAvailable: boolean;
    images?: { url: string }[];
    options?: ProductOption[];
}

export function ProductForm({ categories, initialData }: {
    categories: { id: string; name: string }[],
    initialData?: ProductInitialData
}) {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const [gallery, setGallery] = useState<{ url: string; file?: File }[]>(
        initialData?.images?.map((img) => ({ url: img.url })) || []
    );
    const [productOptions, setProductOptions] = useState<ProductOption[]>(
        initialData?.options || []
    );
    const router = useRouter();

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

            if (initialData?.id) {
                await updateProduct(initialData.id, formData);
                toast.success("Produto atualizado com sucesso!");
            } else {
                await createProduct(formData);
                toast.success("Produto criado com sucesso!");
            }
            router.push("/dashboard/menu/products");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error(initialData?.id ? "Erro ao atualizar produto." : "Erro ao criar produto.");
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
        <form action={handleSubmit} className="flex flex-col bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-white/5 shadow-2xl shadow-orange-500/5 overflow-hidden min-h-[600px] h-[calc(100vh-18rem)]">
            <div className="flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="p-8 space-y-8 pb-12"
                    >
                        {/* Nome do Produto */}
                        <motion.div variants={item} className="grid gap-2">
                            <Label htmlFor="name" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Nome do Produto</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={initialData?.name}
                                placeholder="Ex: Picanha na Brasa"
                                required
                                className="h-12 text-lg focus-visible:ring-orange-500"
                            />
                            <p className="text-sm text-zinc-500">O nome que aparecerá no menu digital para os clientes.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div variants={item} className="grid gap-2">
                                <Label htmlFor="categoryId" className="font-semibold">Categoria</Label>
                                <Select name="categoryId" defaultValue={initialData?.categoryId} required>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>

                            <motion.div variants={item} className="grid gap-2">
                                <Label htmlFor="price" className="font-semibold">Preço (AOA)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={initialData?.price}
                                    placeholder="5500.00"
                                    required
                                    className="h-11"
                                />
                            </motion.div>
                        </div>

                        <motion.div variants={item} className="grid gap-2">
                            <Label htmlFor="description" className="font-semibold">Descrição do Item</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={initialData?.description}
                                placeholder="Descreva os ingredientes, modo de preparo ou acompanhamentos..."
                                className="min-h-[120px] resize-none"
                            />
                        </motion.div>

                        {/* Imagem Principal */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div variants={item} className="grid gap-4">
                                <Label className="font-semibold text-orange-600 dark:text-orange-500">Imagem Principal (Capa)</Label>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="cursor-pointer"
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
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 transition-colors hover:border-orange-500/50">
                                        {preview ? (
                                            <Image
                                                src={preview}
                                                alt="Previsão"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <ImageIcon className="mx-auto h-12 w-12 text-zinc-300" />
                                                <p className="text-xs text-zinc-500">Foto que aparecerá na listagem</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="space-y-6">
                                <Label className="font-semibold">Status e Visibilidade</Label>
                                <div className="flex items-center space-x-3 rounded-xl border p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        name="isAvailable"
                                        value="true"
                                        defaultChecked={initialData ? initialData.isAvailable : true}
                                        className="h-5 w-5 rounded border-zinc-300 text-orange-600 focus:ring-orange-600"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="isAvailable" className="text-sm font-medium leading-none cursor-pointer">
                                            Disponível para pedido agora
                                        </Label>
                                        <p className="text-xs text-zinc-500">
                                            Se desativado, o item aparecerá como &quot;Esgotado&quot;.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-100 dark:border-zinc-800">
                                    <h4 className="text-sm font-semibold mb-2">Dica Profissional</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Use a galeria abaixo para mostrar detalhes dos ingredientes ou do prato pronto de diferentes ângulos.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Galeria de Imagens */}
                        <motion.div variants={item} className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold text-zinc-900 dark:text-zinc-50">Galeria de Fotos (Opcional)</Label>
                                <span className="text-xs text-zinc-500">{gallery.length} fotos selecionadas</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {gallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-zinc-100 dark:bg-zinc-800 group">
                                        <Image src={img.url} alt={`Gallery ${idx}`} fill className="object-cover" unoptimized />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-orange-500 cursor-pointer transition-colors bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <ImageIcon className="h-6 w-6 text-zinc-400" />
                                    <span className="text-[10px] mt-1 text-zinc-500 text-center px-2">Adicionar Fotos</span>
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

                        {/* Opções de Produto */}
                        <motion.div variants={item} className="space-y-6 pt-6 border-t pb-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Opções de Customização</Label>
                                    <p className="text-sm text-zinc-500">Adicione acompanhamentos, molhos ou variações.</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => setProductOptions([...productOptions, { name: '', minChoices: 0, maxChoices: 1, isRequired: false, values: [{ name: '', price: 0 }] }])}
                                    variant="outline"
                                    size="sm"
                                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Grupo
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {productOptions.map((group, groupIdx) => (
                                    <div key={groupIdx} className="p-6 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nome do Grupo</Label>
                                                    <Input
                                                        placeholder="Ex: Escolha o molho"
                                                        value={group.name}
                                                        onChange={(e) => {
                                                            const newOptions = [...productOptions];
                                                            newOptions[groupIdx].name = e.target.value;
                                                            setProductOptions(newOptions);
                                                        }}
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div className="flex items-end gap-2">
                                                    <div className="flex-1 space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Seleção Max.</Label>
                                                        <Input
                                                            type="number"
                                                            value={group.maxChoices}
                                                            onChange={(e) => {
                                                                const newOptions = [...productOptions];
                                                                newOptions[groupIdx].maxChoices = parseInt(e.target.value);
                                                                setProductOptions(newOptions);
                                                            }}
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setProductOptions(productOptions.filter((_, i) => i !== groupIdx));
                                                        }}
                                                        className="text-red-500 hover:bg-red-50 h-10 w-10 shrink-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-3">
                                            {group.values.map((val, valIdx) => (
                                                <div key={valIdx} className="flex gap-3 items-center">
                                                    <Input
                                                        placeholder="Ex: Alho e Ervas"
                                                        value={val.name}
                                                        onChange={(e) => {
                                                            const newOptions = [...productOptions];
                                                            newOptions[groupIdx].values[valIdx].name = e.target.value;
                                                            setProductOptions(newOptions);
                                                        }}
                                                        className="h-9 text-sm"
                                                    />
                                                    <div className="w-32 flex items-center gap-2">
                                                        <span className="text-xs text-zinc-400">AOA</span>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={val.price}
                                                            onChange={(e) => {
                                                                const newOptions = [...productOptions];
                                                                newOptions[groupIdx].values[valIdx].price = parseFloat(e.target.value);
                                                                setProductOptions(newOptions);
                                                            }}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            const newOptions = [...productOptions];
                                                            newOptions[groupIdx].values = newOptions[groupIdx].values.filter((_, iIdx: number) => iIdx !== valIdx);
                                                            setProductOptions(newOptions);
                                                        }}
                                                        disabled={group.values.length <= 1}
                                                        className="h-8 w-8 text-zinc-400 hover:text-red-500"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const newOptions = [...productOptions];
                                                    newOptions[groupIdx].values.push({ name: '', price: 0 });
                                                    setProductOptions(newOptions);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                className="text-orange-600 hover:text-orange-700 h-8"
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                Adicionar Valor
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </ScrollArea>
            </div>

            {/* Sticky Actions Footer */}
            <div className="flex-shrink-0 p-4 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md border-t flex items-center justify-between gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-zinc-500 hover:text-zinc-900"
                >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 h-11 px-8 min-w-[160px] shadow-lg shadow-orange-600/20"
                >
                    {loading ? (
                        "A processar..."
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData?.id ? "Guardar Alterações" : "Criar Produto"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
