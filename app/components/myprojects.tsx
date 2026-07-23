'use client';

import {
    ComponentPropsWithoutRef,
    RefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    type UseScrollOptions,
} from 'framer-motion';
import type { Project } from './data/projectsStructure';
import { useLanguage } from './data/LanguageProvider';
import ProjectCard from './UI/project-card';
import ProjectInfoPanel from './UI/project-info-panel';

type ProjectsProps = ComponentPropsWithoutRef<'section'> & {
    scrollContainerRef?: RefObject<HTMLElement | null>;
};

const PROJECT_STAGES = 4;

function getProjectStage(progress: number) {
    if (progress < 0.25) return 0;
    if (progress < 0.5) return 1;
    if (progress < 0.75) return 2;
    return 3;
}

export default function Projects({
    className,
    id = 'projects',
    scrollContainerRef,
    ...sectionProps
}: ProjectsProps) {
    const { t, dict } = useLanguage();
    const projects = dict.Projects.items as Project[];
    const total = projects.length;
    const angleStep = total ? 360 / total : 0;
    const sectionRef = useRef<HTMLElement | null>(null);
    const ringRef = useRef<HTMLDivElement | null>(null);
    const rotationRef = useRef(0);
    const lastFrameRef = useRef<number | null>(null);
    const reduceMotion = useReducedMotion();

    const [flipped, setFlipped] = useState<boolean[]>(() => projects.map(() => false));
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [detailMediaIndex, setDetailMediaIndex] = useState(0);
    const [projectStage, setProjectStage] = useState(0);
    const [isFinalStageLocked, setIsFinalStageLocked] = useState(false);
    const [isHoverPaused, setIsHoverPaused] = useState(false);

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

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        const nextStage = getProjectStage(value);
        if (isFinalStageLocked) return;
        if (nextStage === PROJECT_STAGES - 1) {
            setProjectStage(PROJECT_STAGES - 1);
            setIsFinalStageLocked(true);
            return;
        }
        setProjectStage((current) => (current === nextStage ? current : nextStage));
    });

    useEffect(() => {
        setFlipped(projects.map(() => false));
        setSelectedProjectIndex(null);
        setDetailMediaIndex(0);
        setProjectStage(0);
        setIsFinalStageLocked(false);
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

    const anyFlipped = flipped.some(Boolean);
    const isFinalStage = projectStage === PROJECT_STAGES - 1;
    const stageRotationDuration = reduceMotion
        ? 0
        : [50, 20, 6, 6][projectStage] ?? 50;
    const isRotationPaused =
        reduceMotion ||
        anyFlipped ||
        selectedProjectIndex !== null ||
        projectStage === PROJECT_STAGES - 1 ||
        isHoverPaused;
    const carouselOpacity = [1, 1, 1, 0][projectStage] ?? 1;
    const carouselScale = [1, 1.1, 1.2, 1.2][projectStage] ?? 1;
    const carouselTranslateY = [112, 112, 112, 70][projectStage] ?? 112;
    const gridOpacity = isFinalStage ? 1 : 0;
    const gridTranslateY = isFinalStage ? 0 : 44;

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

    useEffect(() => {
        const ringNode = ringRef.current;
        if (!ringNode) return;
        let frameId = 0;

        const step = (timestamp: number) => {
            if (lastFrameRef.current === null) {
                lastFrameRef.current = timestamp;
            }

            const deltaSeconds = (timestamp - lastFrameRef.current) / 1000;
            lastFrameRef.current = timestamp;

            if (!isRotationPaused && stageRotationDuration > 0) {
                rotationRef.current = (rotationRef.current + (360 / stageRotationDuration) * deltaSeconds) % 360;
                ringNode.style.transform = `rotateY(${rotationRef.current}deg)`;
            }

            frameId = window.requestAnimationFrame(step);
        };

        frameId = window.requestAnimationFrame(step);
        return () => {
            window.cancelAnimationFrame(frameId);
            lastFrameRef.current = null;
        };
    }, [isRotationPaused, stageRotationDuration]);

    return (
        <section
            ref={sectionRef}
            id={id}
            {...sectionProps}
            className={`relative min-h-[400dvh] snap-none text-white${className ? ` ${className}` : ''}`}
            aria-labelledby="projects-title"
        >
            <div className="sticky top-0 flex min-h-screen items-center justify-center px-6 py-0">
                <div className="projects-stage-shell relative min-h-screen w-full max-w-6xl">
                    <div className="pointer-events-none absolute inset-x-0 top-12 z-10 flex justify-center lg:top-30">
                        <h2
                            id="projects-title"
                            className="text-center text-xl font-bold uppercase tracking-[0.22em] text-[#B91C1C] md:text-2xl lg:text-3xl"
                        >
                            {t('Projects', 'title')}
                        </h2>
                    </div>

                    <div className="flex min-h-screen items-center justify-center">
                        <div className="relative mt-20 h-[calc(100vh-8rem)] min-h-[38rem] w-full sm:mt-24 sm:h-[calc(100vh-9rem)] sm:min-h-[42rem]">
                        <div
                            className="relative z-20 transition-[opacity,transform] duration-500 ease-out"
                            style={{
                                opacity: carouselOpacity,
                                transform: `translateY(${carouselTranslateY}px) scale(${carouselScale})`,
                                pointerEvents: projectStage === PROJECT_STAGES - 1 ? 'none' : 'auto',
                            }}
                        >
                            <div className="ring-scene relative h-[18.5rem] w-full [perspective:1200px] sm:h-[21rem]">
                                <div
                                    ref={ringRef}
                                    className="relative h-full w-full pointer-events-auto [transform-style:preserve-3d] will-change-transform"
                                    aria-label={t('Projects', 'carouselLabel')}
                                    onMouseEnter={() => setIsHoverPaused(true)}
                                    onMouseLeave={() => setIsHoverPaused(false)}
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

                        <div
                            data-projects-grid="true"
                            className="absolute inset-0 z-10 overflow-y-auto overscroll-contain no-scrollbar pr-1 transition-[opacity,transform] duration-500 ease-out lg:pt-24"
                            style={{
                                opacity: gridOpacity,
                                transform: `translateY(${gridTranslateY}px)`,
                                pointerEvents: projectStage === PROJECT_STAGES - 1 ? 'auto' : 'none',
                            }}
                        >
                            <div className="grid grid-cols-1 gap-5 pb-2 md:grid-cols-2 lg:grid-cols-3">
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
                        </div>
                    </div>
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
                .projects-stage-shell {
                    --ring-radius: clamp(236px, 78vw, 344px);
                    --card-width: clamp(164px, 56vw, 204px);
                    --card-height: clamp(278px, 94vw, 326px);
                    --card-scale: 0.985;
                }

                @media (min-width: 561px) {
                    .projects-stage-shell {
                        --ring-radius: clamp(264px, 60vw, 382px);
                        --card-width: clamp(142px, 34vw, 184px);
                        --card-height: clamp(238px, 58vw, 278px);
                        --card-scale: 0.93;
                    }
                }

                @media (min-width: 821px) {
                    .projects-stage-shell {
                        --ring-radius: clamp(252px, 42vw, 430px);
                        --card-width: clamp(150px, 32vw, 210px);
                        --card-height: clamp(246px, 48vw, 310px);
                        --card-scale: 1;
                    }
                }

            `}</style>
        </section>
    );
}
