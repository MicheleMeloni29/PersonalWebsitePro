'use client';

import { ComponentPropsWithoutRef, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    type UseScrollOptions,
} from 'framer-motion';
import { useLanguage } from './data/LanguageProvider';

type AboutProps = ComponentPropsWithoutRef<'section'> & {
    scrollContainerRef?: RefObject<HTMLElement | null>;
};

type SplitRevealProps = {
    text: string;
    direction: 'left' | 'right';
    align?: 'left' | 'center' | 'right';
    activeKey: string;
};

function SplitRevealText({
    text,
    direction,
    align = 'left',
    activeKey,
}: SplitRevealProps) {
    const reduce = useReducedMotion();
    const words = useMemo(() => text.split(' '), [text]);
    const alignClass =
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
    const startX = reduce ? 0 : direction === 'left' ? -64 : 64;

    return (
        <motion.p
            key={activeKey}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: reduce ? 0 : 0.055,
                    },
                },
            }}
            className={`text-balance text-[0.98rem] font-medium leading-7 text-[#B91C1C] drop-shadow-[0_8px_28px_rgba(255,255,255,0.38)] sm:text-[1.08rem] sm:leading-8 lg:text-[1.48rem] lg:leading-[1.78] ${alignClass}`}
        >
            {words.map((word, index) => (
                <motion.span
                    key={`${word}-${index}`}
                    variants={{
                        hidden: {
                            opacity: 0,
                            x: startX,
                            y: reduce ? 0 : 8,
                            filter: reduce ? 'blur(0px)' : 'blur(6px)',
                        },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            filter: 'blur(0px)',
                            transition: {
                                duration: reduce ? 0.18 : 0.42,
                                ease: [0.16, 1, 0.3, 1],
                            },
                        },
                    }}
                    className="inline-block whitespace-nowrap"
                >
                    {word}
                    {index < words.length - 1 ? '\u00A0' : ''}
                </motion.span>
            ))}
        </motion.p>
    );
}

function getSceneIndex(progress: number) {
    if (progress < 1 / 3) return 0;
    if (progress < 2 / 3) return 1;
    return 2;
}

export default function About({
    className,
    id = 'about',
    scrollContainerRef,
    ...sectionProps
}: AboutProps) {
    const { dict } = useLanguage();
    const heading = dict.About.title;
    const reduce = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [hasEnteredView, setHasEnteredView] = useState(false);
    const sectionOffsets: NonNullable<UseScrollOptions['offset']> = ['start start', 'end end'];
    const scrollOptions = scrollContainerRef
        ? {
              container: scrollContainerRef,
              target: sectionRef,
              offset: sectionOffsets,
          }
        : {
              target: sectionRef,
              offset: sectionOffsets,
          };
    const { scrollYProgress } = useScroll(scrollOptions);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1023px)');
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener?.('change', onChange);
        return () => mq.removeEventListener?.('change', onChange);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setHasEnteredView(true);
                }
            },
            {
                root: scrollContainerRef?.current ?? null,
                threshold: 0.2,
            }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, [scrollContainerRef]);

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        const next = getSceneIndex(value);
        setSceneIndex((current) => (current === next ? current : next));
    });

    const sharedTextMaxWidth = isMobile ? 'max-w-[18rem] sm:max-w-[22rem]' : 'max-w-[28rem] xl:max-w-[31rem]';

    return (
        <section
            ref={sectionRef}
            id={id}
            {...sectionProps}
            aria-labelledby={`${id}-title`}
            className={`relative min-h-[300dvh] snap-none${className ? ` ${className}` : ''}`}
        >
            <div className="sticky top-0 h-dvh overflow-hidden">
                <div
                    className="
                        relative h-full w-full px-5
                        pt-14 pb-[calc(var(--nav-bottom-h)+2rem+env(safe-area-inset-bottom))]
                        sm:px-7 sm:pt-16
                        lg:px-10 lg:pt-[calc(var(--nav-top-h)+2.5rem)] lg:pb-12
                    "
                >
                    <div className="pointer-events-none absolute inset-x-0 top-12 lg:top-30 z-20 flex justify-center">
                        <h2
                            id={`${id}-title`}
                            className="text-center text-xl md:2xl lg:text-3xl font-bold uppercase tracking-[0.22em] text-[#B91C1C] "
                        >
                            {heading}
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        {sceneIndex === 0 && hasEnteredView ? (
                            <motion.div
                                key="about-scene-1"
                                initial={{ opacity: 0, y: reduce ? 0 : 26 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduce ? 0 : -24 }}
                                transition={{ duration: reduce ? 0.18 : 0.48, delay: reduce ? 0.08 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                                className={[
                                    'absolute',
                                    isMobile
                                        ? 'inset-x-0 top-46 flex justify-center px-5 sm:top-[14%] sm:px-7'
                                        : 'right-[max(2.5rem,6vw)] top-54',
                                ].join(' ')}
                            >
                                <div className={sharedTextMaxWidth}>
                                    <SplitRevealText
                                        activeKey="about-scene-1-text"
                                        text={dict.About.intro}
                                        direction="right"
                                        align={isMobile ? 'center' : 'right'}
                                    />
                                </div>
                            </motion.div>
                        ) : null}

                        {sceneIndex === 1 ? (
                            <motion.div
                                key="about-scene-2"
                                initial={{ opacity: 0, y: reduce ? 0 : 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reduce ? 0 : -24 }}
                                transition={{ duration: reduce ? 0.18 : 0.48, ease: [0.16, 1, 0.3, 1] }}
                                className={[
                                    'absolute',
                                    isMobile
                                        ? 'inset-x-0 bottom-46 flex justify-center px-5 sm:bottom-[18%] sm:px-7'
                                        : 'bottom-12 left-[max(2.5rem,6vw)]',
                                ].join(' ')}
                            >
                                <div className={sharedTextMaxWidth}>
                                    <SplitRevealText
                                        activeKey="about-scene-2-text"
                                        text={dict.About.blockRight}
                                        direction="right"
                                        align={isMobile ? 'center' : 'left'}
                                    />
                                </div>
                            </motion.div>
                        ) : null}

                        {sceneIndex === 2 ? (
                            <motion.div
                                key="about-scene-3"
                                initial={{ opacity: 0, scale: reduce ? 1 : 0.98, y: reduce ? 0 : 18 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: reduce ? 1 : 0.985, y: reduce ? 0 : -18 }}
                                transition={{ duration: reduce ? 0.18 : 0.48, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0 flex items-center justify-center px-5 sm:px-7 lg:px-10"
                            >
                                <div className={isMobile ? 'max-w-[18rem] sm:max-w-[22rem]' : 'max-w-[31rem]'}>
                                    <SplitRevealText
                                        activeKey="about-scene-3-text"
                                        text={dict.About.blockLeft}
                                        direction="left"
                                        align="center"
                                    />
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
