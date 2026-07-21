'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { Project } from '../data/projectsStructure';

type ProjectCardProps = {
    project: Project;
    index: number;
    angle?: number;
    isFlipped: boolean;
    layout: 'carousel' | 'grid';
    onToggleFlip: (index: number) => void;
    onOpenInfo: (index: number) => void;
    t: (ns: 'Projects', key: string, vars?: Record<string, string | number>) => string;
};

const normalizeAssetPath = (src?: string) => {
    if (!src) return '';
    return src.startsWith('/') ? src : `/${src}`;
};

const getPrimaryLink = (project: Project) => {
    const links = project.links ?? [];
    if (!links.length) return null;
    const direct = links.find((link) => !/github/i.test(link.url));
    return direct ?? links[0] ?? null;
};

const getCoverSource = (project: Project) => {
    if (project.coverImage) return normalizeAssetPath(project.coverImage);
    const firstImage = project.images.find((item) => typeof item === 'string');
    if (firstImage) return normalizeAssetPath(firstImage);
    const firstMedia = project.images.find((item) => typeof item !== 'string');
    return typeof firstMedia === 'string' ? normalizeAssetPath(firstMedia) : normalizeAssetPath(firstMedia?.src);
};

const baseFallback =
    'bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.24),transparent_38%),linear-gradient(160deg,rgba(31,31,31,0.98),rgba(9,9,11,0.98))]';

export default function ProjectCard({
    project,
    index,
    angle,
    isFlipped,
    layout,
    onToggleFlip,
    onOpenInfo,
    t,
}: ProjectCardProps) {
    const coverSrc = getCoverSource(project);
    const primaryLink = getPrimaryLink(project);
    const wrapperClassName =
        layout === 'carousel'
            ? 'absolute top-1/2 left-1/2 [transform-style:preserve-3d]'
            : 'relative h-[24rem] w-full [transform-style:preserve-3d]';
    const wrapperStyle =
        layout === 'carousel'
            ? ({
                width: 'var(--card-width)',
                height: 'var(--card-height)',
                transform: `translate(-50%, -50%) rotateY(${angle ?? 0}deg) translateZ(var(--ring-radius)) scale(var(--card-scale))`,
            } as CSSProperties)
            : undefined;

    return (
        <div className={wrapperClassName} style={wrapperStyle}>
            <div
                className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ease-in-out"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                <div
                    className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_20px_46px_rgba(0,0,0,0.32)]"
                    style={{
                        backfaceVisibility: 'hidden',
                        pointerEvents: isFlipped ? 'none' : 'auto',
                    }}
                >
                    {coverSrc ? (
                        <Image
                            src={coverSrc}
                            alt={t('Projects', 'previewAlt', { title: project.title })}
                            fill
                            sizes="(max-width: 768px) 92vw, 320px"
                            className="object-cover"
                            priority={layout === 'carousel' && index === 0}
                        />
                    ) : (
                        <div className={`absolute inset-0 ${baseFallback}`} />
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.46)_38%,rgba(0,0,0,0.88)_100%)]" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-5">
                        <div>
                            <h3 className="max-w-[12ch] text-[1.45rem] font-semibold leading-[1.02] text-white">
                                {project.title}
                            </h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {project.stack.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/14 bg-black/26 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-white/82 backdrop-blur-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {primaryLink ? (
                                <a
                                    href={primaryLink.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/16"
                                >
                                    <FaExternalLinkAlt className="h-3.5 w-3.5" />
                                    <span>{primaryLink.label}</span>
                                </a>
                            ) : (
                                <span className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                                    {t('Projects', 'noDirectLink')}
                                </span>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => onToggleFlip(index)}
                                    className="rounded-full border border-red-400/22 bg-red-500/12 px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-red-50 transition hover:bg-red-500/20"
                                    aria-label={t('Projects', 'flipAria', { title: project.title })}
                                >
                                    {t('Projects', 'flipButton')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onOpenInfo(index)}
                                    className="rounded-full border border-white/14 bg-black/26 px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
                                    aria-label={t('Projects', 'infoAria', { title: project.title })}
                                >
                                    {t('Projects', 'infoButton')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_20px_46px_rgba(0,0,0,0.32)]"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        pointerEvents: isFlipped ? 'auto' : 'none',
                    }}
                >
                    {coverSrc ? (
                        <Image
                            src={coverSrc}
                            alt={t('Projects', 'previewAlt', { title: project.title })}
                            fill
                            sizes="(max-width: 768px) 92vw, 320px"
                            className="object-cover"
                        />
                    ) : (
                        <div className={`absolute inset-0 ${baseFallback}`} />
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.68))]" />

                    <div className="absolute top-7 left-0 right-0 px-6 text-center">
                        <h3 className="text-[1.65rem] font-semibold tracking-tight text-red-500 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
                            {project.title}
                        </h3>
                    </div>

                    <div className="absolute left-5 right-5 bottom-4 rounded-2xl bg-[#1f1f1f]/95 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.55)] backdrop-blur-md">
                        <p
                            className="text-[0.78rem] font-semibold leading-snug text-red-100/88"
                            style={{ maxHeight: '4.7em', WebkitMaskImage: 'linear-gradient(180deg,#000 78%,transparent)' }}
                        >
                            {project.short}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => onOpenInfo(index)}
                                className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/14"
                            >
                                {t('Projects', 'infoButton')}
                            </button>
                            <button
                                type="button"
                                onClick={() => onToggleFlip(index)}
                                className="rounded-full border border-red-400/18 bg-red-500/10 px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:bg-red-500/18"
                                aria-label={t('Projects', 'returnAria', { title: project.title })}
                            >
                                {t('Projects', 'backButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
