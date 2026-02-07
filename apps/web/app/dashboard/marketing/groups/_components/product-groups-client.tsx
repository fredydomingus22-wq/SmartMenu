"use client";

import { useState } from "react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Switch, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Checkbox } from "@smart-menu/ui";
import { toast } from "sonner";
import { Package, Plus, Trash2, Save, Edit, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/api-client";
import Image from "next/image";



interface ProductGroup {
    id?: string;
    name: Record<string, string>;
    slug: string;
    description: Record<string, string> | null;
    imageUrl: string | null;
    isActive: boolean;
    items: Array<{
        id: string;
        order: number;
        product: {
            id: string;
            name: Record<string, string>;
            imageUrl: string | null;
        };
    }>;
}

interface Product {
    id: string;
    name: Record<string, string>;
    imageUrl: string | null;
}

interface ProductGroupsClientProps {
    initialGroups: ProductGroup[];
    products: Product[];
}

function getLocalizedName(name: Record<string, string> | string): string {
    if (typeof name === 'string') return name;
    return name?.pt || name?.en || Object.values(name)[0] || '';
}

export function ProductGroupsClient({ initialGroups, products }: ProductGroupsClientProps) {
    const [groups, setGroups] = useState<ProductGroup[]>(initialGroups);
    const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const openCreateDialog = () => {
        setEditingGroup({
            name: { pt: '', en: '' },
            slug: '',
            description: { pt: '', en: '' },
            imageUrl: '',
            isActive: true,
            items: [],
        });
        setSelectedProducts([]);
        setIsDialogOpen(true);
    };

    const openEditDialog = (group: ProductGroup) => {
        setEditingGroup(group);
        setSelectedProducts(group.items.map(i => i.product.id));
        setIsDialogOpen(true);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const updateGroupField = (field: keyof ProductGroup, value: unknown) => {
        if (!editingGroup) return;
        setEditingGroup({ ...editingGroup, [field]: value });
    };

    const updateGroupI18n = (field: 'name' | 'description', lang: string, value: string) => {
        if (!editingGroup) return;
        const current = editingGroup[field] || {};
        setEditingGroup({ ...editingGroup, [field]: { ...current, [lang]: value } });

        // Auto-generate slug from PT name
        if (field === 'name' && lang === 'pt' && !editingGroup.id) {
            setEditingGroup(prev => prev ? { ...prev, slug: generateSlug(value), name: { ...prev.name, [lang]: value } } : null);
        }
    };

    const toggleProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const saveGroup = async () => {
        if (!editingGroup) return;
        setSaving(true);

        try {
            const payload = {
                name: editingGroup.name,
                slug: editingGroup.slug,
                description: editingGroup.description,
                imageUrl: editingGroup.imageUrl,
                isActive: editingGroup.isActive,
                productIds: selectedProducts,
            };

            if (editingGroup.id) {
                const updated = await apiClient<ProductGroup>(`/marketing/groups/${editingGroup.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
                setGroups(groups.map(g => g.id === updated.id ? updated : g));
            } else {
                const created = await apiClient<ProductGroup>('/marketing/groups', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                setGroups([...groups, created]);
            }

            setIsDialogOpen(false);
            setEditingGroup(null);
            toast.success(editingGroup.id ? "Grupo atualizado!" : "Grupo criado!");
        } catch (error) {
            console.error('Error saving group:', error);
            toast.error("Erro ao guardar grupo");
        } finally {
            setSaving(false);
        }
    };

    const deleteGroup = async (id: string) => {
        try {
            await apiClient(`/marketing/groups/${id}`, { method: 'DELETE' });
            setGroups(groups.filter(g => g.id !== id));
            toast.success("Grupo removido");
        } catch {
            toast.error("Erro ao remover grupo");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={openCreateDialog} className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Grupo
                </Button>
            </div>

            <AnimatePresence>
                {groups.length === 0 ? (
                    <Card className="border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
                        <CardContent className="py-12 text-center">
                            <Package className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                            <p className="text-sm text-zinc-500">Nenhum grupo de produtos criado</p>
                            <Button variant="link" onClick={openCreateDialog} className="text-orange-600 mt-2">
                                Criar primeiro grupo
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {groups.map((group) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-base">
                                                        {getLocalizedName(group.name)}
                                                    </CardTitle>
                                                    {group.isActive ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Ativo</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-zinc-500">Inativo</Badge>
                                                    )}
                                                </div>
                                                <CardDescription className="flex items-center gap-1.5">
                                                    <LinkIcon className="h-3 w-3" />
                                                    /grupos/{group.slug}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(group)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteGroup(group.id!)} className="text-red-500 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-zinc-500 mb-3">
                                            {group.items.length} produto(s) neste grupo
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {group.items.slice(0, 5).map((item) => (
                                                <Badge key={item.id} variant="secondary" className="text-xs">
                                                    {getLocalizedName(item.product.name)}
                                                </Badge>
                                            ))}
                                            {group.items.length > 5 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{group.items.length - 5} mais
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            {editingGroup?.id ? 'Editar Grupo' : 'Novo Grupo de Produtos'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure os detalhes do grupo de produtos, incluindo nome, produtos e opções de exibição.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-4">
                        <div className="space-y-6 py-4">
                            {/* Nome */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome (PT)</Label>
                                    <Input
                                        value={editingGroup?.name?.pt || ''}
                                        onChange={(e) => updateGroupI18n('name', 'pt', e.target.value)}
                                        placeholder="Ex: Promoções da Semana"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nome (EN)</Label>
                                    <Input
                                        value={editingGroup?.name?.en || ''}
                                        onChange={(e) => updateGroupI18n('name', 'en', e.target.value)}
                                        placeholder="Ex: Weekly Deals"
                                    />
                                </div>
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <Label>Slug (URL)</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-zinc-500">/grupos/</span>
                                    <Input
                                        value={editingGroup?.slug || ''}
                                        onChange={(e) => updateGroupField('slug', e.target.value)}
                                        placeholder="promocoes-semana"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            {/* Descrição */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Descrição (PT)</Label>
                                    <Input
                                        value={editingGroup?.description?.pt || ''}
                                        onChange={(e) => updateGroupI18n('description', 'pt', e.target.value)}
                                        placeholder="Descrição opcional"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descrição (EN)</Label>
                                    <Input
                                        value={editingGroup?.description?.en || ''}
                                        onChange={(e) => updateGroupI18n('description', 'en', e.target.value)}
                                        placeholder="Optional description"
                                    />
                                </div>
                            </div>

                            {/* Ativo */}
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={editingGroup?.isActive || false}
                                    onCheckedChange={(checked) => updateGroupField('isActive', checked)}
                                />
                                <Label>Grupo ativo (visível no menu)</Label>
                            </div>

                            {/* Seleção de Produtos */}
                            <div className="space-y-3">
                                <Label>Produtos no Grupo ({selectedProducts.length} selecionados)</Label>
                                <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b last:border-b-0 cursor-pointer"
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            <Checkbox
                                                checked={selectedProducts.includes(product.id)}
                                                onCheckedChange={() => toggleProduct(product.id)}
                                            />
                                            {product.imageUrl && (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={getLocalizedName(product.name)}
                                                    width={32}
                                                    height={32}
                                                    className="rounded object-cover"
                                                />
                                            )}
                                            <span className="text-sm">
                                                {getLocalizedName(product.name)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={saveGroup} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                            {saving ? 'A guardar...' : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
