/////////////////////////////////////////////////////////
//NON IN USO (per ora) - gestione lingua (i18n) semplice
/////////////////////////////////////////////////////////

"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "it" | "es";

// Dizionario di traduzioni
type I18nDict = Record<Lang, Record<string, string>>;

// Mini-dizionario d’esempio: aggiungi qui le tue chiavi
const DICT: I18nDict = {
    en: {
        role: "Frontend Developer",
        languages: "Languages",
        tech: "Tech",
    },
    it: {
        role: "Sviluppatore Frontend",
        languages: "Linguaggi",
        tech: "Tecnologie",
    },
    es: {
        role: "Desarrollador Frontend",
        languages: "Lenguajes",
        tech: "Tecnologías",
    },
};

function detectInitial(): Lang {
    // server → "en" (stabile); client → prova localStorage/navigator
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("lang") as Lang | null;
    if (saved) return saved;
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith("it")) return "it";
    if (nav.startsWith("es")) return "es";
    return "en";
}

type Ctx = {
    lang: Lang;
    setLang: (l: Lang) => void;
    cycle: () => void;
    t: (key: string) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => detectInitial());

    useEffect(() => {
        // persisti e aggiorna <html lang="..">
        if (typeof window !== "undefined") {
            window.localStorage.setItem("lang", lang);
            document.documentElement.setAttribute("lang", lang);
        }
    }, [lang]);

    const cycle = () =>
        setLang((l) => (l === "en" ? "it" : l === "it" ? "es" : "en"));

    const t = (key: string) => DICT[lang]?.[key] ?? key;

    const value = useMemo(() => ({ lang, setLang, cycle, t }), [lang]);

    return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLanguage() {
    const ctx = useContext(LangCtx);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
