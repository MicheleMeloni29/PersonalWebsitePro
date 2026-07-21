// This component renders the timeline section as a single continuous timeline.
'use client';

import { motion } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";
import type { TimelineEntry } from "./data/TimelineStructure";
import { useLanguage } from "./data/LanguageProvider";

type TimelineProps = ComponentPropsWithoutRef<'section'>;

export function Timeline({
    className,
    id = 'timeline',
    ...sectionProps
}: TimelineProps) {
    const { dict } = useLanguage();
    const items = dict.Timeline.items as TimelineEntry[];
    const heading = dict.Timeline.heading;

    const baseClasses = [
        'min-h-dvh flex items-center justify-center',
        'px-3 sm:px-6 md:px-8',
        'pt-12 sm:pt-16 md:pt-20',
        'pb-12 sm:pb-16 md:pb-20',
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
                    <h2
                        id={`${id}-title`}
                        className="font-bold text-red-800
                         text-[20px] leading-tight
                         sm:text-3xl sm:leading-snug
                         md:text-4xl"
                    >
                        {heading}
                    </h2>
                </div>

                <div className="relative pl-4 sm:pl-6 space-y-6 sm:space-y-10 md:space-y-12">
                    <span
                        aria-hidden
                        className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-red-800"
                    />

                    {items.map((item, idx) => (
                        <motion.div
                            key={`${item.title}-${idx}`}
                            initial={{ opacity: 0, x: -22 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            className="relative"
                        >
                            <span
                                className="
                                    absolute -left-[9px] top-0.5
                                    h-1.5 w-1.5 rounded-full bg-red-600 ring-[1.5px] ring-red-600/25
                                    sm:-left-[11px] sm:top-1.5 sm:h-2 sm:w-2 sm:ring-4"
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

                <div aria-hidden className="h-24 sm:h-32 md:h-40" />
            </div>
        </section>
    );
}
