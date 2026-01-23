'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOnboardingData } from '../actions';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Building2, Store } from "lucide-react";
import { useRouter } from 'next/navigation';

export function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        nif: '',
        restaurantName: '',
        restaurantPhone: '',
        restaurantAddress: '',
    });
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 1 && formData.companyName) {
            setStep(2);
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
            alert("Ocorreu um erro ao criar a sua conta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex items-center justify-center space-x-4 mb-8">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 1 ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/10' : 'border-zinc-200 text-zinc-400'}`}>
                    <Building2 className="w-5 h-5" />
                </div>
                <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-orange-600' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 2 ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/10' : 'border-zinc-200 text-zinc-400'}`}>
                    <Store className="w-5 h-5" />
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="pb-4">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Nome da Empresa (Organização)</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Ex: Grupo Gastronômico Silva, LDA"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    required
                                    autoFocus
                                />
                                <p className="text-xs text-zinc-500">O nome legal da sua empresa.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nif">NIF (Opcional)</Label>
                                <Input
                                    id="nif"
                                    name="nif"
                                    placeholder="Número de Identificação Fiscal"
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
                                Continuar
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="restaurantName">Nome do Restaurante</Label>
                                <Input
                                    id="restaurantName"
                                    name="restaurantName"
                                    placeholder="Ex: O Melhor Hambúrguer"
                                    value={formData.restaurantName}
                                    onChange={handleInputChange}
                                    required
                                    autoFocus
                                />
                                <p className="text-xs text-zinc-500">Como os seus clientes conhecem o local.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="restaurantAddress">Morada</Label>
                                <Input
                                    id="restaurantAddress"
                                    name="restaurantAddress"
                                    placeholder="Rua, Cidade, Bairro"
                                    value={formData.restaurantAddress}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="restaurantPhone">Telefone</Label>
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
                                    disabled={isLoading}
                                >
                                    Voltar
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                                    disabled={isLoading || !formData.restaurantName}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            A Configurar...
                                        </>
                                    ) : (
                                        'Concluir'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </form>
    );
}
