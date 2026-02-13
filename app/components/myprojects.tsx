'use client';

import { ComponentPropsWithoutRef, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGithub, FaPlay } from 'react-icons/fa';
import { projects, Project } from './data/projectsStructure';

type ProjectsProps = ComponentPropsWithoutRef<'section'>;

type MediaItem = {
    type: 'image' | 'video';
    src: string;
};

const normalizeMedia = (item: string | { type?: 'image' | 'video'; src: string }): MediaItem => {
    if (typeof item === 'string') return { type: 'image', src: item };
    return { type: item.type ?? 'image', src: item.src };
};

const getPrimaryLink = (project: Project) => {
    const links = project.links ?? [];
    if (!links.length) return null;
    const demo = links.find(
        (link) =>
            /demo/i.test(link.label) ||
            /demo/i.test(link.url) ||
            /youtu(\.be|be\.com)/i.test(link.url)
    );
    return demo ?? links[0] ?? null;
};

const getLinkIcon = (url: string) => {
    if (/youtu(\.be|be\.com)/i.test(url)) return <FaPlay className="h-3.5 w-3.5" />;
    if (/github\.com/i.test(url)) return <FaGithub className="h-3.5 w-3.5" />;
    return <FaExternalLinkAlt className="h-3.5 w-3.5" />;
};

export default function Projects({ className, id = 'projects', ...sectionProps }: ProjectsProps) {
    const total = projects.length;
    const angleStep = total ? 360 / total : 0;

    const [flipped, setFlipped] = useState<boolean[]>(() => projects.map(() => false));
    const [mediaIndex, setMediaIndex] = useState<number[]>(() => projects.map(() => 0));
    const [interactionPaused, setInteractionPaused] = useState(false);
    const [manualPaused, setManualPaused] = useState(false);
    const tapTimeoutRef = useRef<number[]>([]);
    const lastTapRef = useRef<number[]>([]);

    useEffect(() => {
        setFlipped(projects.map(() => false));
        setMediaIndex(projects.map(() => 0));
    }, [total]);

    const toggleFlip = (index: number) => {
        setFlipped((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const moveMedia = (index: number, direction: 'prev' | 'next') => {
        setMediaIndex((prev) => {
            const media = projects[index]?.images ?? [];
            if (!media.length) return prev;
            const next = [...prev];
            const current = prev[index] ?? 0;
            next[index] = direction === 'next'
                ? (current + 1) % media.length
                : (current - 1 + media.length) % media.length;
            return next;
        });
    };

    const ringCards = useMemo(
        () =>
            projects.map((project, index) => ({
                project,
                index,
                angle: angleStep * index,
            })),
        [angleStep]
    );

    const anyFlipped = flipped.some(Boolean);
    const isRotationPaused = interactionPaused || anyFlipped || manualPaused;

    const handleFrontTap = (index: number) => {
        const now = Date.now();
        const lastTap = lastTapRef.current[index] ?? 0;
        const threshold = 260;

        if (now - lastTap < threshold) {
            if (tapTimeoutRef.current[index]) {
                window.clearTimeout(tapTimeoutRef.current[index]);
            }
            lastTapRef.current[index] = 0;
            toggleFlip(index);
            return;
        }

        lastTapRef.current[index] = now;
        if (tapTimeoutRef.current[index]) {
            window.clearTimeout(tapTimeoutRef.current[index]);
        }
        tapTimeoutRef.current[index] = window.setTimeout(() => {
            setManualPaused((prev) => !prev);
            lastTapRef.current[index] = 0;
        }, threshold);
    };

    return (
        <section
            id={id}
            {...sectionProps}
            className={`min-h-screen w-full px-6 pt-24 pb-16 flex flex-col items-center gap-10 bg-[#0d0d0d] text-white${className ? ` ${className}` : ''
                }`}
            aria-labelledby="projects-title"
        >
            <h2
                id="projects-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 tracking-[0.03em]"
            >
                My Projects
            </h2>

            <div className="ring-scene relative w-full max-w-6xl h-[25rem] mt-6 [perspective:1200px]">
                <div
                    className="relative w-full h-full [transform-style:preserve-3d] animate-[ringSpin_26s_linear_infinite] will-change-transform hover:[animation-play-state:paused]"
                    aria-label="Projects carousel"
                    style={isRotationPaused ? { animationPlayState: 'paused' } : undefined}
                    onPointerDown={() => setInteractionPaused(true)}
                    onPointerUp={() => setInteractionPaused(false)}
                    onPointerCancel={() => setInteractionPaused(false)}
                    onPointerLeave={() => setInteractionPaused(false)}
                >
                    {ringCards.map(({ project, index, angle }) => {
                        const media = project.images?.map(normalizeMedia) ?? [];
                        const currentMedia = media[mediaIndex[index] ?? 0];
                        const normalizedSrc = currentMedia?.src?.startsWith('/')
                            ? currentMedia.src
                            : currentMedia?.src
                                ? `/${currentMedia.src}`
                                : '';
                        const primaryLink = getPrimaryLink(project);
                        const hasMedia = media.length > 0;
                        const isFlipped = flipped[index];

                        return (
                            <div
                                key={`${project.title}-${index}`}
                                className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                                style={
                                    {
                                        width: 'var(--card-width)',
                                        height: 'var(--card-height)',
                                        transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--ring-radius)) scale(var(--card-scale))`,
                                    } as CSSProperties
                                }
                            >
                                <div
                                    className="relative h-full w-full transition-transform duration-500 ease-in-out cursor-pointer outline-none [transform-style:preserve-3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-4"
                                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                                >
                                    <div
                                        className="absolute inset-0 rounded-2xl border-2 border-red-500/20 bg-black/90 shadow-[0_12px_30px_rgba(0,0,0,0.45)] p-5 flex flex-col gap-4"
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <h3 className="text-lg font-bold text-red-400 text-center">{project.title}</h3>

                                        {hasMedia ? (
                                            <div className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden bg-[#0b0b0b] border border-white/10 flex items-center justify-center">
                                                {currentMedia?.type === 'video' ? (
                                                    <div className="flex items-center justify-center w-full h-full p-2">
                                                        <video
                                                            src={normalizedSrc}
                                                            className="w-full h-full object-contain rounded-xl"
                                                            controls
                                                            muted
                                                            playsInline
                                                            onClick={(event) => event.stopPropagation()}
                                                        />
                                                    </div>
                                                ) : (
                                                    normalizedSrc && (
                                                        <div className="relative w-full h-full p-2">
                                                            <Image
                                                                src={normalizedSrc}
                                                                alt={`${project.title} preview`}
                                                                fill
                                                                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 320px"
                                                                className="object-contain"
                                                                priority={index === 0}
                                                            />
                                                        </div>
                                                    )
                                                )}

                                                {media.length > 1 && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/70 text-white grid place-items-center"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                moveMedia(index, 'prev');
                                                            }}
                                                            aria-label="Previous media"
                                                        >
                                                            <FaChevronLeft />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/70 text-white grid place-items-center"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                moveMedia(index, 'next');
                                                            }}
                                                            aria-label="Next media"
                                                        >
                                                            <FaChevronRight />
                                                        </button>
                                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
                                                            {media.map((_, dotIndex) => (
                                                                <span
                                                                    key={dotIndex}
                                                                    className={`h-1.5 rounded-full transition-all ${dotIndex === (mediaIndex[index] ?? 0)
                                                                            ? 'w-4 bg-red-500'
                                                                            : 'w-1.5 bg-white/40'
                                                                        }`}
                                                                    aria-hidden
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex-1 min-h-0 rounded-2xl border border-dashed border-white/20 text-white/70 flex items-center justify-center">
                                                {primaryLink ? (
                                                    <a
                                                        href={primaryLink.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/60 bg-red-500/10 text-red-100 text-sm"
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        <span className="inline-flex">{getLinkIcon(primaryLink.url)}</span>
                                                        <span>{primaryLink.label}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs uppercase tracking-[0.2em]">No media available</span>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleFrontTap(index)}
                                            className="mt-auto text-center text-[0.5rem] uppercase tracking-[0.18em] text-red-500/80 hover:text-white transition touch-manipulation"
                                            aria-label={`Flip ${project.title}`}
                                        >
                                            One tap to stop, two to flip
                                        </button>
                                    </div>

                                    <div
                                        className="absolute inset-0 rounded-2xl border border-white/10 bg-black/90 shadow-[0_12px_30px_rgba(0,0,0,0.45)] p-5 flex flex-col gap-4"
                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                    >
                                        <div className="flex-1 overflow-auto pr-2">
                                            <p className="text-xs leading-relaxed text-white/75">{project.full}</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleFlip(index)}
                                            className="mt-auto text-center text-xs uppercase tracking-[0.2em] text-red-500/80 hover:text-white transition"
                                            aria-label={`Return to front of ${project.title}`}
                                        >
                                            tap to return
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                .ring-scene {
                    --ring-radius: clamp(140px, 28vw, 320px);
                    --card-width: clamp(180px, 50vw, 250px);
                    --card-height: clamp(270px, 72vw, 355px);
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
                        height: 23.5rem;
                        --ring-radius: clamp(220px, 54vw, 360px);
                        --card-width: clamp(175px, 58vw, 235px);
                        --card-height: clamp(245px, 74vw, 320px);
                        --card-scale: 0.97;
                    }
                }

                @media (max-width: 560px) {
                    .ring-scene {
                        height: 26rem;
                        --ring-radius: clamp(230px, 78vw, 360px);
                        --card-width: clamp(150px, 68vw, 205px);
                        --card-height: clamp(280px, 110vw, 380px);
                        --card-scale: 0.92;
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
