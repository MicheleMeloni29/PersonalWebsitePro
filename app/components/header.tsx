"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  FaHome, FaUser, FaClock, FaProjectDiagram, FaEnvelope, FaSun, FaMoon,
} from "react-icons/fa";

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Evita mismatch: il client fa prima render con mounted=false (uguale al server)
  useEffect(() => setMounted(true), []);

  // (rimane invariato) aggiorna le CSS vars con l'altezza reale dell'header
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

  return (
    <header className="fixed left-1/2 -translate-x-1/2 z-50 bottom-14 lg:bottom-auto lg:top-8">
      <nav
        ref={navRef}
        className="flex items-center gap-3 px-4 py-2
                   bg-gradient-to-br from-[#e2e2e2] to-[#b1b1b1]
                   dark:from-[#111] dark:to-[#0d0d0d]
                   rounded-full border border-red-800
                   shadow-[0_4px_6px_rgba(0,0,0,0.4)] backdrop-blur-md"
      >
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

        {/* Toggle Theme: placeholder identico tra server e client, icona reale dopo mount */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center gap-2 px-3 py-1 rounded-md
                     transition-all duration-300 hover:scale-105
                     hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]
                     text-red-900 dark:text-white"
        >
          {/* placeholder invisibile = markup stabile alla prima render */}
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
      </nav>
    </header>
  );
}
