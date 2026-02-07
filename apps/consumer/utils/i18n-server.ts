import pt from '../locales/pt.json';

export function getTranslation() {
    // Simple server-side translation helper
    // In a real app, this would detect the locale from cookies/headers
    return {
        t: (key: string, params?: Record<string, string | number>) => {
            const keys = key.split('.');
            let value: unknown = pt;

            for (const k of keys) {
                value = (value as Record<string, unknown>)?.[k];
            }

            if (typeof value !== 'string') return key;

            let result = value;
            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    result = result.replace(`{${k}}`, String(v));
                });
            }

            return result;
        }
    };
}
