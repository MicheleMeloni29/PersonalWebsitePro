'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import type { Project } from '../data/projectsStructure';

type MediaItem = {
    type: 'image' | 'video';
    src: string;
};

type ProjectInfoPanelProps = {
    project: Project | null;
    activeMediaIndex: number;
    onClose: () => void;
    onNextMedia: () => void;
    onPreviousMedia: () => void;
    t: (ns: 'Projects', key: string, vars?: Record<string, string | number>) => string;
};

const normalizeMedia = (item: string | { type?: 'image' | 'video'; src: string }): MediaItem => {
    if (typeof item === 'string') return { type: 'image', src: item };
    return { type: item.type ?? 'image', src: item.src };
};

const normalizeAssetPath = (src?: string) => {
    if (!src) return '';
    return src.startsWith('/') ? src : `/${src}`;
};

const getCoverSource = (project: Project) => {
    if (project.coverImage) return normalizeAssetPath(project.coverImage);
    const firstImage = project.images.find((item) => typeof item === 'string');
    if (firstImage) return normalizeAssetPath(firstImage);
    const firstMedia = project.images.find((item) => typeof item !== 'string');
    return typeof firstMedia === 'string' ? normalizeAssetPath(firstMedia) : normalizeAssetPath(firstMedia?.src);
};

export default function ProjectInfoPanel({
    project,
    activeMediaIndex,
    onClose,
    onNextMedia,
    onPreviousMedia,
    t,
}: ProjectInfoPanelProps) {
    useEffect(() => {
        if (!project) return;

        const previousOverflow = document.body.style.overflow;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [project, onClose]);

    if (!project) return null;

    const media = project.images.map(normalizeMedia);
    const currentMedia = media[activeMediaIndex] ?? media[0];
    const currentSrc = normalizeAssetPath(currentMedia?.src);
    const coverSrc = getCoverSource(project);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#09090b] shadow-[0_28px_80px_rgba(0,0,0,0.5)]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/40 text-white transition hover:bg-white/10"
                    aria-label={t('Projects', 'closeInfo')}
                >
                    <FaTimes className="h-4 w-4" />
                </button>

                <div className="relative h-48 overflow-hidden border-b border-white/8 sm:h-60">
                    {coverSrc ? (
                        <Image
                            src={coverSrc}
                            alt={t('Projects', 'previewAlt', { title: project.title })}
                            fill
                            sizes="100vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.22),transparent_38%),linear-gradient(160deg,rgba(31,31,31,0.98),rgba(9,9,11,0.98))]" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.78))]" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                        <h3 className="text-2xl font-semibold text-white sm:text-3xl">{project.title}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {project.stack.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/12 bg-black/26 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/82"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.15fr_0.95fr]">
                    <div className="flex min-h-0 flex-col border-b border-white/8 p-5 lg:border-b-0 lg:border-r">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/46">
                                {t('Projects', 'galleryLabel')}
                            </p>
                            {project.links?.length ? (
                                <div className="flex flex-wrap justify-end gap-2">
                                    {project.links.map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-white/82 transition hover:bg-white/12"
                                        >
                                            <FaExternalLinkAlt className="h-3 w-3" />
                                            <span>{link.label}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="relative flex min-h-[16rem] flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#050505]">
                            {currentMedia ? (
                                currentMedia.type === 'video' ? (
                                    <video
                                        src={currentSrc}
                                        className="h-full w-full object-contain"
                                        controls
                                        autoPlay
                                        muted
                                        playsInline
                                    />
                                ) : currentSrc ? (
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={currentSrc}
                                            alt={t('Projects', 'previewAlt', { title: project.title })}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 700px"
                                            className="object-contain p-4"
                                        />
                                    </div>
                                ) : null
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-center text-sm text-white/48">
                                    {t('Projects', 'noMedia')}
                                </div>
                            )}
                        </div>

                        {media.length > 1 ? (
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={onPreviousMedia}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/12"
                                >
                                    <FaChevronLeft className="h-3 w-3" />
                                    <span>{t('Projects', 'previousMedia')}</span>
                                </button>
                                <div className="flex gap-2">
                                    {media.map((_, dotIndex) => (
                                        <span
                                            key={dotIndex}
                                            className={`h-1.5 rounded-full transition-all ${
                                                dotIndex === activeMediaIndex ? 'w-6 bg-red-500' : 'w-1.5 bg-white/24'
                                            }`}
                                            aria-hidden
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={onNextMedia}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/12"
                                >
                                    <span>{t('Projects', 'nextMedia')}</span>
                                    <FaChevronRight className="h-3 w-3" />
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <div className="min-h-0 p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/46">
                            {t('Projects', 'descriptionLabel')}
                        </p>
                        <div className="mt-4 max-h-[38vh] overflow-y-auto rounded-[24px] border border-white/10 bg-white/4 p-5 text-sm leading-relaxed text-white/78 lg:max-h-full">
                            {project.full}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
