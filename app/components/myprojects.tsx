// This file contains the "Projects" section with an initial rotating carousel
// that gives way to a static grid while the user scrolls through the section.
'use client';

import {
    ComponentPropsWithoutRef,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { Project } from './data/projectsStructure';
import { useLanguage } from './data/LanguageProvider';
import ProjectCard from './UI/project-card';
import ProjectInfoPanel from './UI/project-info-panel';

type ProjectsProps = ComponentPropsWithoutRef<'section'>;

export default function Projects({ className, id = 'projects', ...sectionProps }: ProjectsProps) {
    const { t, dict } = useLanguage();
    const projects = dict.Projects.items as Project[];
    const total = projects.length;
    const angleStep = total ? 360 / total : 0;
    const sectionRef = useRef<HTMLElement | null>(null);

    const [flipped, setFlipped] = useState<boolean[]>(() => projects.map(() => false));
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [detailMediaIndex, setDetailMediaIndex] = useState(0);
    const [gridReveal, setGridReveal] = useState(0);

    useEffect(() => {
        setFlipped(projects.map(() => false));
        setSelectedProjectIndex(null);
        setDetailMediaIndex(0);
    }, [projects]);

    const toggleFlip = (index: number) => {
        setFlipped((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const openInfo = (index: number) => {
        setSelectedProjectIndex(index);
        setDetailMediaIndex(0);
    };

    const closeInfo = () => {
        setSelectedProjectIndex(null);
        setDetailMediaIndex(0);
    };

    const selectedProject =
        selectedProjectIndex !== null ? projects[selectedProjectIndex] ?? null : null;

    const ringCards = useMemo(
        () =>
            projects.map((project, index) => ({
                project,
                index,
                angle: angleStep * index,
            })),
        [projects, angleStep]
    );

    useEffect(() => {
        let frame = 0;

        const updateReveal = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewport = window.innerHeight;
            const start = viewport * 0.08;
            const end = viewport * 0.72;
            const nextReveal = Math.min(1, Math.max(0, (start - rect.top) / (end - start)));

            setGridReveal((prev) => (Math.abs(prev - nextReveal) > 0.01 ? nextReveal : prev));
        };

        const queueUpdate = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                updateReveal();
            });
        };

        updateReveal();
        window.addEventListener('scroll', queueUpdate, { passive: true });
        window.addEventListener('resize', queueUpdate);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', queueUpdate);
            window.removeEventListener('resize', queueUpdate);
        };
    }, []);

    const anyFlipped = flipped.some(Boolean);
    const isRotationPaused = anyFlipped || gridReveal > 0.18 || selectedProjectIndex !== null;
    const carouselOpacity = 1 - Math.min(1, gridReveal * 1.35);
    const gridOpacity = Math.min(1, Math.max(0, (gridReveal - 0.18) / 0.62));
    const gridTranslateY = 48 - gridOpacity * 48;

    const nextDetailMedia = () => {
        if (!selectedProject) return;
        const totalMedia = selectedProject.images.length;
        if (totalMedia <= 1) return;
        setDetailMediaIndex((prev) => (prev + 1) % totalMedia);
    };

    const previousDetailMedia = () => {
        if (!selectedProject) return;
        const totalMedia = selectedProject.images.length;
        if (totalMedia <= 1) return;
        setDetailMediaIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
    };

    return (
        <section
            ref={sectionRef}
            id={id}
            {...sectionProps}
            className={`relative w-full bg-[#0d0d0d] text-white${className ? ` ${className}` : ''}`}
            aria-labelledby="projects-title"
        >
            <div className="sticky top-0 z-0 flex min-h-screen items-center justify-center px-6 pt-24 pb-10">
                <div
                    className="w-full max-w-6xl transition-[opacity,transform] duration-300 ease-out"
                    style={{
                        opacity: carouselOpacity,
                        transform: `translateY(${-gridReveal * 28}px) scale(${1 - gridReveal * 0.05})`,
                        pointerEvents: gridReveal > 0.78 ? 'none' : 'auto',
                    }}
                >
                    <h2
                        id="projects-title"
                        className="text-center text-2xl font-bold tracking-[0.03em] text-red-600 sm:text-3xl md:text-4xl"
                    >
                        {t('Projects', 'title')}
                    </h2>

                    <div className="ring-scene relative mt-5 h-[18.5rem] w-full [perspective:1200px]">
                        <div
                            className="relative h-full w-full [transform-style:preserve-3d] animate-[ringSpin_26s_linear_infinite] will-change-transform hover:[animation-play-state:paused]"
                            aria-label={t('Projects', 'carouselLabel')}
                            style={isRotationPaused ? { animationPlayState: 'paused' } : undefined}
                        >
                            {ringCards.map(({ project, index, angle }) => (
                                <ProjectCard
                                    key={`carousel-${project.title}-${index}`}
                                    project={project}
                                    index={index}
                                    angle={angle}
                                    isFlipped={flipped[index] ?? false}
                                    layout="carousel"
                                    onToggleFlip={toggleFlip}
                                    onOpenInfo={openInfo}
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 h-[42vh]" aria-hidden />

            <div
                className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 transition-[opacity,transform] duration-300 ease-out"
                style={{
                    opacity: gridOpacity,
                    transform: `translateY(${gridTranslateY}px)`,
                }}
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={`grid-${project.title}-${index}`}
                            project={project}
                            index={index}
                            isFlipped={flipped[index] ?? false}
                            layout="grid"
                            onToggleFlip={toggleFlip}
                            onOpenInfo={openInfo}
                            t={t}
                        />
                    ))}
                </div>
            </div>

            <ProjectInfoPanel
                project={selectedProject}
                activeMediaIndex={detailMediaIndex}
                onClose={closeInfo}
                onNextMedia={nextDetailMedia}
                onPreviousMedia={previousDetailMedia}
                t={t}
            />

            <style jsx global>{`
                .ring-scene {
                    --ring-radius: clamp(205px, 33vw, 365px);
                    --card-width: clamp(150px, 32vw, 210px);
                    --card-height: clamp(246px, 48vw, 310px);
                    --card-scale: 1;
                }

                @keyframes ringSpin {
                    from {
                        transform: rotateY(0deg);
                    }
                    to {
                        transform: rotateY(360deg);
                    }
                }

                @media (max-width: 820px) {
                    .ring-scene {
                        height: 19.5rem;
                        --ring-radius: clamp(205px, 48vw, 315px);
                        --card-width: clamp(142px, 34vw, 184px);
                        --card-height: clamp(238px, 58vw, 278px);
                        --card-scale: 0.93;
                    }
                }

                @media (max-width: 560px) {
                    .ring-scene {
                        height: 17.5rem;
                        --ring-radius: clamp(170px, 56vw, 250px);
                        --card-width: clamp(126px, 42vw, 156px);
                        --card-height: clamp(216px, 70vw, 246px);
                        --card-scale: 0.9;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-\\[ringSpin_26s_linear_infinite\\] {
                        animation: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
