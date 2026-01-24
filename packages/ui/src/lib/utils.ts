import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string) {
    return new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
    }).format(Number(amount));
}

export function getTranslatedValue(value: string | Record<string, string> | null | undefined, locale: string = 'pt'): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[locale] || value['pt'] || value['en'] || Object.values(value)[0] || '';
}
