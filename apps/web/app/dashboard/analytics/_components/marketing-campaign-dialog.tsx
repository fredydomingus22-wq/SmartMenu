"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Textarea,
    Label
} from "@smart-menu/ui";
import { Megaphone, Send, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MarketingCampaignDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCustomerIds: string[];
}

export function MarketingCampaignDialog({ isOpen, onClose, selectedCustomerIds }: MarketingCampaignDialogProps) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            setError("Por favor, preencha o título e a mensagem.");
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const response = await fetch("/api/analytics/marketing/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerIds: selectedCustomerIds,
                    title,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error("Falha ao enviar campanha");
            }

            toast.success(`Campanha enviada para ${selectedCustomerIds.length} clientes!`);
            onClose();
        } catch (err) {
            console.error("Error sending campaign:", err);
            setError("Ocorreu um erro ao enviar a campanha. Tente novamente.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
                        <Megaphone className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Criar Campanha de Engajamento</DialogTitle>
                    <DialogDescription>
                        Enviando para {selectedCustomerIds.length} clientes selecionados. Use uma linguagem premium e direta.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Título da Notificação
                        </Label>
                        <Input
                            id="title"
                            placeholder="Ex: Oferta Exclusiva para Você"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-10 text-sm font-medium"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Mensagem
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Descreva a promoção ou convite especial..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px] text-sm resize-none"
                        />
                        <p className="text-[10px] text-zinc-400 font-medium">
                            Dica: Clientes fidelizados respondem melhor a convites personalizados.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={isSending}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={isSending}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Disparar Campanha
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
