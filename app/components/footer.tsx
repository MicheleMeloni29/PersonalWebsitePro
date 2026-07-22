"use client";

import { useLanguage } from "./data/LanguageProvider";

export default function Footer() {
    const { dict } = useLanguage();
    return (
        <footer className="flex h-10 items-center justify-center text-xs text-red-700">
            {dict.Footer.copyright}
        </footer>
    );
}
