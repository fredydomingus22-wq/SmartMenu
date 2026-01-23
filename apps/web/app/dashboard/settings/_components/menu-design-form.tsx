"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateMenuConfig } from "@/app/actions/settings";
import { Layout, GripVertical, Sparkles, Image as ImageIcon, Megaphone } from "lucide-react";
import { Reorder } from "framer-motion";
import { MenuSection } from "../../../menu/[id]/_types";
import { ImageUpload } from "@/components/ui/image-upload";

interface MenuDesignFormProps {
    initialSections: MenuSection[] | null;
}

export function MenuDesignForm({ initialSections }: MenuDesignFormProps) {
    const [sections, setSections] = useState<MenuSection[]>(initialSections || [
        { type: "hero", name: "Banner Principal", isActive: true, config: { title: "Bem-vindo", subtitle: "As melhores opções", imageUrl: "" } },
        { type: "featured", name: "Destaques", isActive: true, config: { label: "MAIS PEDIDOS", title: "Os Favoritos" } },
        { type: "category_grid", name: "Categorias", isActive: true, config: {} },
        { type: "global_upsell", name: "Banner Promocional (Fim)", isActive: true, config: { title: "Espaço para Sobremesa?", subtitle: "Confira nossas opções artesanais", buttonText: "Ver Ofertas", imageUrl: "" } }
    ]);

    // Ensure global_upsell exists if it's missing from initialSections (migration)
    if (initialSections && !sections.find(s => s.type === 'global_upsell')) {
        setSections(prev => [...prev, {
            type: "global_upsell",
            name: "Banner Promocional (Fim)",
            isActive: false,
            config: { title: "Espaço para Sobremesa?", subtitle: "Confira nossas opções artesanais", buttonText: "Ver Ofertas", imageUrl: "" }
        }]);
    }

    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await updateMenuConfig(sections);
            if (result.success) {
                toast.success("Layout do cardápio atualizado!");
            } else {
                toast.error(result.error || "Erro ao atualizar layout.");
            }
        } catch (error) {
            console.error("Menu design save error:", error);
            toast.error("Erro inesperado ao salvar.");
        } finally {
            setIsSaving(false);
        }
    }

    const toggleSection = (index: number) => {
        const newSections = [...sections];
        newSections[index].isActive = !newSections[index].isActive;
        setSections(newSections);
    };

    const updateConfig = (index: number, key: string, value: string) => {
        const newSections = [...sections];
        newSections[index].config = { ...newSections[index].config, [key]: value };
        setSections(newSections);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-4">
                    {sections.map((section, index) => (
                        <Reorder.Item key={section.type} value={section}>
                            <Card className={`border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50 ${!section.isActive ? 'opacity-60' : ''}`}>
                                <CardHeader className="py-4 px-6 flex flex-row items-center justify-between space-y-0">
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="h-5 w-5 text-zinc-400 cursor-grab active:cursor-grabbing" />
                                        <div>
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                {section.type === 'hero' && <ImageIcon className="h-4 w-4 text-primary" />}
                                                {section.type === 'featured' && <Sparkles className="h-4 w-4 text-amber-500" />}
                                                {section.type === 'category_grid' && <Layout className="h-4 w-4 text-blue-500" />}
                                                {section.type === 'global_upsell' && <Megaphone className="h-4 w-4 text-rose-500" />}
                                                {section.name || section.type}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={section.isActive}
                                            onCheckedChange={() => toggleSection(index)}
                                        />
                                    </div>
                                </CardHeader>
                                {section.isActive && (
                                    <CardContent className="px-6 pb-6 pt-0 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                                        <div className="pt-4 grid gap-4">
                                            {section.type === 'hero' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label>Título do Banner</Label>
                                                        <Input
                                                            value={section.config?.title || ""}
                                                            onChange={(e) => updateConfig(index, 'title', e.target.value)}
                                                            placeholder="Ex: Sabores que Encantam"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Subtítulo</Label>
                                                        <Input
                                                            value={section.config?.subtitle || ""}
                                                            onChange={(e) => updateConfig(index, 'subtitle', e.target.value)}
                                                            placeholder="Ex: Peça agora e receba em casa"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Imagem de Fundo</Label>
                                                        <ImageUpload
                                                            value={section.config?.imageUrl || ""}
                                                            onChange={(url) => updateConfig(index, 'imageUrl', url)}
                                                            onRemove={() => updateConfig(index, 'imageUrl', "")}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {section.type === 'global_upsell' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label>Título do Banner</Label>
                                                        <Input
                                                            value={section.config?.title || ""}
                                                            onChange={(e) => updateConfig(index, 'title', e.target.value)}
                                                            placeholder="Ex: Espaço para Sobremesa?"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Subtítulo</Label>
                                                        <Input
                                                            value={section.config?.subtitle || ""}
                                                            onChange={(e) => updateConfig(index, 'subtitle', e.target.value)}
                                                            placeholder="Ex: Confira nossas opções artesanais"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Imagem Promocional</Label>
                                                        <ImageUpload
                                                            value={section.config?.imageUrl || ""}
                                                            onChange={(url) => updateConfig(index, 'imageUrl', url)}
                                                            onRemove={() => updateConfig(index, 'imageUrl', "")}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Texto do Botão</Label>
                                                        <Input
                                                            value={section.config?.buttonText || ""}
                                                            onChange={(e) => updateConfig(index, 'buttonText', e.target.value)}
                                                            placeholder="Ex: Ver Ofertas"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {section.type === 'featured' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label>Tag Superior (Label)</Label>
                                                        <Input
                                                            value={section.config?.label || ""}
                                                            onChange={(e) => updateConfig(index, 'label', e.target.value)}
                                                            placeholder="Ex: OS MAIS AMADOS"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Título da Seção</Label>
                                                        <Input
                                                            value={section.config?.title || ""}
                                                            onChange={(e) => updateConfig(index, 'title', e.target.value)}
                                                            placeholder="Ex: Destaques da Casa"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {section.type === 'category_grid' && (
                                                <p className="text-xs text-zinc-500 italic">Esta seção exibe suas categorias e produtos automaticamente.</p>
                                            )}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]"
                    >
                        {isSaving ? "A guardar..." : "Salvar Layout"}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sticky top-8">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500">Dicas de Layout</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <p>Arraste as seções para mudar a ordem de exibição no menu.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <p>Use o switch para ocultar temporariamente uma seção (ex: Promoções sazonais).</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <p>O banner Hero deve ter uma imagem de alta qualidade (preferencialmente 1920x600).</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
