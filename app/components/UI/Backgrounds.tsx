"use client";

import { useId } from "react";

export type VariantProps = {
    scale: number;
    active: boolean;
    orientation: "portrait" | "landscape";
    lite: boolean;
};


// BackgroundVariantA: cerchi sfumati con gradiente freddo
export function BackgroundVariantA({ scale = 1 }: { scale?: number }) {

    return (
        <div
            className="absolute inset-0 overflow-visible"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "center",
                transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="0 0 1920 1080"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <radialGradient id= "gradientWhiteRed" cx="50%" cy="50%" r="60%">
                        <stop offset="20%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#fecaca" stopOpacity="0.85" />
                        <stop offset="60%" stopColor="#f87171" stopOpacity="0.75" />
                        <stop offset="80%" stopColor="#b91c1c" stopOpacity="0.62" />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                    </radialGradient>

                    {/* Filtro oversize anti-clipping (standard) */}
                    <filter
                        id="softBlur"
                        filterUnits="userSpaceOnUse"
                        x="-4000"
                        y="-4000"
                        width="12000"
                        height="12000"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="180" edgeMode="none" />
                    </filter>

                    {/* Filtro più leggero per TL landscape (r più piccolo) */}
                    <filter
                        id="softBlurTRland"
                        filterUnits="userSpaceOnUse"
                        x="-4000"
                        y="-4000"
                        width="12000"
                        height="12000"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="110" edgeMode="none" />
                    </filter>
                </defs>
                
                {/*  ---- TOP-LEFT -----  */}
                { /* Versione mobile-verticale */}
                <g className="tl tl-portrait" transform="translate(0, 0)">
                    <circle
                        cx={-900}
                        cy={-1600}
                        r={1500}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlur)"
                    />
                </g>

                { /* Versione desktop-orizzontale */}
                <g className="tl tl-landscape" transform="translate(0, 0)">
                    <circle
                        cx={-900}
                        cy={-500}
                        r={1200}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>

                {/* ------ BOTTOM-RIGHT ------ */}
                { /* Versione mobile-verticale */}
                <g className="br br-portrait" transform="translate(1920, 1080)">
                    <circle
                        cx={2000}
                        cy={1100}
                        r={3000}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlur)"
                    />
                </g>

                { /* Versione desktop-orizzontale */}
                <g className="br br-landscape" transform="translate(1920, 1080)">
                    <circle
                        cx={1350}
                        cy={600}
                        r={2000}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>
            </svg>
        </div>
    );
}

// BackgroundVariantB: versione specchiata del gradiente freddo
export function BackgroundVariantB({ scale = 1 }: { scale?: number }) {

    return (
        <div
            className="absolute inset-0 overflow-visible"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "center",
                transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="0 0 1920 1080"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <radialGradient id="gradientWhiteRed" cx="50%" cy="50%" r="60%">
                        <stop offset="20%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#fecaca" stopOpacity="0.85" />
                        <stop offset="60%" stopColor="#f87171" stopOpacity="0.75" />
                        <stop offset="80%" stopColor="#b91c1c" stopOpacity="0.62" />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                    </radialGradient>

                    {/* Filtro oversize anti-clipping (standard) */}
                    <filter
                        id="softBlur"
                        filterUnits="userSpaceOnUse"
                        x="-4000"
                        y="-4000"
                        width="12000"
                        height="12000"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="180" edgeMode="none" />
                    </filter>

                    {/* Filtro più leggero per TL landscape (r più piccolo) */}
                    <filter
                        id="ssoftBlurTRland"
                        filterUnits="userSpaceOnUse"
                        x="-4000"
                        y="-4000"
                        width="12000"
                        height="12000"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="110" edgeMode="none" />
                    </filter>
                </defs>

                {/* ---------- TOP ----------- */}
                {/* Versione PORTRAIT (mobile/verticale) */}
                <g className="tr tr-portrait" transform="translate(1920, 0)">
                    <circle
                        cx={-900}
                        cy={-2050}
                        r={1500}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>

                {/* Versione LANDSCAPE (desktop/orizzontale) */}
                <g className="tr tr-landscape" transform="translate(1920, 0)">
                    <circle
                        cx={800}
                        cy={-500}
                        r={1200}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>

                {/* ---------- BOTTOM ----------- */}
                {/* Versione PORTRAIT (mobile/verticale) */}
                <g className="bl bl-portrait" transform="translate(0, 1080)">
                    <circle
                        cx={960}
                        cy={1800}
                        r={1200}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlur)"
                    />
                </g>

                <g className="bl bl-landscape" transform="translate(0, 1080)">
                    <circle
                        cx={-1750}
                        cy={600}
                        r={2200}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>
            </svg>
        </div>
    );
}

// BackgroundVariantC: pattern caldo ai lati
export function BackgroundVariantC({ scale = 1 }: { scale?: number }) {

    return (
        <div
            className="absolute inset-0 overflow-visible"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "center",
                transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="0 0 1920 1080"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <radialGradient id="gradientWhiteRed" cx="50%" cy="50%" r="60%">
                        <stop offset="20%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#fecaca" stopOpacity="0.85" />
                        <stop offset="60%" stopColor="#f87171" stopOpacity="0.75" />
                        <stop offset="80%" stopColor="#b91c1c" stopOpacity="0.62" />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                    </radialGradient>

                    {/* Filtro oversize anti-clipping (standard) */}
                    <filter
                        id="softBlur"
                        filterUnits="userSpaceOnUse"
                        x="-4000"
                        y="-4000"
                        width="12000"
                        height="12000"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="180" edgeMode="none" />
                    </filter>

                    {/* Filtro più leggero per TR landscape (r più piccolo) */}
                    <filter
                        id="softBlurTRland"
                        filterUnits="userSpaceOnUse"
                        x="-4000"
                        y="-4000"
                        width="12000"
                        height="12000"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="110" edgeMode="none" />
                    </filter>
                </defs>

                {/* ---------- RIGHT ---------- */}
                {/* Versione PORTRAIT (mobile/verticale) */}
                <g className="tr tr-portrait" transform="translate(1920, 0)">
                    <circle
                        cx={2400}
                        cy={540}
                        r={2600}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlur)"
                    />
                </g>

                {/* Versione LANDSCAPE (desktop/orizzontale) */}
                <g className="tr tr-landscape" transform="translate(1920, 0)">
                    <circle
                        cx={700}
                        cy={540}
                        r={800}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>

                {/* ---------- LEFT ---------- */}
                {/* Versione PORTRAIT (mobile/verticale) */}
                <g className="bl bl-portrait" transform="translate(0, 0)">
                    <circle
                        cx={-2400}
                        cy={540}
                        r={2600}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlur)"
                    />
                </g>

                {/* Versione LANDSCAPE (desktop/orizzontale) */}
                <g className="bl bl-landscape" transform="translate(0, 0)">
                    <circle
                        cx={-700}
                        cy={540}
                        r={800}
                        fill="url(#gradientWhiteRed)"
                        filter="url(#softBlurTRland)"
                    />
                </g>
            </svg>
        </div>
    );
}
