'use client';

import { motion } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";

export type TimelineEntry = {
    year: string;
    title: string;
    description: string;
};

// Dati timeline (come i tuoi)
export const timelineData: TimelineEntry[] = [
    {
        year: "2018 June",
        title: "Diploma",
        description: "I obtained my diploma at IIS 'Diongi Scano - Ottone Bacaredda' in Cagliari, Italy.",
    },
    {
        year: "2018 July-",
        title: "First Job",
        description: "I spent the summer working as a driver for a rental car company",
    },
    {
        year: "2018 October-2024 June",
        title: "Driver",
        description: "I started working as a driver for a local pizzeria.",
    },
    {
        year: "2019 January-2019 May",
        title: "Smartphone Technician",
        description: "I worked in an electronics repair shop, mainly fixing smartphones and providing customer support.",
    },
    {
        year: "2020 September",
        title: "Start informatics Studies",
        description: "I enrolled in the 'Informatics' course at the University of Cagliari, Italy.",
    },
    {
        year: "2021",
        title: "Coding bases",
        description: "I started learning the basics of coding, with C language",
    },
    {
        year: "2022",
        title: "First mobile/web development",
        description: "Learn Java and started developing Android applications and HTML/CSS for webpages.",
    },
    {
        year: "2023",
        title: "Start passion for web and mobile development",
        description: "Learnt backend basics and discovered mobile technologies like Flutter and React Native.",
    },
    {
        year: "2024",
        title: "Development Passion",
        description: "Develop applications with React Native, learn Django and Next.js for full-stack development.",
    },
];

// ---- SPLIT LOGIC: divide automaticamente DOPO "Smartphone Technician"
const SPLIT_AT = (() => {
    const idx = timelineData.findIndex((e) => e.title === "Smartphone Technician");
    // se trovato, prendi tutto fino a *incluso* (quindi +1). fallback a 4 come nel tuo esempio
    return idx >= 0 ? idx + 1 : 4;
})();

const TIMELINE_PART_ONE_ITEMS = timelineData.slice(0, SPLIT_AT);
const TIMELINE_PART_TWO_ITEMS = timelineData.slice(SPLIT_AT);

type TimelineSectionProps = ComponentPropsWithoutRef<"section"> & {
    items: TimelineEntry[];
    heading?: string;
    showHeading?: boolean;
    /** Mostra una call-to-action in fondo che porta alla sezione successiva */
    continueToId?: string;
    /** Mostra un piccolo badge “Continues” in alto (per la seconda parte) */
    continuedBadge?: boolean;
    fullHeightLine?: boolean;
};

function TimelineSection({
    className,
    id = "timeline",
    items,
    heading = "My Journey",
    showHeading = true,
    fullHeightLine = false, 
    continueToId,
    continuedBadge = false,
    ...sectionProps
}: TimelineSectionProps) {
    const baseClasses =
        " h-dvh flex items-center justify-center px-5 md:px-8 pb-20 pt-20";

    return (
        <section
            id={id}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ""}`}
            aria-labelledby={`${id}-title`}
        >
            <div className="relative w-full max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    {showHeading && (
                        <h2 id={`${id}-title`} className="text-3xl md:text-4xl font-bold text-red-800">
                            {heading}
                        </h2>
                    )}
                </div>

                {/* Wrapper della colonna */}
                <div className="relative pl-6 space-y-12">
                    {/* ✅ Linea verticale */}
                    {fullHeightLine ? (
                        // Full height (top→bottom) per la Parte 1
                        <span
                            aria-hidden
                            className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-red-800"
                        />
                    ) : (
                        // Comportamento classico (solo quanto i contenuti)
                        <span
                            aria-hidden
                            className="block absolute left-0 top-0 w-px bg-red-800"
                            style={{
                                // altezza pari all'altezza contenuti: misurata via CSS trick
                                // optional: puoi rimuoverlo e tenere 'border-l' come prima se preferisci
                                height: '100%'
                            }}
                        />
                    )}

                    {/* Items */}
                    {items.map((item, idx) => (
                        <motion.div
                            key={`${item.title}-${idx}`}
                            data-index={idx}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: idx * 0.06 }}
                            className="relative"
                        >
                            {/* Dot sulla linea */}
                            <span className="absolute -left-[11px] top-1.5 h-2 w-2 rounded-full bg-red-600 ring-4 ring-red-600/20" />
                            <p className="text-xs uppercase tracking-wide text-red-900">{item.year}</p>
                            <h3 className="text-lg font-bold text-red-600">{item.title}</h3>
                            <p className="text-base text-red-900">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// API ergonomica per le due “pagine” della timeline
type TimelinePartProps = Omit<
    TimelineSectionProps,
    "items" | "continueToId" | "continuedBadge"
>;

export function TimelinePartOne({
    heading = "My Journey",
    id = "timeline",
    ...props
}: TimelinePartProps) {
    return (
        <TimelineSection
            {...props}
            id={id}
            items={TIMELINE_PART_ONE_ITEMS}
            heading={heading}
            showHeading={true}
            fullHeightLine // ⟵ ON qui
        />
    );
}

export function TimelinePartTwo({
    id = "timeline-continued",
    ...props
}: TimelinePartProps) {
    return (
        <TimelineSection
            {...props}
            id={id}
            items={TIMELINE_PART_TWO_ITEMS}
            showHeading={false}
        // fullHeightLine NON attivo qui
        />
    );
}

// utili se vuoi usare i dataset “grezzi” altrove
export const timelinePartOneItems = TIMELINE_PART_ONE_ITEMS;
export const timelinePartTwoItems = TIMELINE_PART_TWO_ITEMS;
export { TimelineSection as TimelineBase };
