"use client";

import { useLanguage } from "./UI/LanguageProvider";

const FLAG: Record<"en" | "it" | "es", string> = {
    en: "🇬🇧",
    it: "🇮🇹",
    es: "🇪🇸",
};

export default function LanguageDot() {
    const { lang, cycle } = useLanguage();

    return (
        <button
            onClick={cycle}
            aria-label={`Change language (current: ${lang})`}
            title={`Language: ${lang.toUpperCase()} • click to change`}
            className="
        fixed z-50 rounded-full w-10 h-10 flex items-center justify-center
        top-4 right-4 lg:top-6 lg:right-6
        border border-red-800/60 bg-black/40 dark:bg-[#0b0b0b]/50
        backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.35)]
        text-xl leading-none select-none
        hover:scale-105 transition-transform
      "
            style={{
                // rispetta le safe area su iOS
                right: "max(1rem, env(safe-area-inset-right))",
                top: "max(1rem, env(safe-area-inset-top))",
            }}
        >
            <span aria-hidden>{FLAG[lang]}</span>
        </button>
    );
}
