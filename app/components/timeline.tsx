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
        'h-dvh snap-start snap-always',
        'px-3 sm:px-6 md:px-8',
    ].join(' ');

    return (
        <section
            id={id}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
            aria-labelledby={`${id}-title`}
        >
            <div
                data-timeline-scroll="true"
                className="relative mx-auto h-full w-full max-w-[23rem] overflow-y-auto no-scrollbar pt-12 pb-24 sm:max-w-[34rem] sm:pt-16 sm:pb-16 md:max-w-2xl md:pt-20 md:pb-20"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                <div className="pointer-events-none absolute inset-x-0 top-12 lg:top-30 z-20 flex justify-center">
                    <h2
                        id={`${id}-title`}
                        className="text-center text-xl md:2xl lg:text-3xl font-bold uppercase tracking-[0.22em] text-[#B91C1C] "
                    >
                        {heading}
                    </h2>
                </div>

                <div className="top-24 bottom-24 lg:top-44 lg:bottom-44 xl:top-44 xl:bottom-44 2xl:top-44 2xl:bottom-44 relative pl-6 sm:pl-10 md:pl-12 space-y-16 sm:space-y-20 md:space-y-24">
                    {items.map((item, idx) => (
                        <motion.div
                            key={`${item.title}-${idx}`}
                            initial={{ opacity: 0, x: -22 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            className="relative"
                        >
                            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-red-900">
                                {item.year}
                            </p>

                            <div className="mt-2 flex items-start gap-3 sm:gap-4">
                                <span
                                    className="
                                        mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full
                                        bg-red-600 ring-[1.5px] ring-red-600
                                        sm:mt-2 sm:h-2 sm:w-2"
                                />

                                <h3
                                    className="
                                        text-sm sm:text-lg md:text-xl
                                        font-semibold md:font-bold text-red-600
                                        leading-snug sm:leading-snug md:leading-snug
                                    "
                                >
                                    {item.title}
                                </h3>
                            </div>

                            <p
                                className="
                                    pl-[18px] sm:pl-6
                                    text-[12px] sm:text-sm md:text-base
                                    text-red-900
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
