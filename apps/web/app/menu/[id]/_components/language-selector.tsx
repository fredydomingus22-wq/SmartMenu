'use client';

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

    if (filteredLanguages.length <= 1) return null;

    return (
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200 dark:border-zinc-700/50 shadow-inner">
            {filteredLanguages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={cn(
                        "relative px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 flex items-center gap-1.5",
                        locale === lang.code
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                    )}
                >
                    {locale === lang.code && (
                        <motion.div
                            layoutId="active-lang"
                            className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{lang.flag}</span>
                    <span className="relative z-10">{lang.label}</span>
                </button>
            ))}
        </div>
    );
}
