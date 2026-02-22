export type LocalizedString = string | Record<string, string>;

export function getLocalizedName(name: LocalizedString, locale: string = 'pt'): string {
    if (!name) return '';
    if (typeof name === 'string') return name;
    
    // Check for the requested locale, then fallbacks
    return name[locale] || name['pt'] || name['en'] || Object.values(name)[0] || '';
}
