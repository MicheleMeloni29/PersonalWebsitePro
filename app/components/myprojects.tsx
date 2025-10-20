'use client';

import { ComponentPropsWithoutRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaTimes, FaPlay } from 'react-icons/fa';
import { motion, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { projects, Project } from './data/projectsStructure';

type ProjectsProps = ComponentPropsWithoutRef<'section'>;

const PROJECT_DRAG_THRESHOLD = 90;
const MEDIA_DRAG_THRESHOLD = 50;

/* ============================
   Testo autoscroll + no scrollbar
============================ */
function AutoscrollText({
    text,
    className,
    speed = 12, // px/sec
    restartDelay = 2800,
    interactionDelay = 1800,
    startDelay = 1000,
    restartKey,
}: {
    text: string;
    className?: string;
    speed?: number;
    restartDelay?: number;
    interactionDelay?: number;
    startDelay?: number;
    restartKey?: string | number;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const frameRef = useRef<number>(0);
    const targetRef = useRef(0);
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    const lastRef = useRef(now);
    const [paused, setPaused] = useState(false);
    const pausedRef = useRef(paused);
    const [inView, setInView] = useState(true);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const scheduleRestart = useCallback((delayBeforeReset: number, delayBeforeScroll: number = startDelay) => {
        clearTimer();
        pausedRef.current = true;
        setPaused(true);

        const finishPause = () => {
            timerRef.current = window.setTimeout(() => {
                pausedRef.current = false;
                setPaused(false);
                lastRef.current = typeof performance !== 'undefined' ? performance.now() : 0;
                timerRef.current = null;
            }, Math.max(delayBeforeScroll, 0));
        };

        const resetToTop = () => {
            const node = ref.current;
            if (!node) return;
            node.scrollTop = 0;
            targetRef.current = 0;
            lastRef.current = typeof performance !== 'undefined' ? performance.now() : 0;
            finishPause();
        };

        if (delayBeforeReset <= 0) {
            resetToTop();
        } else {
            timerRef.current = window.setTimeout(() => {
                resetToTop();
            }, delayBeforeReset);
        }
    }, [clearTimer, startDelay]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const on = () => setReduced(mq.matches);
        on(); mq.addEventListener?.('change', on);
        return () => mq.removeEventListener?.('change', on);
    }, []);

    useEffect(() => {
        const el = ref.current; if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.25),
            { threshold: [0.25] }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.scrollTop = 0;
        targetRef.current = 0;
        scheduleRestart(0);
    }, [scheduleRestart, text, restartKey]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        targetRef.current = el.scrollTop;
        lastRef.current = typeof performance !== 'undefined' ? performance.now() : 0;

        const pauseWithRestart = (delay: number) => {
            scheduleRestart(delay);
        };

        const handleInteractionPause = () => pauseWithRestart(interactionDelay);
        const handlePointerDown = () => pauseWithRestart(interactionDelay);
        const handleMouseEnter = () => {
            pausedRef.current = true;
            setPaused(true);
            clearTimer();
        };
        const handleMouseLeave = () => {
            pausedRef.current = false;
            setPaused(false);
            lastRef.current = typeof performance !== 'undefined' ? performance.now() : 0;
        };

        el.addEventListener('wheel', handleInteractionPause, { passive: true });
        el.addEventListener('touchstart', handleInteractionPause, { passive: true });
        el.addEventListener('pointerdown', handlePointerDown);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);

        const step = (t: number) => {
            const node = ref.current;
            if (!node) return;

            if (pausedRef.current || reduced || !inView) {
                lastRef.current = t;
            } else {
                const dt = (t - lastRef.current) / 1000;
                lastRef.current = t;
                targetRef.current += speed * dt;

                const maxTop = Math.max(0, node.scrollHeight - node.clientHeight);
                if (targetRef.current >= maxTop) {
                    targetRef.current = maxTop;
                    node.scrollTop = targetRef.current;
                    if (!pausedRef.current) {
                        pauseWithRestart(restartDelay);
                    }
                } else {
                    node.scrollTop = targetRef.current;
                }
            }

            frameRef.current = requestAnimationFrame(step);
        };

        frameRef.current = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(frameRef.current);
            clearTimer();
            el.removeEventListener('wheel', handleInteractionPause);
            el.removeEventListener('touchstart', handleInteractionPause);
            el.removeEventListener('pointerdown', handlePointerDown);
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [clearTimer, interactionDelay, inView, reduced, restartDelay, scheduleRestart, speed]);

    return (
        <div className="relative w-full">
            <div
                ref={ref}
                className={`no-scrollbar pr-2 ${className ?? ''}`}
                style={{ overflow: 'auto', scrollbarGutter: 'stable' as any }}
            >
                {text}
            </div>
            {/* maschere soft */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#0d0d0d] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        </div>
    );
}


export default function Projects({ className, id = 'projects', ...sectionProps }: ProjectsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [focusToken, setFocusToken] = useState(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const totalProjects = projects.length;
    const currentProject = totalProjects ? projects[currentIndex] : null;

    const goToProject = (targetIndex: number) => {
        if (!totalProjects) return;
        const normalized = ((targetIndex % totalProjects) + totalProjects) % totalProjects;
        setImageIndex(0);
        setLightboxIndex(null);
        setCurrentIndex(normalized);
        setFocusToken((prev) => prev + 1);
    };

    const handleNextProject = () => goToProject(currentIndex + 1);
    const handlePrevProject = () => goToProject(currentIndex - 1);

    const handleProjectDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) < PROJECT_DRAG_THRESHOLD) return;
        info.offset.x < 0 ? handleNextProject() : handlePrevProject();
    };

    const mediaList = currentProject?.images ?? [];
    const handleImageSwipe = (direction: 'left' | 'right') => {
        const media = mediaList;
        if (!media.length) return;
        if (direction === 'left') setImageIndex((p) => (p + 1) % media.length);
        else setImageIndex((p) => (p === 0 ? media.length - 1 : p - 1));
        setLightboxIndex(null);
    };

    const openLightbox = (targetIndex: number) => setLightboxIndex(targetIndex);
    const closeLightbox = () => setLightboxIndex(null);
    const stepLightbox = (direction: 1 | -1) => {
        setLightboxIndex((prev) => {
            if (prev === null) return prev;
            const total = currentProject?.images.length ?? 0;
            if (!total) return null;
            return (prev + direction + total) % total;
        });
    };

    useEffect(() => setLightboxIndex(null), [currentIndex]);

    useEffect(() => {
        if (lightboxIndex === null) {
            document.body.style.overflow = '';
            return;
        }
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeLightbox();
            else if (event.key === 'ArrowRight') stepLightbox(1);
            else if (event.key === 'ArrowLeft') stepLightbox(-1);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, currentIndex]);

    const activeLightboxItem = lightboxIndex !== null ? mediaList[lightboxIndex] : null;
    let lightboxType: 'image' | 'video' | null = null;
    let lightboxSrc = '';
    if (activeLightboxItem) {
        if (typeof activeLightboxItem === 'string') {
            lightboxType = 'image';
            lightboxSrc = activeLightboxItem;
        } else {
            lightboxType = activeLightboxItem.type ?? 'image';
            lightboxSrc = activeLightboxItem.src;
        }
    }
    const normalizedLightboxSrc = lightboxSrc && !lightboxSrc.startsWith('/') ? `/${lightboxSrc}` : lightboxSrc;

    const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
    const nextIndex = (currentIndex + 1) % totalProjects;
    const prevProject = totalProjects > 1 ? projects[prevIndex] : null;
    const nextProject = totalProjects > 1 ? projects[nextIndex] : null;

    const baseClasses =
        'min-h-screen w-full flex flex-col items-center gap-4 px-4 sm:px-6 lg:px-8 pt-24 pb-14 sm:pt-28 sm:pb-14';

    // Testo: usa full -> fallback a short
    const getFullText = (p?: Project) => p?.full ?? p?.short ?? '';

    /* ============ MEDIA (centrale e preview) ============ */
    const renderMediaCarousel = (project: Project, isActive: boolean) => {
        const media = project.images ?? [];
        const canInteract = isActive;

        if (!media.length) {
            return (
                <div className="flex items-center justify-center h-48 sm:h-56 md:h-60 lg:h-64 w-full rounded-xl border border-white/10 bg-black/40 text-white/60">
                    No media
                </div>
            );
        }

        return (
            <div className="w-full flex flex-col items-center gap-2">
                <motion.div
                    className={`relative w-full max-w-md sm:max-w-lg lg:max-w-xl overflow-hidden${canInteract ? ' cursor-grab active:cursor-grabbing' : ''
                        }`}
                    drag={canInteract ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={
                        canInteract
                            ? (_: MouseEvent | TouchEvent, info: PanInfo) => {
                                if (Math.abs(info.offset.x) > MEDIA_DRAG_THRESHOLD) {
                                    info.offset.x > 0 ? handleImageSwipe('right') : handleImageSwipe('left');
                                }
                            }
                            : undefined
                    }
                    whileTap={canInteract ? { cursor: 'grabbing' } : undefined}
                    onWheel={(e) => {
                        if (!canInteract) return;
                        if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;
                        e.preventDefault();
                        (e.deltaY > 0 || e.deltaX > 0) ? handleImageSwipe('left') : handleImageSwipe('right');
                    }}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Project media"
                >
                    <div className="flex items-center justify-center relative h-48 sm:h-56 md:h-60 lg:h-64 w-full overflow-hidden">
                        {media.map((m, idx) => {
                            const total = media.length;
                            const rel = (idx - imageIndex + total) % total;
                            if (rel !== 0 && rel !== 1 && rel !== total - 1) return null;

                            let type: 'image' | 'video' = 'image';
                            let mediaSrc = '';
                            if (typeof m === 'string') mediaSrc = m;
                            else if (m && typeof m === 'object') {
                                mediaSrc = m.src;
                                type = m.type ?? 'image';
                            }
                            const normalizedSrc = mediaSrc.startsWith('/') ? mediaSrc : `/${mediaSrc}`;
                            const isCurrent = rel === 0;
                            // un filo più distanti tra loro
                            const x = rel === 0 ? '0%' : rel === 1 ? '98%' : '-98%';
                            const zIndex = rel === 0 ? 10 : 5;

                            return (
                                <motion.div
                                    key={`${project.title}-${idx}`}
                                    className="absolute flex items-center justify-center"
                                    animate={{ x, scale: 1, opacity: 1, zIndex }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                >
                                    {type === 'image' ? (
                                        <div className="relative flex items-center justify-center w-full h-full px-3">
                                            <Image
                                                src={normalizedSrc}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                width={360}
                                                height={260}
                                                className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg object-contain"
                                                style={{
                                                    maxWidth: isMobile ? '55%' : '100px',
                                                    maxHeight: '84%',
                                                    width: 'auto',
                                                    height: 'auto',
                                                }}
                                                sizes="(max-width: 640px) 55vw, 220px"
                                                priority={isCurrent}
                                                quality={90}
                                            />
                                            {canInteract && isCurrent && (
                                                <button
                                                    type="button"
                                                    onClick={() => openLightbox(idx)}
                                                    className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                                    aria-label="Expand image"
                                                >
                                                    <FaSearchPlus className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative flex items-center justify-center w-full h-full px-3">
                                            <video
                                                src={normalizedSrc}
                                                className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg max-w-full max-h-full object-contain"
                                                style={{
                                                    maxWidth: isMobile ? '55%' : '120px',
                                                    maxHeight: '84%',
                                                    width: 'auto',
                                                    height: 'auto',
                                                }}
                                                autoPlay={isCurrent && canInteract}
                                                muted
                                                loop
                                                playsInline
                                                controls={isCurrent && canInteract}
                                            />
                                            {canInteract && isCurrent && (
                                                <button
                                                    type="button"
                                                    onClick={() => openLightbox(idx)}
                                                    className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                                    aria-label="Expand video"
                                                >
                                                    <FaSearchPlus className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* indicatore posizione (no thumbnails) */}
                {media.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                        {media.map((_, idx) => (
                            <span
                                key={idx}
                                className={`block rounded-full transition-all ${idx === imageIndex ? 'w-3 h-1.5 bg-red-500' : 'w-1.5 h-1.5 bg-white/40'
                                    }`}
                                aria-hidden
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    /* ============ CARD CONTENT ============ */
    const renderCardContent = (project: Project, isActive: boolean, activeKey?: string) => {
        const full = getFullText(project);

        return (
            <div className="flex flex-col items-center w-full max-w-3xl text-center gap-3 h-full">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mb-1">{project.title}</h3>

                {/* Testo: centrale = autoscroll, preview = statico con fade */}
                {isActive ? (
                    <AutoscrollText
                        text={getFullText(project)}
                        className="text-sm sm:text-base text-red-700 h-28 sm:h-32 md:h-36"
                        speed={24}
                        startDelay={1800}
                        restartKey={activeKey}
                    />
                ) : (
                    <div className="relative w-full">
                        <div className="text-sm sm:text-base text-red-700 h-24 sm:h-28 md:h-28 overflow-hidden pr-2">
                            {getFullText(project)}
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
                    </div>
                )}


                <div className="w-full flex-1 flex flex-col items-center gap-3 justify-center">
                    {renderMediaCarousel(project, isActive)}
                </div>
            </div>
        );
    };

    /* ============ PREVIEW LATERALI ============ */
    const renderPreviewCard = (project: Project | null, position: 'left' | 'right', targetIndex: number) => {
        if (!project) return null;
        const offset = 560; // distanza orizzontale dal centro; aumenta se vuoi più stacco
        const x = position === 'left' ? -offset : offset;

        return (
            <motion.button
                key={`${project.title}-${position}`}
                type="button"
                onClick={() => goToProject(targetIndex)}
                className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]"
                initial={{ x, opacity: 0.95, scale: 0.98 }}
                animate={{ x, opacity: 0.95, scale: 0.98 }}
                whileHover={{ scale: 1.0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                aria-label={position === 'left' ? 'Previous project' : 'Next project'}
            >
                <div className="pointer-events-none">
                    <div
                        className="w-[300px] lg:w-[360px] max-h-[62vh] bg-[#5e5e5e99] dark:bg-[#00000080] p-4 rounded-2xl border border-white/10
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_4px_6px_rgba(0,0,0,0.45),_0_10px_15px_rgba(0,0,0,0.28)]
                     backdrop-blur-sm overflow-hidden"
                    >
                        {renderCardContent(project, false)}
                    </div>
                </div>
            </motion.button>
        );
    };



    const totalLightboxItems = mediaList.length;

    return (
        <section
            id={id}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
            aria-labelledby="projects-title"
        >
            <h2
                id="projects-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-red-800 text-center"
            >
                My Projects
            </h2>

            <div className="flex-1 w-full flex items-center justify-center">
                <div className="relative w-full max-w-7xl flex items-center justify-center h-full">
                    {/* ⬆️ più largo per dare respiro ai preview */}
                    <div className="relative w-full max-w-6xl mx-auto h-full flex justify-center overflow-visible">
                        {renderPreviewCard(prevProject, 'left', prevIndex)}
                        {renderPreviewCard(nextProject, 'right', nextIndex)}

                        {/* scheda centrale */}
                        <motion.div
                            className="relative z-10 w-full md:w-[86%] lg:w-[78%] h-full max-h-[75vh] sm:max-h-[75vh] flex flex-col items-center justify-between
              bg-[#5e5e5ec5] dark:bg-[#000000b9] p-4 sm:p-6 lg:p-7 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing
              shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_6px_rgba(0,0,0,0.6),_0_10px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-shadow duration-500"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0}
                            dragMomentum={false}
                            onDragEnd={handleProjectDragEnd}
                            whileTap={{ cursor: 'grabbing' }}
                            role="region"
                            aria-roledescription="carousel"
                            aria-label="Projects carousel"
                        >
                            {currentProject ? (
                                renderCardContent(currentProject, true, `${focusToken}-${currentProject.title}`)
                            ) : (
                                <div className="flex h-full items-center justify-center text-center text-lg text-red-800">
                                    No projects available
                                </div>
                            )}

                            {/* frecce progetto per mobile */}
                            <div className="sm:hidden absolute inset-0 pointer-events-none">
                                <div className="absolute inset-y-0 left-2 flex items-center">
                                    <button
                                        type="button"
                                        onClick={handlePrevProject}
                                        className="pointer-events-auto rounded-full bg-black/50 p-2 text-white"
                                        aria-label="Previous project"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                </div>
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                    <button
                                        type="button"
                                        onClick={handleNextProject}
                                        className="pointer-events-auto rounded-full bg-black/50 p-2 text-white"
                                        aria-label="Next project"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX */}
            {lightboxIndex !== null && activeLightboxItem && normalizedLightboxSrc && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
                    <div className="absolute inset-0 bg-black/70" onClick={closeLightbox} aria-hidden />
                    <div
                        className="relative z-10 w-full max-w-5xl text-white"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Media viewer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-semibold">{currentProject?.title ?? ''}</h3>
                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="rounded-full bg-black/60 p-2 hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                aria-label="Close media viewer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="relative bg-black/80 rounded-2xl p-4 flex items-center justify-center shadow-2xl">
                            {totalLightboxItems > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => stepLightbox(-1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        aria-label="Previous media"
                                    >
                                        <FaChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => stepLightbox(1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        aria-label="Next media"
                                    >
                                        <FaChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}

                            {lightboxType === 'image' && (
                                <Image
                                    src={normalizedLightboxSrc}
                                    alt={`${currentProject?.title ?? 'Project'} enlarged`}
                                    width={1200}
                                    height={800}
                                    className="max-h-[75vh] w-auto rounded-xl object-contain"
                                    sizes="(max-width: 1024px) 90vw, 70vw"
                                    priority
                                />
                            )}
                            {lightboxType === 'video' && (
                                <video
                                    src={normalizedLightboxSrc}
                                    className="max-h-[75vh] w-full rounded-xl bg-black"
                                    controls
                                    autoPlay
                                    loop
                                />
                            )}
                        </div>

                        {totalLightboxItems > 1 && (
                            <>
                                <div className="mt-4 flex justify-center gap-2">
                                    {mediaList.map((_, idx) => {
                                        const active = idx === lightboxIndex;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setLightboxIndex(idx)}
                                                className={`h-2 rounded-full transition-all ${active ? 'w-6 bg-red-500' : 'w-2 bg-white/40 hover:bg-white/70'
                                                    }`}
                                                aria-label={`Show media ${idx + 1}`}
                                            />
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-center text-sm text-white/70">
                                    {lightboxIndex + 1} / {totalLightboxItems}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* utilità globale per nascondere le scrollbar, se non l’hai già */}
            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
}
