'use client';

import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

interface Language {
    code: string;
    label: string;
    flag: string;
}

interface LanguageSelectorProps {
    currentLocale: string;
    languages: Language[];
    onLanguageChange: (code: string) => void;
    className?: string;
}

/**
 * Pure UI component for Language Selection.
 * Accepts logic as props to avoid dependency on app-level i18n hooks.
 */
export function LanguageSelector({
    currentLocale,
    languages,
    onLanguageChange,
    className
}: LanguageSelectorProps) {
    if (languages.length <= 1) return null;

    return (
        <div className={cn(
            "flex items-center bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200 dark:border-zinc-700/50 shadow-inner",
            className
        )}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={cn(
                        "relative px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 flex items-center gap-1.5",
                        currentLocale === lang.code
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                    )}
                >
                    {currentLocale === lang.code && (
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
