"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import {
  FaHome, FaUser, FaClock, FaProjectDiagram, FaEnvelope, FaSun, FaMoon,
} from "react-icons/fa";
import LiquidChrome from "./UI/LiquidChrome"; // 👈 importa il background

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const prefersReduced = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Evita mismatch: il client fa prima render con mounted=false (uguale al server)
  useEffect(() => setMounted(true), []);

  // Aggiorna le CSS vars con l'altezza reale dell'header
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

  const toggleTheme = () => setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark");

  const links = [
    { href: "#hero", label: "Home", icon: <FaHome /> },
    { href: "#about", label: "About", icon: <FaUser /> },
    { href: "#timeline", label: "Timeline", icon: <FaClock /> },
    { href: "#projects", label: "Projects", icon: <FaProjectDiagram /> },
    { href: "#contact", label: "Contact", icon: <FaEnvelope /> },
  ];

  // Colori per LiquidChrome (0..1)
  const mode = (resolvedTheme ?? theme) as "light" | "dark" | undefined;
  const baseColor: [number, number, number] =
    mode === "dark" ? [0.08, 0.08, 0.12] : [0.88, 0.88, 0.93];

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
                         text-red-900 dark:text-white"
              aria-label={label}
            >
              {React.cloneElement(icon, { className: "text-lg", "aria-hidden": true })}
              <span className="hidden lg:inline text-sm font-medium">{label}</span>
            </a>
          ))}

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center gap-2 px-3 py-1 rounded-md
                       transition-all duration-300 hover:scale-105
                       hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]
                       text-red-900 dark:text-white"
          >
            {!mounted ? (
              <FaSun className="text-lg opacity-0" aria-hidden />
            ) : ((resolvedTheme ?? theme) === "dark" ? (
              <FaSun className="text-lg" aria-hidden />
            ) : (
              <FaMoon className="text-lg" aria-hidden />
            ))}
            <span className="hidden lg:inline text-sm font-medium">
              {!mounted ? "Theme" : ((resolvedTheme ?? theme) === "light" ? "Dark" : "Light")}
            </span>
          </button>
        </div>

        {/* (facoltativo) velo per leggibilità su theme chiaro */}
        {/* <div className="absolute inset-0 bg-white/10 dark:bg-black/0 pointer-events-none" /> */}
      </nav>
    </header>
  );
}
