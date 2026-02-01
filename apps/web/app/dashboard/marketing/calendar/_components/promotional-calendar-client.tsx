"use client";

import { useState } from "react";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Switch, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ScrollArea } from "@smart-menu/ui";
import { toast } from "sonner";
import { Calendar, Plus, Trash2, Save, Star, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/api-client";

interface PromotionalSchedule {
    id?: string;
    productId: string;
    startDate: string;
    endDate: string | null;
    isSpecial: boolean;
    label: string | null;
    discount: number | null;
    product?: {
        id: string;
        name: Record<string, string>;
        imageUrl: string | null;
    };
}

interface Product {
    id: string;
    name: Record<string, string>;
    imageUrl: string | null;
}

interface PromotionalCalendarClientProps {
    initialPromotions: PromotionalSchedule[];
    products: Product[];
}

function getLocalizedName(name: Record<string, string> | string): string {
    if (typeof name === 'string') return name;
    return name?.pt || name?.en || Object.values(name)[0] || '';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

const SPECIAL_DATES = [
    { value: 'natal', label: 'Natal' },
    { value: 'pascoa', label: 'Páscoa' },
    { value: 'namorados', label: 'Dia dos Namorados' },
    { value: 'mae', label: 'Dia da Mãe' },
    { value: 'pai', label: 'Dia do Pai' },
    { value: 'aniversario', label: 'Aniversário do Restaurante' },
    { value: 'outro', label: 'Outra Data Especial' },
];

export function PromotionalCalendarClient({ initialPromotions, products }: PromotionalCalendarClientProps) {
    const [promotions, setPromotions] = useState<PromotionalSchedule[]>(initialPromotions);
    const [editingPromo, setEditingPromo] = useState<PromotionalSchedule | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const normalPromotions = promotions.filter(p => !p.isSpecial);
    const specialPromotions = promotions.filter(p => p.isSpecial);

    const openCreateDialog = (isSpecial: boolean) => {
        const today = new Date().toISOString().split('T')[0];
        setEditingPromo({
            productId: '',
            startDate: today,
            endDate: null,
            isSpecial,
            label: isSpecial ? '' : null,
            discount: null,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (promo: PromotionalSchedule) => {
        setEditingPromo({
            ...promo,
            startDate: promo.startDate.split('T')[0],
            endDate: promo.endDate ? promo.endDate.split('T')[0] : null,
        });
        setIsDialogOpen(true);
    };

    const updatePromoField = (field: keyof PromotionalSchedule, value: unknown) => {
        if (!editingPromo) return;
        setEditingPromo({ ...editingPromo, [field]: value });
    };

    const savePromotion = async () => {
        if (!editingPromo || !editingPromo.productId) {
            toast.error("Selecione um produto");
            return;
        }
        setSaving(true);

        try {
            const payload = {
                productId: editingPromo.productId,
                startDate: new Date(editingPromo.startDate).toISOString(),
                endDate: editingPromo.endDate ? new Date(editingPromo.endDate).toISOString() : null,
                isSpecial: editingPromo.isSpecial,
                label: editingPromo.label,
                discount: editingPromo.discount,
            };

            if (editingPromo.id) {
                const updated = await apiClient<PromotionalSchedule>(`/marketing/promotions/${editingPromo.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
                setPromotions(promotions.map(p => p.id === updated.id ? updated : p));
            } else {
                const created = await apiClient<PromotionalSchedule>('/marketing/promotions', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                setPromotions([...promotions, created]);
            }

            setIsDialogOpen(false);
            setEditingPromo(null);
            toast.success(editingPromo.id ? "Promoção atualizada!" : "Promoção criada!");
        } catch (error) {
            console.error('Error saving promotion:', error);
            toast.error("Erro ao guardar promoção");
        } finally {
            setSaving(false);
        }
    };

    const deletePromotion = async (id: string) => {
        try {
            await apiClient(`/marketing/promotions/${id}`, { method: 'DELETE' });
            setPromotions(promotions.filter(p => p.id !== id));
            toast.success("Promoção removida");
        } catch (error) {
            toast.error("Erro ao remover promoção");
        }
    };

    const renderPromoCard = (promo: PromotionalSchedule) => (
        <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {promo.product?.imageUrl && (
                                <img src={promo.product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <div>
                                <p className="font-medium">
                                    {promo.product ? getLocalizedName(promo.product.name) : 'Produto'}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(promo.startDate)}
                                    {promo.endDate && ` - ${formatDate(promo.endDate)}`}
                                </div>
                                {promo.label && (
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                        <Star className="h-3 w-3 mr-1" />
                                        {promo.label}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {promo.discount && (
                                <Badge className="bg-green-100 text-green-700">
                                    <Percent className="h-3 w-3 mr-1" />
                                    {promo.discount}%
                                </Badge>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(promo)}>
                                <Calendar className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deletePromotion(promo.id!)} className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            {/* Promoções Normais */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium">Dias Normais</h4>
                        <p className="text-xs text-zinc-500">Produtos em destaque no dia-a-dia</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openCreateDialog(false)}>
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                </div>
                <AnimatePresence>
                    {normalPromotions.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-6 text-center text-sm text-zinc-500">
                                Nenhuma promoção para dias normais
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3">{normalPromotions.map(renderPromoCard)}</div>
                    )}
                </AnimatePresence>
            </div>

            {/* Datas Especiais */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            Datas Especiais
                        </h4>
                        <p className="text-xs text-zinc-500">Natal, Dia dos Namorados, eventos, etc.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                </div>
                <AnimatePresence>
                    {specialPromotions.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-6 text-center text-sm text-zinc-500">
                                Nenhuma promoção para datas especiais
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3">{specialPromotions.map(renderPromoCard)}</div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingPromo?.id ? 'Editar Promoção' : (editingPromo?.isSpecial ? 'Nova Promoção Especial' : 'Nova Promoção')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Produto</Label>
                            <Select value={editingPromo?.productId || ''} onValueChange={(v) => updatePromoField('productId', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {getLocalizedName(product.name)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Data Início</Label>
                                <Input
                                    type="date"
                                    value={editingPromo?.startDate || ''}
                                    onChange={(e) => updatePromoField('startDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Data Fim (opcional)</Label>
                                <Input
                                    type="date"
                                    value={editingPromo?.endDate || ''}
                                    onChange={(e) => updatePromoField('endDate', e.target.value || null)}
                                />
                            </div>
                        </div>

                        {editingPromo?.isSpecial && (
                            <div className="space-y-2">
                                <Label>Etiqueta da Data Especial</Label>
                                <Select value={editingPromo?.label || ''} onValueChange={(v) => updatePromoField('label', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SPECIAL_DATES.map(date => (
                                            <SelectItem key={date.value} value={date.label}>
                                                {date.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Desconto % (opcional)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={editingPromo?.discount || ''}
                                onChange={(e) => updatePromoField('discount', e.target.value ? parseFloat(e.target.value) : null)}
                                placeholder="Ex: 10"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={savePromotion} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                            {saving ? 'A guardar...' : <><Save className="h-4 w-4 mr-2" /> Guardar</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
