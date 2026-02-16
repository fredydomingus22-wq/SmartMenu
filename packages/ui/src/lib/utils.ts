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

export function getDirectGoogleDriveUrl(url: string): string {
    if (!url || !url.includes('drive.google.com')) return url;
    
    // Convert sharing link to direct download link
    // Pattern: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Replacement: https://lh3.googleusercontent.com/u/0/d/FILE_ID
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
    }
    
    return url;
}

export function getOptimizedImageUrl(url: string | null | undefined): string {
    if (!url) return "/placeholder-food.jpg";
    return getDirectGoogleDriveUrl(url);
}
