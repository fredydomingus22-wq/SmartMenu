'use client';

import { useTranslation } from "@/hooks/use-translation";
import { LanguageSelector as SharedLanguageSelector } from "@smart-menu/ui";

const LANGUAGES = [
    { code: 'pt', label: 'PT', flag: '🇵🇹' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' }
];

export function LanguageSelector({ enabledLanguages }: { enabledLanguages?: string[] }) {
    const { locale, setLocale } = useTranslation();

    const filteredLanguages = LANGUAGES.filter(lang =>
        !enabledLanguages || enabledLanguages.length === 0 || enabledLanguages.includes(lang.code)
    );

    return (
        <SharedLanguageSelector
            currentLocale={locale}
            languages={filteredLanguages}
            onLanguageChange={setLocale}
        />
    );
}
