"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import it from "../../messages/it.json";

const dictionaries = { en, it, es } as const;
type Lang = keyof typeof dictionaries;
type Dictionary = typeof en;

const LKEY = "site.lang";

type Ctx = {
    lang: Lang;
    setLang: (l: Lang) => void;
    cycleLang: () => void;
    t: (ns: keyof Dictionary, key: string, vars?: Record<string, string | number>) => string;
    dict: Dictionary;
};

const LanguageCtx = createContext<Ctx | null>(null);

function nextLang(l: Lang): Lang {
    return l === "en" ? "it" : l === "it" ? "es" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>("en");

    useEffect(() => {
        const saved = localStorage.getItem(LKEY) as Lang | null;
        if (saved && (saved === "en" || saved === "it" || saved === "es")) setLang(saved);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
        localStorage.setItem(LKEY, lang);
    }, [lang]);

    const cycleLang = () => setLang((prev) => nextLang(prev));

    const dict = useMemo(() => dictionaries[lang] as Dictionary, [lang]);

    const t = useCallback<Ctx["t"]>(
        (ns, key, vars) => {
            const root = (dict as any)?.[ns];
            if (!root) return key;
            const value = key.split(".").reduce((acc, part) => {
                if (!acc || typeof acc !== "object") return undefined;
                return (acc as any)[part];
            }, root as any);
            if (typeof value !== "string") return key;
            if (!vars) return value;
            return value.replace(/\{\{(\w+)\}\}/g, (_match, varKey) =>
                String(vars[varKey] ?? "")
            );
        },
        [dict]
    );

    const value = useMemo(() => ({ lang, setLang, cycleLang, t, dict }), [lang, t, dict]);

    return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}

export function useLanguage() {
    const ctx = useContext(LanguageCtx);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
