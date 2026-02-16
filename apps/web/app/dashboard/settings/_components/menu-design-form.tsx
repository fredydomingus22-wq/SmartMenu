"use client";

import { useState } from "react";
import { Button } from "@smart-menu/ui";
import { Input } from "@smart-menu/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@smart-menu/ui";
import { Label } from "@smart-menu/ui";
import { Switch } from "@smart-menu/ui";
import { toast } from "sonner";
import { updateMenuConfig } from "@/app/actions/settings";
import { Layout, GripVertical, Sparkles, Image as ImageIcon, Megaphone, ShoppingBag, Calendar, Tag } from "lucide-react";
import { Reorder } from "framer-motion";
import { MenuSection } from "../../../menu/[id]/_types";
import { ImageUpload } from "@smart-menu/ui";
import { Banner, ProductGroup, MarketingEvent, PromotionalSchedule, LocalizedString } from "@smart-menu/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@smart-menu/ui";

interface MenuDesignFormProps {
    initialSections: MenuSection[] | null;
    banners?: Banner[];
    productGroups?: ProductGroup[];
    promotions?: PromotionalSchedule[];
    events?: MarketingEvent[];
}

export function MenuDesignForm({ 
    initialSections, 
    banners = [], 
    productGroups = [],
    promotions = [],
    events = []
}: MenuDesignFormProps) {
    const [sections, setSections] = useState<MenuSection[]>(initialSections || [
        { type: "hero", name: "Banner Principal", isActive: true, config: { title: "Bem-vindo", subtitle: "As melhores opções", imageUrl: "" } },
        { type: "featured", name: "Destaques", isActive: true, config: { label: "MAIS PEDIDOS", title: "Os Favoritos" } },
        { type: "marketing_group", name: "Grupo do Marketing", isActive: false, config: { title: "Promoção Especial", groupId: "" } },
        { type: "promotions", name: "Promoções Ativas", isActive: false, config: { title: "Ofertas do Dia" } },
        { type: "events", name: "Eventos Próximos", isActive: false, config: { title: "Nossa Agenda" } },
        { type: "category_grid", name: "Categorias", isActive: true, config: {} },
        { type: "global_upsell", name: "Banner Promocional (Fim)", isActive: true, config: { title: "Espaço para Sobremesa?", subtitle: "Confira nossas opções artesanais", buttonText: "Ver Ofertas", imageUrl: "" } }
    ]);

    // Migration helpers
    if (initialSections && !sections.find(s => s.type === 'global_upsell')) {
        setSections(prev => [...prev, {
            type: "global_upsell",
            name: "Banner Promocional (Fim)",
            isActive: false,
            config: { title: "Espaço para Sobremesa?", subtitle: "Confira nossas opções artesanais", buttonText: "Ver Ofertas", imageUrl: "" }
        }]);
    }

    if (initialSections && !sections.find(s => s.type === 'marketing_group')) {
        setSections(prev => {
            const newSections = [...prev];
            newSections.splice(2, 0, {
                type: "marketing_group",
                name: "Grupo do Marketing",
                isActive: false,
                config: { title: "Promoção Especial", groupId: "" }
            });
            return newSections;
        });
    }

    if (initialSections && !sections.find(s => s.type === 'promotions')) {
        setSections(prev => {
            const newSections = [...prev];
            newSections.splice(3, 0, {
                type: "promotions",
                name: "Promoções Ativas",
                isActive: false,
                config: { title: "Ofertas do Dia" }
            });
            return newSections;
        });
    }

    if (initialSections && !sections.find(s => s.type === 'events')) {
        setSections(prev => {
            const newSections = [...prev];
            newSections.splice(4, 0, {
                type: "events",
                name: "Eventos Próximos",
                isActive: false,
                config: { title: "Nossa Agenda" }
            });
            return newSections;
        });
    }

    // Handle potentially localized content
    const getLocalized = (field: string | LocalizedString | null | undefined): string => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        if (typeof field === 'object') return field.pt || field.en || Object.values(field)[0] || "";
        return "";
    };

    // Helper to load banner data
    const loadBannerData = (index: number, bannerId: string) => {
        const banner = banners.find(b => b.id === bannerId);
        if (banner) {
            const newSections = [...sections];
            newSections[index].config = {
                ...newSections[index].config,
                title: getLocalized(banner.title),
                subtitle: getLocalized(banner.subtitle),
                imageUrl: banner.imageUrl || "",
                buttonText: getLocalized(banner.buttonText),
            };
            setSections(newSections);
            toast.success("Dados do banner carregados!");
        }
    };

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
                                                {section.type === 'marketing_group' && <ShoppingBag className="h-5 w-5 text-emerald-500" />}
                                                {section.type === 'promotions' && <Tag className="h-5 w-5 text-red-500" />}
                                                {section.type === 'events' && <Calendar className="h-5 w-5 text-blue-500" />}
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
                                                        <Label>Carregar do Marketing (Opcional)</Label>
                                                        <Select onValueChange={(val) => loadBannerData(index, val)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione um banner..." />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper" sideOffset={4}>
                                                                {banners.filter(b => b.type === 'hero').map((banner) => (
                                                                    <SelectItem key={banner.id} value={banner.id}>
                                                                        {/* Handle potentially localized title */}
                                                                        {(typeof banner.title === 'string' ? banner.title : banner.title?.pt || "Sem título")}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
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
                                                            onChange={(url: string) => updateConfig(index, 'imageUrl', url)}
                                                            onRemove={() => updateConfig(index, 'imageUrl', "")}
                                                            supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
                                                            supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {section.type === 'global_upsell' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label>Carregar do Marketing (Opcional)</Label>
                                                        <Select onValueChange={(val) => loadBannerData(index, val)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione um banner..." />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper" sideOffset={4}>
                                                                {banners.filter(b => b.type === 'footer').map((banner) => (
                                                                    <SelectItem key={banner.id} value={banner.id}>
                                                                        {(typeof banner.title === 'string' ? banner.title : banner.title?.pt || "Sem título")}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
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
                                                            onChange={(url: string) => updateConfig(index, 'imageUrl', url)}
                                                            onRemove={() => updateConfig(index, 'imageUrl', "")}
                                                            supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
                                                            supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
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
                                            {section.type === 'marketing_group' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label>Selecionar Grupo de Produtos</Label>
                                                        <Select 
                                                            value={section.config?.groupId || ""} 
                                                            onValueChange={(val) => updateConfig(index, 'groupId', val)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione um grupo..." />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper" sideOffset={4}>
                                                                {productGroups.map((group) => (
                                                                    <SelectItem key={group.id} value={group.id}>
                                                                        {getLocalized(group.name)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Título da Seção (Opcional)</Label>
                                                        <Input
                                                            value={section.config?.title || ""}
                                                            onChange={(e) => updateConfig(index, 'title', e.target.value)}
                                                            placeholder="Ex: Ofertas Imperdíveis"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Subtítulo (Opcional)</Label>
                                                        <Input
                                                            value={section.config?.subtitle || ""}
                                                            onChange={(e) => updateConfig(index, 'subtitle', e.target.value)}
                                                            placeholder="Ex: Válido até durar o stock"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {section.type === 'promotions' && (
                                                <div className="grid gap-2">
                                                    <Label>Título da Seção</Label>
                                                    <Input
                                                        value={section.config?.title || ""}
                                                        onChange={(e) => updateConfig(index, 'title', e.target.value)}
                                                        placeholder="Ex: Nossas Promoções"
                                                    />
                                                    <p className="text-xs text-zinc-500 italic">
                                                        Esta seção exibirá automaticamente todas as promoções ativas no momento ({promotions.length} encontradas).
                                                    </p>
                                                </div>
                                            )}

                                            {section.type === 'events' && (
                                                <div className="grid gap-2">
                                                    <Label>Título da Seção</Label>
                                                    <Input
                                                        value={section.config?.title || ""}
                                                        onChange={(e) => updateConfig(index, 'title', e.target.value)}
                                                        placeholder="Ex: Nossos Eventos"
                                                    />
                                                    <p className="text-xs text-zinc-500 italic">
                                                        Esta seção exibirá automaticamente os próximos eventos agendados ({events.length} encontrados).
                                                    </p>
                                                </div>
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
