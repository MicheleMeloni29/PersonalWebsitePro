'use client';

import { motion } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";
import { TimelineEntry } from "./data/TimelineStructure";
import { timelineData } from "./data/TimelineStructure";

// ---- split dopo “Smartphone Technician”
const SPLIT_AT = (() => {
    const idx = timelineData.findIndex((e) => e.title === 'Smartphone Technician');
    return idx >= 0 ? idx + 1 : 4;
})();

const TIMELINE_PART_ONE_ITEMS = timelineData.slice(0, SPLIT_AT);
const TIMELINE_PART_TWO_ITEMS = timelineData.slice(SPLIT_AT);

type TimelineSectionProps = ComponentPropsWithoutRef<'section'> & {
    items: TimelineEntry[];
    heading?: string;
    showHeading?: boolean;
    /** Per la parte 1 vogliamo la linea a tutta altezza */
    fullHeightLine?: boolean;
};

function TimelineSection({
    className,
    id = 'timeline',
    items,
    heading = 'My Journey',
    showHeading = true,
    fullHeightLine = false,
    ...sectionProps
}: TimelineSectionProps) {
    // mobile-first: spazi e font più compatti, si allargano con le breakpoint
    const mobileTopPadding = showHeading ? 'pt-12' : 'pt-3';
    const mobileBottomPadding = showHeading ? 'pb-12' : 'pb-8';
    const baseClasses = [
        'h-dvh flex items-center justify-center',
        'px-3 sm:px-6 md:px-8',
        mobileTopPadding,
        'sm:pt-16 md:pt-20',
        mobileBottomPadding,
        'sm:pb-16 md:pb-20',
    ].join(' ');

    return (
        <section
            id={id}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
            aria-labelledby={`${id}-title`}
        >
            <div className="relative w-full max-w-[23rem] sm:max-w-[34rem] md:max-w-2xl">
                <div className="mb-10 sm:mb-6 flex items-center justify-between">
                    {showHeading && (
                        <h2
                            id={`${id}-title`}
                            className="font-bold text-red-800
                         text-[20px] leading-tight
                         sm:text-3xl sm:leading-snug
                         md:text-4xl"
                        >
                            {heading}
                        </h2>
                    )}
                </div>

                {/* colonna timeline */}
                <div className="relative pl-4 sm:pl-6 space-y-6 sm:space-y-10 md:space-y-12">
                    {/* linea verticale */}
                    {fullHeightLine ? (
                        <span
                            aria-hidden
                            className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-red-800"
                        />
                    ) : (
                        <span aria-hidden className="pointer-events-none absolute left-0 top-0 w-px bg-red-800 h-full" />
                    )}

                    {/* items */}
                    {items.map((item, idx) => (
                        <motion.div
                            key={`${item.title}-${idx}`}
                            initial={{ opacity: 0, x: -22 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            className="relative"
                        >
                            {/* dot */}
                            <span
                                className="
                  absolute -left-[9px] top-0.5
                  h-1.5 w-1.5 rounded-full bg-red-600 ring-[1.5px] ring-red-600/25
                  sm:-left-[11px] sm:top-1.5 sm:h-2 sm:w-2 sm:ring-4
                "
                            />

                            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-red-900/90">
                                {item.year}
                            </p>

                            <h3
                                className="
                  text-sm sm:text-lg md:text-xl
                  font-semibold md:font-bold text-red-600
                  leading-snug sm:leading-snug md:leading-snug
                "
                            >
                                {item.title}
                            </h3>

                            <p
                                className="
                  text-[12px] sm:text-sm md:text-base
                  text-red-900/90
                  leading-relaxed md:leading-normal
                  break-words
                "
                            >
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Parte 1: titolo + linea a tutta altezza
type TimelinePartProps = Omit<TimelineSectionProps, 'items'>;

export function TimelinePartOne({
    heading = 'My Journey',
    id = 'timeline',
    ...props
}: TimelinePartProps) {
    return (
        <TimelineSection
            {...props}
            id={id}
            items={TIMELINE_PART_ONE_ITEMS}
            heading={heading}
            showHeading
            fullHeightLine
        />
    );
}

// Parte 2: continua, niente titolo (rispetta lo spazio)
export function TimelinePartTwo({
    id = 'timeline-continued',
    ...props
}: TimelinePartProps) {
    return (
        <TimelineSection
            {...props}
            id={id}
            items={TIMELINE_PART_TWO_ITEMS}
            showHeading={false}
            className="mt-[-3rem] sm:mt-0"
        // no fullHeightLine
        />
    );
}

export const timelinePartOneItems = TIMELINE_PART_ONE_ITEMS;
export const timelinePartTwoItems = TIMELINE_PART_TWO_ITEMS;
export { TimelineSection as TimelineBase };
