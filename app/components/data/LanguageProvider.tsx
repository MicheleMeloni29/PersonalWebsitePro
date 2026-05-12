"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import it from "../../messages/it.json";

// Collection of dictionaries available on the page.
const dictionaries = { en, it, es } as const;
type Lang = keyof typeof dictionaries;
type Dictionary = typeof en;

// Key used to remember the language chosen by the user between sessions.
const LKEY = "site.lang";

// Ctx contract describing the contents of the context, with the appropriate types for each field.
type Ctx = {
    lang: Lang;
    setLang: (l: Lang) => void;
    cycleLang: () => void;
    t: (ns: keyof Dictionary, key: string, vars?: Record<string, string | number>) => string;
    dict: Dictionary;
};

const LanguageCtx = createContext<Ctx | null>(null);

// Defines the rotation order of the language in the selector.
function nextLang(l: Lang): Lang {
    return l === "en" ? "it" : l === "it" ? "es" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>("en");

    useEffect(() => {
        // At start, try to restore the saved language, if valid.
        const saved = localStorage.getItem(LKEY) as Lang | null;
        if (saved && (saved === "en" || saved === "it" || saved === "es")) setLang(saved);
    }, []);

    useEffect(() => {
        // Keeps the < html lang = "..." > tag and localStorage aligned
        document.documentElement.lang = lang;
        localStorage.setItem(LKEY, lang);
    }, [lang]);

    const cycleLang = () => setLang((prev) => nextLang(prev));

    // Stores the active dictionary to avoid unnecessary recalculations at each render..
    const dict = useMemo(() => dictionaries[lang] as Dictionary, [lang]);

    const t = useCallback<Ctx["t"]>(
        (ns, key, vars) => {
        // Starts from the requested namespace and resolves nested keys like "hero.title".
            const root = (dict as any)?.[ns];
            if (!root) return key;
            const value = key.split(".").reduce((acc, part) => {
                if (!acc || typeof acc !== "object") return undefined;
                return (acc as any)[part];
            }, root as any);
            if (typeof value !== "string") return key;
            if (!vars) return value;
            // Replaces any placeholders in the format { { name } }.
            return value.replace(/\{\{(\w+)\}\}/g, (_match, varKey) =>
                String(vars[varKey] ?? "")
            );
        },
        [dict]
    );

    // Exposes a stable context value to limit unnecessary rerenders.
    const value = useMemo(() => ({ lang, setLang, cycleLang, t, dict }), [lang, t, dict]);

    return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}

export function useLanguage() {
    const ctx = useContext(LanguageCtx);
    // Prevents use of the hook outside the provider, making the error explicit.
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
