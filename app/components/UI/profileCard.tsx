"use client";

import Image, { type StaticImageData } from "next/image";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useScroll,
    useReducedMotion,
    useInView,
    animate,
    useMotionTemplate,
    useMotionValueEvent,
    type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LiquidChrome from "./LiquidChrome";


type Props = {
    name: string;
    role: string;
    photo: string | StaticImageData;
    bio: string;
    location?: string;
    className?: string;
    imageScale?: number;
    imageInset?: number;
    objectPosition?: string;
    imageOffsetY?: number;
    imageOpacity?: number;
    tiltMaxDeg?: number;
    hoverScale?: number;
    depthPx?: number;
    scrollLiftPx?: number;
    // Flip behavior
    autoFlipOnMount?: boolean;
    flipDelayMs?: number;
    flipDurationMs?: number;
    enableClickFlip?: boolean;
};

export default function ProfileHeroCard({
    name,
    role,
    photo,
    bio,
    location,
    className = "",
    imageScale = 1,
    imageInset = 0,
    objectPosition = "50% 50%",
    imageOffsetY = 0,
    imageOpacity = 0.9,
    tiltMaxDeg = 14,
    hoverScale = 1.03,
    depthPx = 56,
    scrollLiftPx = 48,
    autoFlipOnMount = true,
    flipDelayMs = 650,
    flipDurationMs = 900,
    enableClickFlip = true,
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const inView = useInView(wrapperRef, { amount: 0.4 });

    // Motion prefs
    const prefersReduced = useReducedMotion();
    const maxTilt = prefersReduced ? 0 : tiltMaxDeg;

    // Tilt
    const mvX = useMotionValue(0);
    const mvY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
        stiffness: 220,
        damping: 22,
        mass: 0.6,
    });
    const rotateYFromMouse = useSpring(
        useTransform(mvX, [-0.5, 0.5], [-maxTilt, maxTilt]),
        { stiffness: 220, damping: 22, mass: 0.6 }
    );

    // Flip (0 = lato A cover, 180 = lato B descrizione)
    const flipY = useMotionValue(0);
    const combinedRotateY = useTransform(
        [rotateYFromMouse, flipY],
        (vals) => (vals[0] as number) + (vals[1] as number)
    );

    const rotateY = useMotionTemplate`${combinedRotateY}deg`;


    // Crossfade fallback
    const faceAOpacity = useTransform(flipY, [0, 89, 90, 180], [1, 1, 0, 0]);
    const faceBOpacity = useTransform(flipY, [0, 89, 90, 180], [0, 0, 1, 1]);

    // Mostra cover solo quando flip < 90°
    const [showCover, setShowCover] = useState(true);
    useMotionValueEvent(flipY, "change", (v) => setShowCover(v < 90));

    // Ombra
    const shadowScale = useTransform(mvY, [-0.5, 0.5], [0.95, 0.95]);
    const shadowY = useSpring(useTransform(mvY, [-0.5, 0.5], [0, 2]), {
        stiffness: 120,
        damping: 18,
    });
    const shadowBlurValue = useTransform(mvY, [-0.5, 0.5], [18, 14]);
    const shadowFilter = useTransform(shadowBlurValue, (b) => `blur(${b}px)`);

    // Float on scroll (dopo primo scroll)
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start 90%", "end 10%"] });
    const internalFloatY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -scrollLiftPx]), {
        stiffness: 60,
        damping: 16,
    });
    const [enableFloat, setEnableFloat] = useState(false);
    useEffect(() => {
        const onFirstScroll = () => setEnableFloat(true);
        window.addEventListener("scroll", onFirstScroll, { once: true, passive: true });
        return () => window.removeEventListener("scroll", onFirstScroll);
    }, []);
    const floatY = enableFloat && !prefersReduced ? internalFloatY : 0;

    // Auto flip iniziale
    useEffect(() => {
        if (!autoFlipOnMount) return;
        if (prefersReduced) {
            flipY.set(180);
            return;
        }
        if (!inView) return;
        const t = setTimeout(() => {
            const controls = animate(flipY, 180, {
                duration: flipDurationMs / 1000,
                ease: [0.22, 1, 0.36, 1],
            });
            return () => controls.stop();
        }, flipDelayMs);
        return () => clearTimeout(t);
    }, [autoFlipOnMount, prefersReduced, inView, flipDelayMs, flipDurationMs, flipY]);

    // Flip manuale (click/tap/Enter/Space)
    const [isFlipping, setIsFlipping] = useState(false);
    const flipTo = (deg: number) => {
        if (isFlipping) return;
        if (prefersReduced) {
            flipY.set(deg);
            return;
        }
        setIsFlipping(true);
        const controls = animate(flipY, deg, {
            duration: flipDurationMs / 1000,
            ease: [0.22, 1, 0.36, 1],
            onComplete: () => setIsFlipping(false),
        });
        // safety in case unmount mid-animation:
        setTimeout(() => controls.stop(), flipDurationMs + 50);
    };
    const toggleFlip = () => {
        const target = flipY.get() < 90 ? 180 : 0;
        flipTo(target);
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!enableClickFlip) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip();
        }
    };

    // Pointer handlers per tilt
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mvX.set((e.clientX - r.left) / r.width - 0.5);
        mvY.set((e.clientY - r.top) / r.height - 0.5);
    };
    const resetTilt = () => {
        mvX.set(0);
        mvY.set(0);
    };

    return (
        <div
            ref={wrapperRef}
            className={`
        relative mx-auto w-full max-w-[320px] md:max-w-[360px] lg:max-w-[420px]
        aspect-[4/5] p-[1.5px] rounded-[28px]
        overflow-visible
        ${className}
      `}
            style={{ perspective: 1400 }}
        >
            {/* Ombra */}
            <motion.div
                aria-hidden
                className="absolute left-1/2 bottom-2 h-8 w-4/5 -translate-x-1/2 rounded-[999px] bg-black/45 overflow-hidden"
                style={{ filter: shadowFilter, y: shadowY, scale: shadowScale }}
            />

            {/* Card 3D */}
            <motion.div
                ref={cardRef}
                onPointerMove={onPointerMove}
                onPointerLeave={resetTilt}
                onPointerCancel={resetTilt}
                onTouchEnd={resetTilt}
                whileHover={{ scale: prefersReduced ? 1 : hoverScale }}
                className="relative h-full w-full rounded-[26px] overflow-hidden bg-black transform-gpu will-change-transform
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{
                    rotateX,
                    rotateY,
                    y: floatY,
                    transformStyle: "preserve-3d" as any,
                }}
                // Flip con click/tap e tastiera
                role={enableClickFlip ? "button" : undefined}
                tabIndex={enableClickFlip ? 0 : -1}
                onClick={enableClickFlip ? toggleFlip : undefined}
                onKeyDown={onKeyDown}
                aria-pressed={enableClickFlip ? (flipY.get() >= 90) : undefined}
                aria-label={enableClickFlip ? "Flip card" : undefined}
            >
                {/* ===== LATO A (COVER) ===== */}
                <div
                    className="absolute inset-0"
                    style={{
                        transform: `translateZ(${depthPx * 0.6}px) rotateY(0deg)`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "visible",
                        WebkitBackfaceVisibility: "visible",
                        pointerEvents: showCover ? "auto" : "none",
                        visibility: showCover ? "visible" : "hidden", 
                    }}
                >
                    {/* Monta LiquidChrome solo se cover visibile E in viewport */}
                    {inView && showCover && (
                        <LiquidChrome
                            baseColor={[0.08, 0.08, 0.1]}
                            speed={0.25}
                            amplitude={0.45}
                            frequencyX={3.0}
                            frequencyY={2.2}
                            interactive={false}
                        />
                    )}

                    {/* Overlay opzionale */}
                    <div className="absolute inset-0 grid place-items-center pointer-events-none">
                        <h2 className="text-white/90 text-2xl font-bold tracking-tight drop-shadow-[0_6px_22px_rgba(0,0,0,0.6)]">
                            {name}
                        </h2>
                    </div>
                </div>

                {/* ===== LATO B (DESCRIZIONE) ===== */}
                <div
                    className="absolute inset-0"
                    style={{
                        transform: `translateZ(${depthPx * 0.6}px) rotateY(180deg)`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        pointerEvents: showCover ? "none" : "auto",
                        visibility: showCover ? "hidden" : "visible",
                    }}
                >
                    {/* FOTO */}
                    <div
                        className="absolute inset-1"
                        style={{ inset: imageInset, transform: `translateZ(${-depthPx * 0.35}px)` }}
                    >
                        <Image
                            src={photo}
                            alt={name}
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 520px"
                            className="object-cover will-change-transform"
                            style={{
                                objectPosition,
                                transform: `translateY(${imageOffsetY}px) scale(${imageScale})`,
                                transformOrigin: "50% 100%",
                                opacity: imageOpacity,
                                backfaceVisibility: "hidden",
                            }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_18%,rgba(185,28,28,0.32),transparent_60%)] mix-blend-overlay" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.60))]" />
                    </div>

                    {/* TITOLI */}
                    <div
                        className="absolute top-7 left-0 right-0 text-center px-6"
                        style={{ transform: `translateZ(${depthPx * 1.0}px)` }}
                    >
                        <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-red-700 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                            {name}
                        </h3>
                        <p className="mt-1 text-[17px] md:text-[18px] font-bold text-red-700">{role}</p>
                    </div>

                    {/* BIO */}
                    <div
                        className="absolute left-5 right-5 bottom-3 rounded-2xl bg-[#1f1f1f]/95 backdrop-blur-md px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
                        style={{ transform: `translateZ(${depthPx * 0.7}px)` }}
                    >
                        <p
                            className="text-[14px] font-bold leading-snug text-red-700 pr-1 overflow-hidden"
                            style={{ maxHeight: "5.6em", WebkitMaskImage: "linear-gradient(180deg,#000 80%,transparent)" }}
                        >
                            {bio}
                        </p>
                        {location && <p className="mt-2 text-xs text-white/70">{location}</p>}
                    </div>
                </div>

                {/* Glow esterno */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[30px] overflow-hidden"
                    style={{
                        filter: "drop-shadow(0 0 80px rgba(220,38,38,0.28))",
                        transform: `translateZ(${depthPx * 1.2}px)`,
                    }}
                />
            </motion.div>
        </div>
    );
}
