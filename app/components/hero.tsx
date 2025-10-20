"use client";
import { ComponentPropsWithoutRef, useMemo } from "react";
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

function LabeledRotator({
    label,
    texts,
    labelWidthClass = "w-28 sm:w-32  font-semibold  text-red-900",
    mainTextClasses = "text-red-700 text-xl md:text-2xl xl:text-3xl font-bold tracking-tight whitespace-nowrap",
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
                <span className={`opacity-0 pointer-events-none select-none ${mainTextClasses}`} aria-hidden="true">
                    {longest}
                </span>

                <div className="absolute inset-0 overflow-hidden">
                    <RotatingText
                        texts={texts}
                        rotationInterval={2600}
                        splitBy="characters"
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

type HeroProps = ComponentPropsWithoutRef<"section">;

export default function Hero({ className, ...sectionProps }: HeroProps) {
    const baseClasses = [
        "px-6",
        "pt-[clamp(8px,30vh,56px)]",
        "pb-[calc(var(--nav-bottom-h)+env(safe-area-inset-bottom))]",
        "lg:pb-0",
        "lg:pt-18",
        "lg:min-h-[calc(100dvh-var(--nav-top-h,80px))]",
        "lg:flex",
        "lg:items-center",
        "lg:py-0",
    ].join(" ");

    return (
        <section
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ""}`}
        >
            <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-16 lg:items-center">
                {/* Sinistra (desktop): ProfileCard grande */}
                <div className="flex justify-center lg:justify-start lg:mt-24 sm:mt-4 xl:mt-12">
                    <div className= "w-full max-w-md sm:max-w-lg lg:max-w-2xl">
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
                            className="sm:aspect-[4/5] lg:aspect-[4/5]" // aspect ratio adattivo
                        />
                    </div>
                </div>

                {/* Destra (desktop): RotatingText */}
                <div className="mb-10 flex flex-col gap-6 items-center lg:items-start lg:gap-24">
                    <LabeledRotator label="Languages" texts={LANGUAGES} />
                    <LabeledRotator label="Tech" texts={TECHNOLOGIES} />
                </div>
            </div>
        </section>
    );
}
