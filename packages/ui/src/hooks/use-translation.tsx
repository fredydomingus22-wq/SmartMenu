'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface I18nContextType {
    t: (path: string, params?: Record<string, string | number>) => string;
    locale: string;
    setLocale: (locale: string) => void;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
    translations: Record<string, any>;
    locale?: string;
    persistLocale?: boolean;
}

export function I18nProvider({
    children,
    translations,
    locale: initialLocale = 'pt',
    persistLocale = false
}: I18nProviderProps) {
    const [locale, setLocaleState] = useState(initialLocale);

    useEffect(() => {
        if (!persistLocale) return;

        const savedLocale = document.cookie
            .split('; ')
            .find(row => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1];

        if (savedLocale && translations[savedLocale]) {
            setLocaleState(savedLocale);
        }
    }, [persistLocale, translations]);

    const setLocale = (newLocale: string) => {
        if (translations[newLocale]) {
            setLocaleState(newLocale);
            if (persistLocale) {
                document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
            }
        }
    };

    const t = (path: string, params?: Record<string, string | number>) => {
        const keys = path.split('.');
        let current: any = translations[locale] || translations['pt'];

        for (const key of keys) {
            if (!current || (current as any)[key] === undefined) return path;
            current = (current as any)[key];
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
        throw new Error('useTranslation must be used within an I18nProvider (shared)');
    }
    return context;
}
