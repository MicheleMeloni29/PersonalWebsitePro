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

type AboutProps = HTMLMotionProps<'section'>;

export default function About({ className, id = 'about', ...sectionProps }: AboutProps) {
    const [isMobile, setIsMobile] = useState(false);
    const reduce = useReducedMotion();
    const sectionRef = useRef<HTMLElement | null>(null);
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

    const fadeUp = {
        hidden: { opacity: 0, y: reduce ? 0 : Y },
        visible: { opacity: 1, y: 0 },
    };

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

    const baseGapSeconds = reduce ? 0 : isMobile ? 0.08 : 0.12;
    const baseGapMs = baseGapSeconds * 1000;

    useEffect(() => {
        if (!inView || hasStartedRef.current) {
            return;
        }

        hasStartedRef.current = true;

        let cancelled = false;
        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                if (ms <= 0) {
                    resolve();
                    return;
                }
                setTimeout(resolve, ms);
            });

        (async () => {
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
            <div className={wrapperClasses}>
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
                    About Me
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={introControls}
                    transition={{ duration: FADE, ease: fadeEase }}
                    className="text-sm sm:text-lg md:text-2xl text-red-900
                     mt-10 sm:mt-8 md:mt-10 mb-4"
                >
                    <DecryptedText
                        text="Hi, I'm Michele. I started programming in college, and it changed everything."
                        animateOn="view"
                        sequential
                        revealDirection="start"
                        speed={isMobile ? 36 : 40}
                        encryptedClassName="text-rose-300/80 blur-[0.5px]"
                    />
                </motion.p>

                <motion.p
                    variants={blockRight}
                    initial="hidden"
                    animate={blockRightControls}
                    transition={{ duration: DUR, ease: slideEase }}
                    className="text-[13px] sm:text-base md:text-lg text-red-900
                     leading-relaxed sm:leading-relaxed md:leading-normal
                     mt-8 sm:mt-6 md:mt-8"
                >
                    The first lines of code, written just for fun, turned into a passion. I dove deep into
                    mobile and frontend development, discovering React, React Native, TypeScript,
                    JavaScript, and Flutter.
                </motion.p>

                <motion.p
                    variants={blockLeft}
                    initial="hidden"
                    animate={blockLeftControls}
                    transition={{ duration: DUR, ease: slideEase }}
                    className="text-[13px] sm:text-base md:text-lg text-red-900
                     leading-relaxed sm:leading-relaxed md:leading-normal
                     mt-8 sm:mt-5 md:mt-8"
                >
                    As a self-taught developer, I built projects, explored backend with Python, and keep
                    learning every day. I code to grow, to solve problems, and to turn ideas into reality.
                </motion.p>
            </div>
        </motion.section>
    );
}
