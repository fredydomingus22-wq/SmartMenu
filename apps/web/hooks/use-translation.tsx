'use client';

import { I18nProvider as SharedI18nProvider, useTranslation as useSharedTranslation } from "@smart-menu/ui";
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const translations = { pt, en, es };

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale?: string }) {
    return (
        <SharedI18nProvider translations={translations} locale={locale} persistLocale={true}>
            {children}
        </SharedI18nProvider>
    );
}

export const useTranslation = useSharedTranslation;
