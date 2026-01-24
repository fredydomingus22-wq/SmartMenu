'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

interface I18nContextType {
    t: (path: string, params?: Record<string, string | number>) => string;
    locale: string;
    setLocale: (locale: string) => void;
}

const translations: Record<string, Record<string, unknown>> = { pt, en, es };
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, locale: initialLocale = 'pt' }: { children: ReactNode; locale?: string }) {
    const [locale, setLocaleState] = useState(initialLocale);

    useEffect(() => {
        const savedLocale = document.cookie
            .split('; ')
            .find(row => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1];

        if (savedLocale && translations[savedLocale]) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: string) => {
        if (translations[newLocale]) {
            setLocaleState(newLocale);
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
            // Revalidate or reload might be needed for server components if they use the cookie
            // For now, client-side state is enough for the immediate UX
        }
    };

    const t = (path: string, params?: Record<string, string | number>) => {
        const keys = path.split('.');
        let current: unknown = translations[locale] || translations['pt'];

        for (const key of keys) {
            if (!current || (current as Record<string, unknown>)[key] === undefined) return path;
            current = (current as Record<string, unknown>)[key];
        }

        let result = current as string;
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                result = result.replace(`{${key}}`, String(value));
            });
        }
        return result;
    };

    return (
        <I18nContext.Provider value={{ t, locale, setLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
}
