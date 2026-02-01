"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from "@smart-menu/ui";
import { toast } from "sonner";
import { Image, Link as LinkIcon, Type, Plus, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/api-client";

interface Banner {
    id?: string;
    type: string;
    title: Record<string, string> | null;
    subtitle: Record<string, string> | null;
    buttonText: Record<string, string> | null;
    buttonLink: string | null;
    imageUrl: string | null;
    isActive: boolean;
    order: number;
}

interface BannersFormProps {
    initialBanners: Banner[];
}

export function BannersForm({ initialBanners }: BannersFormProps) {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [saving, setSaving] = useState(false);

    const heroBanners = banners.filter(b => b.type === 'hero');
    const footerBanners = banners.filter(b => b.type === 'footer');

    const addBanner = (type: 'hero' | 'footer') => {
        const newBanner: Banner = {
            type,
            title: { pt: '', en: '' },
            subtitle: { pt: '', en: '' },
            buttonText: { pt: '', en: '' },
            buttonLink: '',
            imageUrl: '',
            isActive: true,
            order: type === 'hero' ? heroBanners.length : footerBanners.length,
        };
        setBanners([...banners, newBanner]);
    };

    const updateBanner = (index: number, field: keyof Banner, value: unknown) => {
        const updated = [...banners];
        (updated[index] as unknown as Record<string, unknown>)[field] = value;
        setBanners(updated);
    };

    const updateBannerI18n = (index: number, field: 'title' | 'subtitle' | 'buttonText', lang: string, value: string) => {
        const updated = [...banners];
        const current = updated[index][field] || {};
        updated[index][field] = { ...current, [lang]: value };
        setBanners(updated);
    };

    const deleteBanner = async (index: number) => {
        const banner = banners[index];
        if (banner.id) {
            try {
                await apiClient(`/marketing/banners/${banner.id}`, { method: 'DELETE' });
            } catch (error) {
                toast.error("Erro ao excluir banner");
                return;
            }
        }
        setBanners(banners.filter((_, i) => i !== index));
        toast.success("Banner removido");
    };

    const saveBanners = async () => {
        setSaving(true);
        try {
            for (const banner of banners) {
                const payload = {
                    type: banner.type,
                    title: banner.title,
                    subtitle: banner.subtitle,
                    buttonText: banner.buttonText,
                    buttonLink: banner.buttonLink,
                    imageUrl: banner.imageUrl,
                    isActive: banner.isActive,
                    order: banner.order,
                };

                if (banner.id) {
                    await apiClient(`/marketing/banners/${banner.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload),
                    });
                } else {
                    const created = await apiClient<Banner>('/marketing/banners', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    banner.id = created.id;
                }
            }
            toast.success("Banners guardados com sucesso!");
        } catch (error) {
            console.error('Error saving banners:', error);
            toast.error("Erro ao guardar banners");
        } finally {
            setSaving(false);
        }
    };

    const renderBannerCard = (banner: Banner, globalIndex: number) => (
        <motion.div
            key={banner.id || globalIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Image className="h-4 w-4 text-orange-500" />
                            Banner {banner.order + 1}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Label htmlFor={`active-${globalIndex}`} className="text-xs text-zinc-500">Ativo</Label>
                                <Switch
                                    id={`active-${globalIndex}`}
                                    checked={banner.isActive}
                                    onCheckedChange={(checked) => updateBanner(globalIndex, 'isActive', checked)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteBanner(globalIndex)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Título */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5">
                                <Type className="h-3.5 w-3.5" />
                                Título (PT)
                            </Label>
                            <Input
                                value={banner.title?.pt || ''}
                                onChange={(e) => updateBannerI18n(globalIndex, 'title', 'pt', e.target.value)}
                                placeholder="Ex: Descubra os nossos pratos"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Título (EN)</Label>
                            <Input
                                value={banner.title?.en || ''}
                                onChange={(e) => updateBannerI18n(globalIndex, 'title', 'en', e.target.value)}
                                placeholder="Ex: Discover our dishes"
                            />
                        </div>
                    </div>

                    {/* Subtítulo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Subtítulo (PT)</Label>
                            <Input
                                value={banner.subtitle?.pt || ''}
                                onChange={(e) => updateBannerI18n(globalIndex, 'subtitle', 'pt', e.target.value)}
                                placeholder="Ex: Sabores autênticos"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtítulo (EN)</Label>
                            <Input
                                value={banner.subtitle?.en || ''}
                                onChange={(e) => updateBannerI18n(globalIndex, 'subtitle', 'en', e.target.value)}
                                placeholder="Ex: Authentic flavors"
                            />
                        </div>
                    </div>

                    {/* Texto do Botão */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Texto do Botão (PT)</Label>
                            <Input
                                value={banner.buttonText?.pt || ''}
                                onChange={(e) => updateBannerI18n(globalIndex, 'buttonText', 'pt', e.target.value)}
                                placeholder="Ex: Ver Cardápio"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Texto do Botão (EN)</Label>
                            <Input
                                value={banner.buttonText?.en || ''}
                                onChange={(e) => updateBannerI18n(globalIndex, 'buttonText', 'en', e.target.value)}
                                placeholder="Ex: View Menu"
                            />
                        </div>
                    </div>

                    {/* Link do Botão */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                            <LinkIcon className="h-3.5 w-3.5" />
                            Link do Botão
                        </Label>
                        <Input
                            value={banner.buttonLink || ''}
                            onChange={(e) => updateBanner(globalIndex, 'buttonLink', e.target.value)}
                            placeholder="Ex: /promocoes ou https://..."
                        />
                        <p className="text-xs text-zinc-500">
                            Use links internos (/promocoes) ou externos (https://...)
                        </p>
                    </div>

                    {/* URL da Imagem */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                            <Image className="h-3.5 w-3.5" />
                            URL da Imagem
                        </Label>
                        <Input
                            value={banner.imageUrl || ''}
                            onChange={(e) => updateBanner(globalIndex, 'imageUrl', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="hero">Hero (Topo)</TabsTrigger>
                    <TabsTrigger value="footer">Pré-Rodapé</TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">Banners do Hero</h4>
                            <p className="text-xs text-zinc-500">Aparecem no topo do menu digital</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addBanner('hero')}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                        </Button>
                    </div>
                    <AnimatePresence>
                        {heroBanners.length === 0 ? (
                            <Card className="border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
                                <CardContent className="py-8 text-center">
                                    <p className="text-sm text-zinc-500">Nenhum banner hero configurado</p>
                                </CardContent>
                            </Card>
                        ) : (
                            heroBanners.map((banner) => {
                                const globalIndex = banners.findIndex(b => b === banner);
                                return renderBannerCard(banner, globalIndex);
                            })
                        )}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="footer" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">Banners Pré-Rodapé</h4>
                            <p className="text-xs text-zinc-500">Aparecem antes do rodapé do menu</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addBanner('footer')}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                        </Button>
                    </div>
                    <AnimatePresence>
                        {footerBanners.length === 0 ? (
                            <Card className="border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
                                <CardContent className="py-8 text-center">
                                    <p className="text-sm text-zinc-500">Nenhum banner pré-rodapé configurado</p>
                                </CardContent>
                            </Card>
                        ) : (
                            footerBanners.map((banner) => {
                                const globalIndex = banners.findIndex(b => b === banner);
                                return renderBannerCard(banner, globalIndex);
                            })
                        )}
                    </AnimatePresence>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 border-t">
                <Button
                    onClick={saveBanners}
                    disabled={saving}
                    className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]"
                >
                    {saving ? (
                        "A guardar..."
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Banners
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
