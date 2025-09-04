"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes"; // se non ti serve più per altri motivi, puoi rimuoverlo
import { useReducedMotion } from "framer-motion";
import {
  FaHome, FaUser, FaClock, FaProjectDiagram, FaEnvelope,
} from "react-icons/fa";
import LiquidChrome from "./UI/LiquidChrome";
import { useLanguage } from "./data/LanguageProvider";

export default function Header() {
  const { t, lang, cycleLang } = useLanguage();

  // puoi mantenere il tema solo per modulare i colori del LiquidChrome
  const { theme, resolvedTheme } = useTheme();
  const prefersReduced = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // aggiorna CSS vars con l'altezza reale dell'header
  useEffect(() => {
    if (!navRef.current) return;
    const root = document.documentElement;
    const mq = window.matchMedia("(min-width: 1024px)");
    const setVars = () => {
      const h = navRef.current?.offsetHeight ?? 0;
      if (mq.matches) {
        root.style.setProperty("--nav-top-h", `${h}px`);
        root.style.setProperty("--nav-bottom-h", `0px`);
      } else {
        root.style.setProperty("--nav-bottom-h", `${h}px`);
        root.style.setProperty("--nav-top-h", `0px`);
      }
    };
    const ro = new ResizeObserver(setVars);
    ro.observe(navRef.current);
    setVars();
    mq.addEventListener?.("change", setVars);
    window.addEventListener("resize", setVars);
    return () => {
      ro.disconnect();
      mq.removeEventListener?.("change", setVars);
      window.removeEventListener("resize", setVars);
    };
  }, []);

  // Link tradotti
  const links = [
    { href: "#hero", label: t("Header", "home"), icon: <FaHome /> },
    { href: "#about", label: t("Header", "about"), icon: <FaUser /> },
    { href: "#timeline", label: t("Header", "timeline"), icon: <FaClock /> },
    { href: "#projects", label: t("Header", "projects"), icon: <FaProjectDiagram /> },
    { href: "#contact", label: t("Header", "contact"), icon: <FaEnvelope /> },
  ];

  // Colori per LiquidChrome (0..1)
  const mode = (resolvedTheme ?? theme) as "light" | "dark" | undefined;
  const baseColor: [number, number, number] =
    mode === "dark" ? [0.08, 0.08, 0.12] : [0.88, 0.88, 0.93];

  // Bandiera corrente (emoji) e label accessibile
  const flag = lang === "en" ? "EN" : lang === "it" ? "IT" : "ES";

  return (
    <header className="fixed left-1/2 -translate-x-1/2 z-50 bottom-14 lg:bottom-auto lg:top-8">
      <nav
        ref={navRef}
        className="
          relative overflow-hidden isolate
          flex items-center gap-3 px-4 py-2
          rounded-full border-0
          shadow-[0_4px_6px_rgba(0,0,0,0.4)] backdrop-blur-md
        "
      >
        {/* Background LiquidChrome */}
        {mounted && (
          <LiquidChrome
            baseColor={baseColor}
            speed={prefersReduced ? 0 : 0.50}
            amplitude={0}
            frequencyX={3}
            frequencyY={3}
            interactive={false}
            aria-hidden
            className="pointer-events-none opacity-90"
          />
        )}

        {/* Contenuti nav sopra il background */}
        <div className="relative z-10 flex items-center gap-3">
          {links.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-1 rounded-md
                         transition-all duration-300 hover:scale-105
                         hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]
                         text-red-900 dark:text-red-500"
              aria-label={label}
            >
              {React.cloneElement(icon, { className: "text-lg", "aria-hidden": true })}
              <span className="hidden lg:inline text-sm font-medium">{label}</span>
            </a>
          ))}

          {/* Language Button: 🇬🇧 → 🇮🇹 → 🇪🇸 → 🇬🇧 */}
          <button
            onClick={cycleLang}
            aria-label={t("Header", "changeLanguage")}
            title={t("Header", "changeLanguage")}
            className="grid place-items-center w-9 h-9 rounded-full
                      transition-all duration-300 hover:scale-105
                         hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]
                       text-red-500 font-extrabold"
          >
            <span aria-hidden>{flag}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
