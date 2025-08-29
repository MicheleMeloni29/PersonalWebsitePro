// src/components/DecryptedText.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface DecryptedTextProps extends HTMLMotionProps<"span"> {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: "start" | "end" | "center";
    useOriginalCharsOnly?: boolean;
    characters?: string;
    className?: string;
    encryptedClassName?: string;
    parentClassName?: string;
    animateOn?: "view" | "hover";
}

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = "start",
    useOriginalCharsOnly = false,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
    className = "",
    parentClassName = "",
    encryptedClassName = "",
    animateOn = "hover",
    ...props
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState<string>(text);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [isScrambling, setIsScrambling] = useState<boolean>(false);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [hasAnimated, setHasAnimated] = useState<boolean>(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        // Use a browser-safe interval type
        let interval: ReturnType<typeof setInterval> | undefined;
        let currentIteration = 0;

        const getNextIndex = (revealedSet: Set<number>): number => {
            const textLength = text.length;
            switch (revealDirection) {
                case "start":
                    return revealedSet.size;
                case "end":
                    return textLength - 1 - revealedSet.size;
                case "center": {
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex =
                        revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
                    if (
                        nextIndex >= 0 &&
                        nextIndex < textLength &&
                        !revealedSet.has(nextIndex)
                    ) {
                        return nextIndex;
                    }
                    // fallback: find first not revealed
                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i;
                    }
                    return 0;
                }
                default:
                    return revealedSet.size;
            }
        };

        const availableChars = useOriginalCharsOnly
            ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
            : characters.split("");

        const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
            if (useOriginalCharsOnly) {
                const positions = originalText.split("").map((char, i) => ({
                    char,
                    isSpace: char === " ",
                    index: i,
                    isRevealed: currentRevealed.has(i),
                }));

                const pool = positions
                    .filter((p) => !p.isSpace && !p.isRevealed)
                    .map((p) => p.char);

                for (let i = pool.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pool[i], pool[j]] = [pool[j], pool[i]];
                }

                let k = 0;
                return positions
                    .map((p) => {
                        if (p.isSpace) return " ";
                        if (p.isRevealed) return originalText[p.index];
                        return pool[k++];
                    })
                    .join("");
            }

            return originalText
                .split("")
                .map((char, i) => {
                    if (char === " ") return " ";
                    if (currentRevealed.has(i)) return originalText[i];
                    return availableChars[Math.floor(Math.random() * availableChars.length)];
                })
                .join("");
        };

        if (isHovering) {
            setIsScrambling(true);
            interval = setInterval(() => {
                setRevealedIndices((prev) => {
                    if (sequential) {
                        if (prev.size < text.length) {
                            const idx = getNextIndex(prev);
                            const next = new Set(prev);
                            next.add(idx);
                            setDisplayText(shuffleText(text, next));
                            return next;
                        } else {
                            if (interval) clearInterval(interval);
                            setIsScrambling(false);
                            return prev;
                        }
                    } else {
                        setDisplayText(shuffleText(text, prev));
                        currentIteration++;
                        if (currentIteration >= maxIterations) {
                            if (interval) clearInterval(interval);
                            setIsScrambling(false);
                            setDisplayText(text);
                        }
                        return prev;
                    }
                });
            }, speed);
        } else {
            setDisplayText(text);
            setRevealedIndices(new Set());
            setIsScrambling(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [
        isHovering,
        text,
        speed,
        maxIterations,
        sequential,
        revealDirection,
        characters,
        useOriginalCharsOnly,
    ]);

    useEffect(() => {
        if (animateOn !== "view") return;
        const node = containerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setIsHovering(true);
                        setHasAnimated(true);
                    }
                });
            },
            { root: null, rootMargin: "0px", threshold: 0.1 }
        );

        observer.observe(node);
        return () => observer.unobserve(node);
    }, [animateOn, hasAnimated]);

    // Add touch support for "hover" behavior on mobile
    const hoverProps =
        animateOn === "hover"
            ? {
                onMouseEnter: () => setIsHovering(true),
                onMouseLeave: () => setIsHovering(false),
                onFocus: () => setIsHovering(true),
                onBlur: () => setIsHovering(false),
                onTouchStart: () => setIsHovering(true),
                onTouchEnd: () => setIsHovering(false),
            }
            : {};

    return (
        <motion.span
            ref={containerRef}
            className={`inline-block whitespace-pre-wrap ${parentClassName}`}
            {...hoverProps}
            {...props}
        >
            <span className="sr-only">{displayText}</span>
            <span aria-hidden="true">
                {displayText.split("").map((char, index) => {
                    const revealedOrDone =
                        revealedIndices.has(index) || !isScrambling || !isHovering;
                    return (
                        <span
                            key={index}
                            className={revealedOrDone ? className : encryptedClassName}
                        >
                            {char}
                        </span>
                    );
                })}
            </span>
        </motion.span>
    );
}
