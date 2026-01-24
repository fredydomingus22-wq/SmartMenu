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

export function getTranslatedValue(
  value: string | Record<string, any> | null | undefined,
  lang: string = 'pt'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  // If it's an object, try the requested lang, then fallback to 'pt', then first key
  return value[lang] || value['pt'] || Object.values(value)[0] || '';
}
