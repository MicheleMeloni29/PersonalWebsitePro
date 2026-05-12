// This screen components allows the user to navigate through the different sections of the page, and also to switch between languages.
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes"; // Keep theme state only if you still want to modulate LiquidChrome colors.
import { useReducedMotion } from "framer-motion";
import {
  FaHome, FaUser, FaClock, FaProjectDiagram, FaEnvelope,
} from "react-icons/fa";
import LiquidChrome from "./UI/LiquidChrome";
import { useLanguage } from "./data/LanguageProvider";

export default function Header() {
  const { t, lang, cycleLang } = useLanguage();

  // Theme information is only used here to adapt the LiquidChrome palette.
  const { theme, resolvedTheme } = useTheme();
  const prefersReduced = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Waits for client mount before rendering visual effects that depend on browser APIs.
  useEffect(() => setMounted(true), []);

  // Updates CSS variables with the real header height so the layout can offset top/bottom navigation space.
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

    // Recomputes the offsets when the nav resizes or when the viewport crosses the desktop breakpoint.
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

  // Navigation labels are translated through the language provider.
  const links = [
    { href: "#hero", label: t("Header", "home"), icon: <FaHome /> },
    { href: "#about", label: t("Header", "about"), icon: <FaUser /> },
    { href: "#timeline", label: t("Header", "timeline"), icon: <FaClock /> },
    { href: "#projects", label: t("Header", "projects"), icon: <FaProjectDiagram /> },
    { href: "#contact", label: t("Header", "contact"), icon: <FaEnvelope /> },
  ];

  // LiquidChrome expects normalized RGB values in the 0..1 range.
  const mode = (resolvedTheme ?? theme) as "light" | "dark" | undefined;
  const baseColor: [number, number, number] =
    mode === "dark" ? [0.08, 0.08, 0.12] : [0.88, 0.88, 0.93];

  // Current language shown in compact form inside the language switcher.
  const flag = lang === "en" ? "EN" : lang === "it" ? "IT" : "ES";

  return (
    // The header stays fixed and moves from bottom on mobile to top on large screens.
    <header className="fixed left-1/2 -translate-x-1/2 z-50 bottom-2 lg:bottom-auto lg:top-4">
      <nav
        ref={navRef}
        className="
          relative overflow-hidden isolate
          flex items-center justify-center gap-4 px-6 py-2
          min-w-[380px] lg:min-w-[700px] w-auto max-w-full whitespace-nowrap
          rounded-full border-0
          shadow-[0_4px_6px_rgba(0,0,0,0.4)] backdrop-blur-md
        "
      >
        {/* Animated background layer, rendered only after mount to avoid hydration mismatches. */}
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

        {/* Foreground navigation content sits above the decorative LiquidChrome layer. */}
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
              {/* Each navigation item pairs an icon with a text label that appears on desktop only. */}
              {React.cloneElement(icon, { className: "text-lg", "aria-hidden": true })}
              <span className="hidden lg:inline text-sm font-medium">{label}</span>
            </a>
          ))}

          {/* Cycles through EN -> IT -> ES and shows the active language in a compact badge. */}
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
