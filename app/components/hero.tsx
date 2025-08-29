"use client";
import { useMemo } from "react";
import ProfileCard from "./UI/profileCard";
import RotatingText from "./UI/RotatingText";

const LANGUAGES = [
    "TypeScript",
    "ReactNative",
    "Java",
    "Python",
    "C",
    "HTML",
    "CSS",
];

const TECHNOLOGIES = [
    "Expo",
    "Next.js",
    "Firebase",
    "TailwindCSS",
    "GitHub",
    "Vercel",
];


// Rotatore con ghost width e label a larghezza fissa
function LabeledRotator({
    label,
    texts,
    labelWidthClass = "w-28 sm:w-32", // <-- stessa larghezza su entrambe le righe
    mainTextClasses = "text-red-900 text-xl md:text-2xl xl:text-3xl font-semibold tracking-tight whitespace-nowrap",
}: {
    label: string;
    texts: string[];
    labelWidthClass?: string;
    mainTextClasses?: string;
}) {
    const longest = useMemo(
        () => texts.reduce((a, b) => (a.length >= b.length ? a : b), ""),
        [texts]
    );

    return (
        <div className="flex items-center gap-4 min-w-0">
            <span className={`uppercase tracking-wider text-neutral-500 text-xs sm:text-sm shrink-0 ${labelWidthClass}`}>
                {label}
            </span>

            <div className="relative inline-block max-w-full overflow-hidden">
                {/* ghost: riserva spazio della stringa più lunga */}
                <span
                    className={`opacity-0 pointer-events-none select-none ${mainTextClasses}`}
                    aria-hidden="true"
                >
                    {longest}
                </span>

                {/* rotatore reale */}
                <div className="absolute inset-0 overflow-hidden">
                    <RotatingText
                        texts={texts}
                        rotationInterval={2400}
                        splitBy="characters"               // "words" se preferisci
                        staggerDuration={0.02}
                        staggerFrom="center"
                        mainClassName={mainTextClasses}
                        elementLevelClassName="inline-block will-change-transform"
                        transition={{ type: "spring", damping: 24, stiffness: 320 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <section className="min-h-screen px-6 py-8">
            {/* Mobile: 1 col  —  Desktop: 2 col (card | rotatori) */}
            <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-x-16 items-start">
                {/* Sinistra: ProfileCard */}
                <div className="flex justify-center lg:justify-start">
                    <ProfileCard
                        name="Michele Meloni"
                        role="Frontend Developer"
                        location="Sestu, Sardinia (IT)"
                        photo="profileIMGReal.png"
                        bio="I build modern web & mobile apps. Passionate about UI/UX and performance."
                        imageScale={0.95}
                        imageInset={12}
                        objectPosition="50% 60%"
                        imageOffsetY={0}
                        imageOpacity={0.3}
                    />
                </div>

                {/* Destra: due RotatingText uno sopra l'altro (centrati verticalmente rispetto alla card) */}
                <div className="flex flex-col justify-center gap-6 lg:items-start items-center">
                    <LabeledRotator label="Languages" texts={LANGUAGES} />
                    <LabeledRotator label="Tech" texts={TECHNOLOGIES} />
                </div>
            </div>
        </section>
    );
}
