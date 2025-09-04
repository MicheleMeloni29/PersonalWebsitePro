"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import ProfileHeroCard from "../UI/profileCard";

type Lang = "en" | "it" | "es";

// Dizionari di esempio (aggiungi le altre sezioni qui o in file separati)
const dictionaries = {
    en: {
        Header: {
            home: "Home", about: "About", timeline: "Timeline", projects: "Projects", contact: "Contact", changeLanguage: "Change language"
        },
        Hero: {
            profile: {
                role: "Frontend Developer",
                location: "Sestu, Sardinia (IT)",
                bio: "I build modern web & mobile apps. Passionate about UI/UX and performance.",
            },
            labels: {
                languages: "Languages",
                tech: "Tech",
            },
            rotators: {
                languages: ["TypeScript", "React Native", "Java", "Python", "C", "HTML", "CSS"],
                tech: ["Expo", "Next.js", "Firebase", "Tailwind CSS", "GitHub", "Vercel"],
            },
        },

    },
    it: {
        Header: {
            home: "Home", about: "Chi sono", timeline: "Timeline", projects: "Progetti", contact: "Contatti", changeLanguage: "Cambia lingua"
        },
        Hero: {
            profile: {
                role: "Sviluppatore Frontend",
                location: "Sestu, Sardegna (IT)",
                bio: "Realizzo app web e mobile moderne. Appassionato di UI/UX e prestazioni.",
            },
            labels: {
                languages: "Linguaggi",
                tech: "Tecnologie",
            },
            rotators: {
                languages: ["TypeScript", "React Native", "Java", "Python", "C", "HTML", "CSS"],
                tech: ["Expo", "Next.js", "Firebase", "Tailwind CSS", "GitHub", "Vercel"],
            },
        },
    },
    es: {
        Header: {
            home: "Inicio", about: "Sobre mí", timeline: "Cronología", projects: "Proyectos", contact: "Contacto", changeLanguage: "Cambiar idioma"
        },
        Hero: {
            profile: {
                role: "Desarrollador Frontend",
                location: "Sestu, Cerdeña (IT)",
                bio: "Construyo aplicaciones web y móviles modernas. Apasionado por la UI/UX y el rendimiento.",
            },
            labels: {
                languages: "Lenguajes",
                tech: "Tecnologías",
            },
            rotators: {
                languages: ["TypeScript", "React Native", "Java", "Python", "C", "HTML", "CSS"],
                tech: ["Expo", "Next.js", "Firebase", "Tailwind CSS", "GitHub", "Vercel"],
            },
        },
    },
} as const;

const LKEY = "site.lang";

type Ctx = {
    lang: Lang;
    setLang: (l: Lang) => void;
    cycleLang: () => void;
    t: (ns: keyof typeof dictionaries["en"], key: string) => string;
};

const LanguageCtx = createContext<Ctx | null>(null);

function nextLang(l: Lang): Lang {
    return l === "en" ? "it" : l === "it" ? "es" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // default uguale al server → niente mismatch
    const [lang, setLang] = useState<Lang>("en");

    // Hydrate da localStorage (se presente)
    useEffect(() => {
        const saved = localStorage.getItem(LKEY) as Lang | null;
        if (saved && (saved === "en" || saved === "it" || saved === "es")) setLang(saved);
    }, []);

    // Mantieni <html lang="..."> e persisti la scelta
    useEffect(() => {
        document.documentElement.lang = lang;
        localStorage.setItem(LKEY, lang);
    }, [lang]);

    const cycleLang = () => setLang((prev) => nextLang(prev));

    const t: Ctx["t"] = (ns, key) => {
        const dict = (dictionaries as any)[lang]?.[ns] ?? {};
        return dict[key] ?? key;
    };

    const value = useMemo(() => ({ lang, setLang, cycleLang, t }), [lang]);

    return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}

export function useLanguage() {
    const ctx = useContext(LanguageCtx);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
