// This section is the first thing users see when they land on the page, and it contains a profile card with a photo and a brief bio, as well as two rotating highlights showcasing the languages and technologies I work with.
"use client";
import { ComponentPropsWithoutRef, useMemo } from "react";
import ProfileCard from "./UI/profileCard";
import RotatingText from "./UI/RotatingText";
import { useLanguage } from "./data/LanguageProvider";

// Reusable row made of a fixed label plus a rotating animated value.
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
    // Keeps the rotating area wide enough for the longest string, preventing layout jumps.
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
                {/* Invisible sizing reference used to preserve a stable width while the visible text rotates. */}
                <span className={`opacity-0 pointer-events-none select-none ${mainTextClasses}`} aria-hidden="true">
                    {longest}
                </span>

                {/* The animated text is absolutely layered on top of the sizing reference. */}
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
    const { t, dict } = useLanguage();
    const languages = dict.Hero.rotators.languages;
    const tech = dict.Hero.rotators.tech;

    // Section spacing adapts to the fixed navigation so the hero remains centered and unobstructed.
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
            {/* On desktop the hero card sits in the center column so its title stays centered on screen. */}
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-10 lg:items-center xl:gap-x-16">
                {/* Center column on desktop: the main profile card. */}
                <div className="mt-4 flex justify-center lg:col-start-2 lg:row-start-1 lg:mt-24 xl:mt-12">
                    <div className= "w-full max-w-md sm:max-w-lg lg:max-w-2xl">
                        <ProfileCard
                            name={dict.Hero.profile.name}
                            role={dict.Hero.profile.role}
                            location={dict.Hero.profile.location}
                            photo="profileIMGReal.png"
                            bio={dict.Hero.profile.bio}
                            imageScale={0.95}
                            imageInset={12}
                            objectPosition="50% 60%"
                            imageOffsetY={0}
                            imageOpacity={0.3}
                            className="sm:aspect-[4/5] lg:aspect-[4/5]" // Adaptive aspect ratio for different screen sizes.
                            flipLabel={t("Aria", "flipCard")}
                        />
                    </div>
                </div>

                {/* Right column on desktop: rotating highlights for languages and technologies. */}
                <div className="mb-10 flex flex-col items-center gap-6 lg:col-start-3 lg:row-start-1 lg:mb-0 lg:items-start lg:justify-self-end lg:gap-24">
                    <LabeledRotator label={dict.Hero.labels.languages} texts={languages} />
                    <LabeledRotator label={dict.Hero.labels.tech} texts={tech} />
                </div>
            </div>
        </section>
    );
}
