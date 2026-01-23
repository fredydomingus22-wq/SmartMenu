"use client";

import { UtensilsCrossed, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    type?: "menu" | "search";
    title?: string;
    description?: string;
    onAction?: () => void;
    actionLabel?: string;
}

export function EmptyState({
    type = "menu",
    title,
    description,
    onAction,
    actionLabel = "Explorar outras opções"
}: EmptyStateProps) {

    const icons = {
        menu: <UtensilsCrossed className="h-16 w-16 text-muted-foreground/30" />,
        search: <SearchX className="h-16 w-16 text-muted-foreground/30" />,
    };

    const defaults = {
        menu: {
            title: "O cardápio está tímido hoje",
            description: "Ainda não temos itens nesta categoria. Volte mais tarde para descobrir nossas novidades!",
        },
        search: {
            title: "Não encontramos nada",
            description: "Tente usar termos mais genéricos ou verifique se digitou corretamente.",
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                {icons[type]}
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">
                {title || defaults[type].title}
            </h2>
            <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed font-medium">
                {description || defaults[type].description}
            </p>

            {onAction && (
                <Button
                    onClick={onAction}
                    className="rounded-full font-bold px-8 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all border-2 border-primary"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
