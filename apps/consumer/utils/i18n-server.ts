import pt from '../locales/pt.json';

type TranslationKeys = typeof pt;

export function getTranslation() {
    // Simple server-side translation helper
    // In a real app, this would detect the locale from cookies/headers
    return {
        t: (key: string, params?: Record<string, any>) => {
            const keys = key.split('.');
            let value: any = pt;

            for (const k of keys) {
                value = value?.[k];
            }

            if (typeof value !== 'string') return key;

            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    value = value.replace(`{${k}}`, String(v));
                });
            }

            return value;
        }
    };
}
