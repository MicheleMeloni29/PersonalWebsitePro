// This component is responsible for rendering the timeline section of the page, which is split into two parts to maintain readability and visual balance. 
// The structure of the timeline entries is defined in a separate file for better organization.
'use client';

import { motion } from "framer-motion";
import { ComponentPropsWithoutRef, useMemo } from "react";
import type { TimelineEntry } from "./data/TimelineStructure";
import { useLanguage } from "./data/LanguageProvider";

const DEFAULT_SPLIT_AT = 4;

// Splits the translated timeline entries into two sections while keeping the heading together.
function useTimelineParts() {
    const { dict } = useLanguage();
    const items = dict.Timeline.items as TimelineEntry[];
    const splitAt = Number(dict.Timeline.splitAt ?? DEFAULT_SPLIT_AT);
    const heading = dict.Timeline.heading;

    return useMemo(() => {
        const safeSplit = Math.max(0, Math.min(items.length, splitAt));
        return {
            partOne: items.slice(0, safeSplit),
            partTwo: items.slice(safeSplit),
            heading,
        };
    }, [items, splitAt, heading]);
}

type TimelineSectionProps = ComponentPropsWithoutRef<'section'> & {
    items: TimelineEntry[];
    heading?: string;
    showHeading?: boolean;
    /** For part one we want the vertical line to span the full available height. */
    fullHeightLine?: boolean;
};

function TimelineSection({
    className,
    id = 'timeline',
    items,
    heading = '',
    showHeading = true,
    fullHeightLine = false,
    ...sectionProps
}: TimelineSectionProps) {
    // Mobile-first spacing keeps the section compact on small screens and expands it at larger breakpoints.
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

                {/* Timeline column containing the vertical guide line and the ordered entries. */}
                <div className="relative pl-4 sm:pl-6 space-y-6 sm:space-y-10 md:space-y-12">
                    {/* Vertical guide line that connects all timeline entries. */}
                    {fullHeightLine ? (
                        <span
                            aria-hidden
                            className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-red-800"
                        />
                    ) : (
                        <span aria-hidden className="pointer-events-none absolute left-0 top-0 w-px bg-red-800 h-full" />
                    )}

                    {/* Each item fades and slides in as it enters the viewport. */}
                    {items.map((item, idx) => (
                        <motion.div
                            key={`${item.title}-${idx}`}
                            initial={{ opacity: 0, x: -22 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            className="relative"
                        >
                            {/* Small marker aligned with the vertical line. */}
                            <span
                                className="
                                    absolute -left-[9px] top-0.5
                                    h-1.5 w-1.5 rounded-full bg-red-600 ring-[1.5px] ring-red-600/25
                                    sm:-left-[11px] sm:top-1.5 sm:h-2 sm:w-2 sm:ring-4"
                            />

                            {/* Year label acts as the compact chronological anchor. */}
                            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-red-900/90">
                                {item.year}
                            </p>

                            {/* Entry title highlights the milestone or role. */}
                            <h3
                                className="
                  text-sm sm:text-lg md:text-xl
                  font-semibold md:font-bold text-red-600
                  leading-snug sm:leading-snug md:leading-snug
                "
                            >
                                {item.title}
                            </h3>

                            {/* Description provides the details for the corresponding timeline point. */}
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

// Part one: heading included, with the vertical line stretched across the full section.
type TimelinePartProps = Omit<TimelineSectionProps, 'items'>;

export function TimelinePartOne({
    heading,
    id = 'timeline',
    ...props
}: TimelinePartProps) {
    const { partOne, heading: defaultHeading } = useTimelineParts();
    return (
        <TimelineSection
            {...props}
            id={id}
            items={partOne}
            heading={heading ?? defaultHeading}
            showHeading
            fullHeightLine
        />
    );
}

// Part two: continuation without repeating the heading, while preserving visual alignment.
export function TimelinePartTwo({
    id = 'timeline-continued',
    ...props
}: TimelinePartProps) {
    const { partTwo } = useTimelineParts();
    return (
        <TimelineSection
            {...props}
            id={id}
            items={partTwo}
            showHeading={false}
            className="mt-[-3rem] sm:mt-0"
            // fullHeightLine intentionally omitted for the continuation segment.
        />
    );
}

export { TimelineSection as TimelineBase };
