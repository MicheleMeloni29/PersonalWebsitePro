// Second screen the user reaches while scrolling, meant to briefly introduce who I am,
// how I started, and how my programming career is progressing.
'use client';

import { useEffect, useRef, useState } from 'react';
import {
    motion,
    useAnimationControls,
    useInView,
    useReducedMotion,
    type HTMLMotionProps,
} from 'framer-motion';
import DecryptedText from './UI/DecriptedText';
import { useLanguage } from './data/LanguageProvider';

type AboutProps = HTMLMotionProps<'section'>;

export default function About({ className, id = 'about', ...sectionProps }: AboutProps) {
    const { dict } = useLanguage();
    const [isMobile, setIsMobile] = useState(false);
    const reduce = useReducedMotion();
    const sectionRef = useRef<HTMLElement | null>(null);
    // Triggers the animation sequence only once when the section is sufficiently visible.
    const inView = useInView(sectionRef, {
        once: true,
        amount: 0.35,
        margin: '-12% 0px -12% 0px',
    });
    const headingControls = useAnimationControls();
    const introControls = useAnimationControls();
    const blockRightControls = useAnimationControls();
    const blockLeftControls = useAnimationControls();
    const hasStartedRef = useRef(false);

    useEffect(() => {
        // Tracks the mobile breakpoint in JS so motion distances and timings can adapt.
        const mq = window.matchMedia('(max-width: 640px)');
        const on = () => setIsMobile(mq.matches);
        on();
        mq.addEventListener?.('change', on);
        return () => mq.removeEventListener?.('change', on);
    }, []);

    // Responsive offsets/durations + fallback when reduce is active (animation stays subtle)
    const X = isMobile ? 60 : 120;
    const Y = isMobile ? 10 : 16;
    const DUR = reduce ? 0.2 : isMobile ? 0.55 : 0.9;
    const FADE = reduce ? 0.20 : isMobile ? 0.27 : 0.35;

    const fadeEase = [0.22, 0.61, 0.36, 1] as const;
    const slideEase = [0.16, 1, 0.3, 1] as const;

    // Shared variant for elements that fade upward into place.
    const fadeUp = {
        hidden: { opacity: 0, y: reduce ? 0 : Y },
        visible: { opacity: 1, y: 0 },
    };

    // Builds mirrored slide-in variants for the two text blocks.
    const blockVariants = (direction: 'left' | 'right') => {
        const hidden: Record<string, number> = { opacity: 0 };

        if (!reduce) {
            if (isMobile) {
                hidden.y = Y;
            } else {
                hidden.x = direction === 'left' ? -X : X;
            }
        }

        return {
            hidden,
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
            },
        };
    };

    const blockRight = blockVariants('right');
    const blockLeft = blockVariants('left');

    // Small stagger between each reveal step.
    const baseGapSeconds = reduce ? 0 : isMobile ? 0.58 : 0.62;
    const baseGapMs = baseGapSeconds * 1500;

    useEffect(() => {
        if (!inView || hasStartedRef.current) {
            return;
        }

        hasStartedRef.current = true;

        let cancelled = false;
        // Lightweight delay helper used to space the animation steps.
        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                if (ms <= 0) {
                    resolve();
                    return;
                }
                setTimeout(resolve, ms);
            });

        (async () => {
            // Runs the section reveal in order: title, intro, right block, left block.
            await headingControls.start('visible');
            if (cancelled) {
                return;
            }
            await wait(baseGapMs);

            await introControls.start('visible');
            if (cancelled) {
                return;
            }
            await wait(baseGapMs);

            await blockRightControls.start('visible');
            if (cancelled) {
                return;
            }
            await wait(baseGapMs);

            if (cancelled) {
                return;
            }
            await blockLeftControls.start('visible');
        })();

        return () => {
            cancelled = true;
        };
    }, [
        inView,
        baseGapMs,
        headingControls,
        introControls,
        blockRightControls,
        blockLeftControls,
    ]);

    // Base layout classes are kept separate to make the section markup easier to scan.
    const baseClasses =
        'h-dvh flex items-center justify-center px-4 sm:px-6 text-white overflow-hidden';
    const wrapperClasses = 'w-full max-w-[28rem] sm:max-w-2xl text-left';

    return (
        <motion.section
            id={id}
            ref={sectionRef}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
            aria-labelledby="about-title"
        >
            {/* Centers the content block inside the full-screen section. */}
            <div className={wrapperClasses}>
                {/* Main section heading with a simple fade-up reveal. */}
                <motion.h2
                    id="about-title"
                    variants={fadeUp}
                    initial="hidden"
                    animate={headingControls}
                    transition={{ duration: FADE, ease: fadeEase }}
                    className="font-bold text-red-800
                     text-xl sm:text-3xl md:text-4xl
                     leading-tight sm:leading-snug"
                >
                    {dict.About.title}
                </motion.h2>

                {/* Intro line uses the decrypted text effect to create a more dynamic first reveal. */}
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={introControls}
                    transition={{ duration: FADE, ease: fadeEase }}
                    className="text-sm sm:text-lg md:text-2xl text-red-900
                     mt-10 sm:mt-8 md:mt-10 mb-4"
                >
                    <DecryptedText
                        text={dict.About.intro}
                        animateOn="view"
                        sequential
                        revealDirection="start"
                        speed={isMobile ? 36 : 40}
                        encryptedClassName="text-rose-300/80 blur-[0.5px]"
                    />
                </motion.p>

                {/* First descriptive paragraph enters from the right on desktop. */}
                <motion.p
                    variants={blockRight}
                    initial="hidden"
                    animate={blockRightControls}
                    transition={{ duration: DUR, ease: slideEase }}
                    className="text-[13px] sm:text-base md:text-lg text-red-900
                     leading-relaxed sm:leading-relaxed md:leading-normal
                     mt-8 sm:mt-6 md:mt-8"
                >
                    {dict.About.blockRight}
                </motion.p>

                {/* Second descriptive paragraph mirrors the previous one for visual balance. */}
                <motion.p
                    variants={blockLeft}
                    initial="hidden"
                    animate={blockLeftControls}
                    transition={{ duration: DUR, ease: slideEase }}
                    className="text-[13px] sm:text-base md:text-lg text-red-900
                     leading-relaxed sm:leading-relaxed md:leading-normal
                     mt-8 sm:mt-5 md:mt-8"
                >
                    {dict.About.blockLeft}
                </motion.p>
            </div>
        </motion.section>
    );
}
