'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { Project } from '../data/projectsStructure';
import LiquidChrome from './LiquidChrome';

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
            : 'relative h-[17.5rem] w-full max-w-[15rem] justify-self-center [transform-style:preserve-3d] sm:h-[18.25rem] sm:max-w-[15.5rem] lg:h-[18.75rem] lg:max-w-[16rem]';
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
                onClick={() => onToggleFlip(index)}
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
                            className="object-contain scale-[0.88] p-3 sm:p-4"
                            priority={layout === 'carousel' && index === 0}
                        />
                    ) : (
                        <div className={`absolute inset-0 ${baseFallback}`} />
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.46)_38%,rgba(0,0,0,0.88)_100%)]" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-3.5 sm:p-4">
                        <div>
                            <h3 className="max-w-[12ch] text-[1.02rem] font-semibold leading-[1.05] text-white sm:text-[1.12rem]">
                                {project.title}
                            </h3>
                            <div className="mt-2.5 flex flex-wrap gap-1">
                                {project.stack.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/14 bg-black/26 px-1.5 py-0.5 text-[0.48rem] uppercase tracking-[0.12em] text-white/82 backdrop-blur-sm sm:text-[0.52rem]"
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
                                    onClick={(event) => event.stopPropagation()}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/14 bg-white/10 px-2.5 py-2 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/16 sm:text-[0.58rem]"
                                >
                                    <FaExternalLinkAlt className="h-3 w-3" />
                                    <span>{primaryLink.label}</span>
                                </a>
                            ) : (
                                <span className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/6 px-2.5 py-2 text-[0.54rem] uppercase tracking-[0.14em] text-white/42 sm:text-[0.58rem]">
                                    {t('Projects', 'noDirectLink')}
                                </span>
                            )}

                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onOpenInfo(index);
                                    }}
                                    className="rounded-full border border-white/14 bg-black/26 px-2.5 py-2 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10 sm:text-[0.54rem]"
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
                    <LiquidChrome
                        baseColor={[0.8, 0.09, 0.09]}
                        speed={0.25}
                        amplitude={0.45}
                        frequencyX={3}
                        frequencyY={2.2}
                        interactive={false}
                    />
                </div>
            </div>
        </div>
    );
}
