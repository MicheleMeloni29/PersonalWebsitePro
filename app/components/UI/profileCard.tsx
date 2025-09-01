"use client";

import Image, { type StaticImageData } from "next/image";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useScroll,
    useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

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

    // 3D tuning
    tiltMaxDeg?: number;
    hoverScale?: number;
    depthPx?: number;
    scrollLiftPx?: number;
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
}: Props) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Pointer → tilt
    const mvX = useMotionValue(0); // -0.5 .. 0.5
    const mvY = useMotionValue(0); // -0.5 .. 0.5

    const prefersReduced = useReducedMotion();
    const maxTilt = prefersReduced ? 0 : tiltMaxDeg;

    const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
        stiffness: 220,
        damping: 22,
        mass: 0.6,
    });
    const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-maxTilt, maxTilt]), {
        stiffness: 220,
        damping: 22,
        mass: 0.6,
    });

    // Scroll “float”
    const { scrollYProgress } = useScroll();
    const floatY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -scrollLiftPx]), {
        stiffness: 60,
        damping: 16,
    });

    // Shadow dynamics
    const shadowX = useTransform(mvX, [-0.5, 0.5], [18, -18]);
    const shadowY = useTransform(mvY, [-0.5, 0.5], [26, -6]);
    const shadowScale = useTransform(mvY, [-0.5, 0.5], [1.05, 0.92]);
    const shadowOpacity = useTransform(mvY, [-0.5, 0.5], [0.55, 0.35]);

    // Glare position (CSS vars)
    const glarePX = useTransform(mvX, (v) => `${(v + 0.5) * 100}%`);
    const glarePY = useTransform(mvY, (v) => `${(v + 0.5) * 100}%`);

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
            className={`
        relative mx-auto w-full max-w-[320px] md:max-w-[360px] lg:max-w-[420px]
        aspect-[4/5] p-[1.5px] rounded-[28px]
        ${className}
      `}
            style={{ perspective: 1400 }}
        >
            {/* dynamic ground shadow */}
            <motion.div
                aria-hidden
                className="absolute left-1/2 bottom-2 h-10 w-4/5 -translate-x-1/2 rounded-[999px]
                   bg-black/50 blur-[18px] opacity-50"
                style={{
                    x: shadowX,
                    y: shadowY,
                    scaleX: shadowScale,
                    opacity: shadowOpacity,
                    filter: "blur(22px)",
                }}
            />

            {/* 3D card */}
            <motion.div
                ref={cardRef}
                onPointerMove={onPointerMove}
                onPointerLeave={resetTilt}
                onPointerCancel={resetTilt}
                onTouchEnd={resetTilt}
                whileHover={{ scale: hoverScale }}
                className="relative h-full w-full rounded-[26px] overflow-hidden bg-black transform-gpu will-change-transform"
                style={{
                    rotateX,
                    rotateY,
                    y: floatY,
                    transformStyle: "preserve-3d" as any,
                    // pass glare vars
                    ["--glare-x" as any]: glarePX,
                    ["--glare-y" as any]: glarePY,
                }}
            >
                {/* Image (slightly behind) */}
                <div
                    className="absolute inset-1"
                    style={{
                        inset: imageInset,
                        transform: `translateZ(${-depthPx * 0.35}px)`,
                    }}
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

                    {/* atmosphere + vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_18%,rgba(185,28,28,0.32),transparent_60%)] mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.60))]" />
                </div>

                {/* Rim light / border sheen */}
                <div
                    aria-hidden
                    className="
            pointer-events-none absolute inset-0 rounded-[26px]
            [mask:linear-gradient(#000_0,#000_0)_content-box,linear-gradient(#000_0,#000_0)]
            [mask-composite:exclude]
            p-[2px]
          "
                    style={{
                        background:
                            "radial-gradient(800px 800px at var(--glare-x) var(--glare-y), rgba(255,255,255,0.25), rgba(255,255,255,0.05) 35%, transparent 60%)",
                        transform: `translateZ(${depthPx * 0.2}px)`,
                    }}
                />

                {/* Specular glare following cursor */}
                <div
                    aria-hidden
                    className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(300px_300px_at_var(--glare-x)_var(--glare-y),rgba(255,255,255,0.18),transparent_60%)]
            mix-blend-screen
          "
                    style={{ transform: `translateZ(${depthPx * 0.9}px)` }}
                />

                {/* Title block */}
                <div
                    className="absolute top-7 left-0 right-0 text-center px-6"
                    style={{ transform: `translateZ(${depthPx * 1.0}px)` }}
                >
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-red-700 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                        {name}
                    </h3>
                    <p className="mt-1 text-[17px] md:text-[18px] font-bold text-red-700">
                        {role}
                    </p>
                </div>

                {/* Bio */}
                <div
                    className="absolute left-5 right-5 bottom-3 rounded-2xl bg-[#1f1f1f]/95 backdrop-blur-md px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
                    style={{ transform: `translateZ(${depthPx * 0.7}px)` }}
                >
                    <p
                        className="text-[14px] text-center font-bold leading-snug text-red-700 max-h-20 overflow-y-auto pr-1 no-scrollbar overscroll-contain touch-pan-y"
                    >
                        {bio}
                    </p>
                    {location && (
                        <p className="mt-2 text-xs text-center text-white/70">{location}</p>
                    )}
                </div>

                {/* Outer glow lifted forward */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-1 rounded-[30px]"
                    style={{
                        boxShadow: "0 0 90px 0 rgba(220,38,38,0.28)",
                        transform: `translateZ(${depthPx * 1.2}px)`,
                    }}
                />
            </motion.div>
        </div>
    );
}
