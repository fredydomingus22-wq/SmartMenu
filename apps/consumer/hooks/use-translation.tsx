'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import pt from '../locales/pt.json';

type TranslationKeys = typeof pt;

interface I18nContextType {
    t: (path: string, params?: Record<string, string | number>) => string;
    locale: string;
}

const translations: Record<string, any> = { pt };
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, locale = 'pt' }: { children: ReactNode; locale?: string }) {
    const t = (path: string, params?: Record<string, string | number>) => {
        const keys = path.split('.');
        let current: any = translations[locale];

        for (const key of keys) {
            if (current[key] === undefined) return path;
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
        <I18nContext.Provider value={{ t, locale }}>
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
