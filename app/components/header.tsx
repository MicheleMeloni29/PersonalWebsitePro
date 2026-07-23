"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaClock,
  FaEnvelope,
  FaHome,
  FaProjectDiagram,
  FaUser,
} from "react-icons/fa";

import { useLanguage } from "./data/LanguageProvider";

type SectionId = "hero" | "about" | "timeline" | "projects" | "contact";

type NavLink = {
  id: SectionId;
  label: string;
  icon: IconType;
};

export default function Header() {
  const { t, lang, cycleLang } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  useEffect(() => {
    if (!navRef.current) return;

    const root = document.documentElement;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const updateNavigationOffset = () => {
      const height = navRef.current?.offsetHeight ?? 0;

      if (desktopQuery.matches) {
        root.style.setProperty("--nav-top-h", `${height}px`);
        root.style.setProperty("--nav-bottom-h", "0px");
      } else {
        root.style.setProperty("--nav-bottom-h", `${height}px`);
        root.style.setProperty("--nav-top-h", "0px");
      }
    };

    const resizeObserver = new ResizeObserver(updateNavigationOffset);
    resizeObserver.observe(navRef.current);
    updateNavigationOffset();
    desktopQuery.addEventListener?.("change", updateNavigationOffset);
    window.addEventListener("resize", updateNavigationOffset);

    return () => {
      resizeObserver.disconnect();
      desktopQuery.removeEventListener?.("change", updateNavigationOffset);
      window.removeEventListener("resize", updateNavigationOffset);
    };
  }, []);

  useEffect(() => {
    const sectionIds: SectionId[] = [
      "hero",
      "about",
      "timeline",
      "projects",
      "contact",
    ];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const scrollRoot = document.getElementById("hero")?.closest("main") ?? null;

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id as SectionId);
        }
      },
      {
        root: scrollRoot,
        rootMargin: "-32% 0px -50% 0px",
        threshold: [0, 0.15, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const links: NavLink[] = [
    { id: "hero", label: t("Header", "home"), icon: FaHome },
    { id: "about", label: t("Header", "about"), icon: FaUser },
    { id: "timeline", label: t("Header", "timeline"), icon: FaClock },
    {
      id: "projects",
      label: t("Header", "projects"),
      icon: FaProjectDiagram,
    },
    { id: "contact", label: t("Header", "contact"), icon: FaEnvelope },
  ];

  const languageCode = lang === "en" ? "EN" : lang === "it" ? "IT" : "ES";

  return (
    <header
      className="
        fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50
        flex justify-center px-3
        lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:top-5
        lg:-translate-x-1/2 lg:px-0
      "
    >
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className="
          relative isolate flex w-full max-w-[430px] items-stretch gap-1
          overflow-hidden rounded-[1.35rem] border border-white/[0.10]
          bg-[#08090c]/88 p-1.5
          shadow-[0_18px_50px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.06)]
          backdrop-blur-2xl
          before:pointer-events-none before:absolute before:inset-x-10 before:top-0
          before:h-px before:bg-gradient-to-r before:from-transparent
          before:via-red-500/75 before:to-transparent
          supports-[backdrop-filter]:bg-[#08090c]/72
          lg:w-auto lg:max-w-none lg:items-center lg:gap-1.5 lg:rounded-2xl lg:p-2
        "
      >
        <div className="grid min-w-0 flex-1 grid-cols-5 gap-0.5 lg:flex lg:items-center lg:gap-1">
          {links.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                aria-label={label}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSection(id)}
                className={`
                  group relative flex min-w-0 flex-col items-center justify-center gap-1
                  rounded-xl px-1 py-2 text-[9px] font-medium tracking-[0.02em]
                  outline-none transition-[color,background-color,box-shadow,transform]
                  duration-200 ease-out
                  focus-visible:bg-white/[0.08] focus-visible:text-white
                  focus-visible:ring-2 focus-visible:ring-red-500/70
                  active:scale-[0.96]
                  lg:flex-none lg:flex-row lg:gap-2 lg:px-3 lg:py-2
                  lg:text-xs lg:tracking-normal
                  ${
                    isActive
                      ? "bg-white/[0.075] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                      : "text-white/55 hover:-translate-y-0.5 hover:bg-white/[0.055] hover:text-white lg:hover:translate-y-0"
                  }
                `}
              >
                <span
                  className={`
                    relative grid h-5 w-5 place-items-center transition-colors duration-200
                    ${
                      isActive
                        ? "text-red-500"
                        : "text-white/45 group-hover:text-red-400"
                    }
                  `}
                >
                  <span
                    aria-hidden
                    className={`
                      absolute inset-0 rounded-full bg-red-500/30 blur-md
                      transition-opacity duration-200
                      ${isActive ? "opacity-60" : "opacity-0 group-hover:opacity-40"}
                    `}
                  />
                  <Icon className="relative h-3.5 w-3.5" aria-hidden />
                </span>

                <span className="max-w-full truncate leading-none">{label}</span>

                <span
                  aria-hidden
                  className={`
                    absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2
                    rounded-full bg-red-500 transition-[width,opacity] duration-200
                    ${isActive ? "w-4 opacity-100" : "w-0 opacity-0"}
                  `}
                />
              </a>
            );
          })}
        </div>

        <span
          aria-hidden
          className="my-1 w-px shrink-0 bg-white/[0.10] lg:mx-0.5 lg:h-5 lg:self-auto"
        />

        <button
          type="button"
          onClick={cycleLang}
          aria-label={t("Header", "changeLanguage")}
          title={t("Header", "changeLanguage")}
          className="
            group relative grid min-h-12 w-11 shrink-0 place-items-center overflow-hidden
            rounded-xl border border-white/[0.09] bg-white/[0.035]
            text-[11px] font-bold tracking-[0.12em] text-white/75 outline-none
            transition-[color,background-color,border-color,box-shadow,transform]
            duration-200 ease-out
            hover:-translate-y-0.5 hover:border-red-500/35 hover:bg-red-500/[0.08]
            hover:text-white hover:shadow-[0_8px_22px_rgba(239,68,68,0.12)]
            focus-visible:ring-2 focus-visible:ring-red-500/70
            active:scale-[0.96]
            lg:min-h-0 lg:h-9 lg:w-12 lg:hover:translate-y-0
          "
        >
          <span
            aria-hidden
            className="
              absolute -right-1 -top-1 h-3 w-3 rounded-full border
              border-red-400/40 bg-red-500/20 transition-transform duration-200
              group-hover:scale-[1.6]
            "
          />
          <span aria-live="polite">{languageCode}</span>
        </button>
      </nav>
    </header>
  );
}
