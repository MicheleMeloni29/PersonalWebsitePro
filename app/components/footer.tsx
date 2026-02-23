"use client";

import { useLanguage } from "./data/LanguageProvider";

export default function Footer() {
    const { dict } = useLanguage();
    return (
        <footer className="bg-[#0d0d0d]  h-10 flex items-center justify-center text-red-700 text-xs">
            {dict.Footer.copyright}
        </footer>
    );
}
