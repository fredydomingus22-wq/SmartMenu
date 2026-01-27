'use client';

import { useState } from 'react';

import {
    Button,
    Input,
    Label,
    ScrollArea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    ANGOLA_LOCATIONS,
    useGeolocation
} from "@smart-menu/ui";
import { createOnboardingData } from '../actions';
import { Loader2, Building2, Store, LayoutGrid, MapPin, CheckCircle2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        nif: '',
        restaurantName: '',
        restaurantPhone: '',
        restaurantAddress: '',
        province: '',
        municipality: '',
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
        tableCount: '5', // Default 5 tables
    });
    const { loading: geoLoading, error: geoError, coords, getPosition } = useGeolocation();
    const router = useRouter();
    const { t } = useTranslation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 1 && formData.companyName) {
            setStep(2);
        } else if (step === 2 && formData.restaurantName) {
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createOnboardingData(formData);
            if (result?.error) {
                alert(result.error);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            alert(t('onboarding.error_create'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex items-center justify-center space-x-4 mb-8">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= 1 ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'border-zinc-200 text-zinc-400'}`}>
                    <Building2 className="w-5 h-5" />
                </div>
                <div className={`h-1 flex-1 rounded transition-all duration-500 ${step >= 2 ? 'bg-orange-600' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= 2 ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'border-zinc-200 text-zinc-400'}`}>
                    <Store className="w-5 h-5" />
                </div>
                <div className={`h-1 flex-1 rounded transition-all duration-500 ${step >= 3 ? 'bg-orange-600' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= 3 ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'border-zinc-200 text-zinc-400'}`}>
                    <LayoutGrid className="w-5 h-5" />
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="pb-4">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Qual o nome da sua empresa/grupo?</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Ex: Grupo Gourmet Angola"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    required
                                    autoFocus
                                    className="h-12 text-lg rounded-xl"
                                />
                                <p className="text-xs text-zinc-500">Este nome será usado para fins de faturação e gestão de múltiplos restaurantes.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nif">{t('onboarding.nif_label')}</Label>
                                <Input
                                    id="nif"
                                    name="nif"
                                    placeholder={t('onboarding.nif_placeholder')}
                                    value={formData.nif}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
                                disabled={!formData.companyName}
                            >
                                {t('onboarding.next')}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <Label htmlFor="restaurantName">E como se chama o seu restaurante?</Label>
                                <Input
                                    id="restaurantName"
                                    name="restaurantName"
                                    placeholder="Ex: Luanda Grill"
                                    value={formData.restaurantName}
                                    onChange={handleInputChange}
                                    required
                                    autoFocus
                                    className="h-12 text-lg rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Província</Label>
                                    <Select
                                        value={formData.province}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, province: val, municipality: '' }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ANGOLA_LOCATIONS.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Município</Label>
                                    <Select
                                        value={formData.municipality}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, municipality: val }))}
                                        disabled={!formData.province}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ANGOLA_LOCATIONS.find(p => p.id === formData.province)?.municipalities.map(m => (
                                                <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="restaurantAddress">{t('onboarding.address_label')}</Label>
                                <Input
                                    id="restaurantAddress"
                                    name="restaurantAddress"
                                    placeholder={t('onboarding.address_placeholder')}
                                    value={formData.restaurantAddress}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm font-bold">Localização GPS</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-full text-[10px] font-bold uppercase tracking-tight"
                                        onClick={() => {
                                            getPosition();
                                            if (coords) {
                                                setFormData(prev => ({ ...prev, latitude: coords.latitude, longitude: coords.longitude }));
                                            }
                                        }}
                                        disabled={geoLoading}
                                    >
                                        {geoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Capturar Atual"}
                                    </Button>
                                </div>

                                {coords && !geoLoading && (
                                    <div className="flex items-center gap-2 text-xs text-green-600 font-medium animate-in fade-in zoom-in-95">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Coordenadas capturadas com sucesso!
                                    </div>
                                )}

                                {geoError && <p className="text-[10px] text-red-500 font-medium">{geoError}</p>}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-zinc-400">Lat</Label>
                                        <Input
                                            readOnly
                                            value={formData.latitude || coords?.latitude || ''}
                                            className="h-8 text-xs bg-zinc-100 dark:bg-zinc-800"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-zinc-400">Lng</Label>
                                        <Input
                                            readOnly
                                            value={formData.longitude || coords?.longitude || ''}
                                            className="h-8 text-xs bg-zinc-100 dark:bg-zinc-800"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-400 italic">Isso ajuda clientes próximos a encontrarem seu restaurante.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="restaurantPhone">{t('onboarding.phone_label')}</Label>
                                <Input
                                    id="restaurantPhone"
                                    name="restaurantPhone"
                                    type="tel"
                                    placeholder="+244 9..."
                                    value={formData.restaurantPhone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1"
                                >
                                    {t('onboarding.back')}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 font-bold"
                                    disabled={!formData.restaurantName}
                                >
                                    {t('onboarding.next')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-4 py-4 text-center">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-orange-600 mb-4">
                                    <LayoutGrid className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">{t('onboarding.tables_title')}</h3>
                                    <p className="text-sm text-zinc-500">{t('onboarding.tables_desc')}</p>
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setFormData(prev => ({ ...prev, tableCount: Math.max(1, parseInt(prev.tableCount) - 1).toString() }))}
                                        className="h-12 w-12 rounded-full text-xl"
                                    >
                                        -
                                    </Button>
                                    <Input
                                        id="tableCount"
                                        name="tableCount"
                                        type="number"
                                        className="w-24 text-center text-2xl font-bold h-12"
                                        value={formData.tableCount}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="100"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setFormData(prev => ({ ...prev, tableCount: Math.min(100, parseInt(prev.tableCount) + 1).toString() }))}
                                        className="h-12 w-12 rounded-full text-xl"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(2)}
                                    className="flex-1"
                                >
                                    {t('onboarding.back')}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 font-bold"
                                >
                                    {t('onboarding.review_label')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-center">{t('onboarding.review_title')}</h3>
                                    <div className="rounded-xl border bg-zinc-50 dark:bg-white/5 p-4 space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">{t('onboarding.company')}:</span>
                                            <span className="font-medium">{formData.companyName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">{t('onboarding.restaurant')}:</span>
                                            <span className="font-medium">{formData.restaurantName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">{t('onboarding.tables_count_label')}:</span>
                                            <span className="font-medium">{formData.tableCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(3)}
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        {t('onboarding.adjust')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-orange-600 hover:bg-orange-700 font-bold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t('onboarding.configuring')}
                                            </>
                                        ) : (
                                            t('onboarding.ready')
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </form>
    );
}
