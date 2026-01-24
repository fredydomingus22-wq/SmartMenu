'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

interface I18nContextType {
    t: (path: string, params?: Record<string, string | number>) => string;
    locale: string;
    setLocale: (locale: string) => void;
}

const translations: Record<string, any> = { pt, en, es };
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, locale: initialLocale = 'pt' }: { children: ReactNode; locale?: string }) {
    const [locale, setLocale] = useState(initialLocale);

    const t = (path: string, params?: Record<string, string | number>) => {
        const keys = path.split('.');
        let current: any = translations[locale] || translations['pt'];

        for (const key of keys) {
            if (!current || current[key] === undefined) return path;
            current = current[key];
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
