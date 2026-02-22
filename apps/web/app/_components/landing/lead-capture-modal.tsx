"use client";

import { useState, useTransition, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureFreeTrialLead } from "../../../actions/marketing-lead";
import { 
  Button, Input, Label,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger 
} from "@smart-menu/ui";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export function LeadCaptureModal({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<>{children}</>}>
            <LeadCaptureModalInner>{children}</LeadCaptureModalInner>
        </Suspense>
    );
}

function LeadCaptureModalInner({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const tenantSource = searchParams.get("tenant_id") || "";
    
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isMounted) {
        return <>{children}</>;
    }

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await captureFreeTrialLead(formData);
            if (result.success) {
                setIsSuccess(true);
            } else {
                // If there are specific zod errors, we could show them. For now, simple toast/alert.
                alert(result.message);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-100 bg-white p-6 md:p-8 shadow-2xl duration-200 sm:rounded-3xl">
                {!isSuccess ? (
                    <>
                        <DialogHeader className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 w-fit border border-orange-100">
                                <Sparkles className="h-4 w-4 text-orange-600" />
                                <span className="text-[10px] font-bold tracking-wider uppercase text-orange-600">Acesso Prioritário</span>
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-zinc-900">Comece o seu Teste Gratuito</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">
                                Preencha os dados abaixo e a nossa equipa ativará a sua conta sem compromisso. Nenhuma informação de pagamento é necessária agora.
                            </DialogDescription>
                        </DialogHeader>

                        <form action={onSubmit} className="space-y-5 mt-4">
                            {/* Hidden UTM field */}
                            <input type="hidden" name="tenantSource" value={tenantSource} />

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="restaurantName" className="text-zinc-700">Nome do Restaurante</Label>
                                    <Input id="restaurantName" name="restaurantName" required placeholder="Ex: Luanda Grill" className="h-12 rounded-xl border-zinc-200 focus:ring-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-zinc-700">Seu Nome</Label>
                                    <Input id="name" name="name" required placeholder="João Silva" className="h-12 rounded-xl border-zinc-200 focus:ring-orange-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-zinc-700">E-mail Profissional</Label>
                                        <Input id="email" name="email" type="email" required placeholder="geral@..." className="h-12 rounded-xl border-zinc-200 focus:ring-orange-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-zinc-700">Telemóvel</Label>
                                        <Input id="phone" name="phone" required placeholder="900 000 000" className="h-12 rounded-xl border-zinc-200 focus:ring-orange-500" />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" disabled={isPending} size="lg" className="w-full h-14 rounded-xl font-bold text-base mt-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
                                {isPending ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
                                ) : (
                                    <>Criar Conta Gratuita <ArrowRight className="ml-2 h-5 w-5" /></>
                                )}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="py-8 flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 border border-emerald-100">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900">Pedido Recebido!</h3>
                        <p className="text-zinc-600">
                            A sua conta está a ser pré-configurada. A nossa equipa entrará em contacto pelo WhatsApp nos próximos minutos para o onboarding.
                        </p>
                        <Button variant="outline" onClick={() => setIsOpen(false)} className="mt-4 rounded-xl font-bold border-zinc-200 text-zinc-900">
                            Voltar à página inicial
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
