'use client';

import Image, { type StaticImageData } from 'next/image';

type Props = {
    name: string;
    role: string;
    photo: string | StaticImageData;    // es: '/myPhoto.jpg' in /public
    bio: string;                        // breve descrizione
    location?: string;                  // opzionale
    className?: string;
    // opzionali per rifinire l'immagine
    imageScale?: number;                // per gestire il ridimensionamento dell'immagine
    imageInset?: number;                // per gestire l'inserimento dell'immagine
    objectPosition?: string;            // per gestire la posizione dell'immagine
    imageOffsetY?: number;              // per gestire l'offset verticale dell'immagine
    imageOpacity?: number;              // per gestire l'opacità dell'immagine
};

export default function ProfileHeroCard({
    name,
    role,
    photo,
    bio,
    location,
    className = '',
    imageScale = 1,
    imageInset = 0,
    objectPosition = ' 50% 50$',
    imageOffsetY = 0,
    imageOpacity = 0.9,
}: Props) {
    return (
        <div
            className={`
        relative mx-auto w-full max-w-[300px] aspect-[4/5] p-[1.5px] rounded-[28px]
                shadow-[0_0_70px_-8px_rgba(220,38,38,0.45)]
        ${className}
      `}
        >
            {/* CARD INTERNA */}
            <div className="relative h-full w-full rounded-[26px] overflow-hidden
                      bg-[#000000] dark:bg-[#000000]">

                {/* FOTO A TUTTO SCHERMO */}
                <div className="absolute inset-1" style={{ inset: imageInset }}>
                    <Image
                        src={photo}
                        alt={name}
                        fill
                        priority
                        sizes="(max-width: 640px) 100vw, 520px"
                        className="object-cover opacity-90 will-change-transform"
                        style={{
                            objectPosition,                          // es. '50% 100%' per “attaccarla” al footer
                            transform: `translateY(${imageOffsetY}px) scale(${imageScale})`,
                            transformOrigin: '50% 100%',             // ancòra il trasform sul bordo inferiore
                            opacity: imageOpacity,                   // solo la foto
                        }}
                    />

                    {/* tinta/atmosfera rosso scuro + vignetta */}
                    <div className="absolute inset-0
                          bg-[radial-gradient(120%_80%_at_50%_18%,rgba(185,28,28,0.35),transparent_60%)]
                          mix-blend-overlay" />
                    <div className="absolute inset-0
                          bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.55))]" />
                </div>

                {/* TITOLO */}
                <div className="absolute top-7 left-0 right-0 text-center px-6">
                    <h3 className="text-3xl font-semibold tracking-tight
                         text-red-700
                         dark:text-white">
                        {name}
                    </h3>
                    <p className="mt-1 text-[15px]
                        text-red-700 dark:text-red-400/90">
                        {role}
                    </p>
                    <p className="mt-1 text-[15px]
                        text-red-700 dark:text-red-400/90">
                        {location ? `  ${location}` : ''}
                    </p>
                </div>

                {/* FOOTER – PICCOLA BIO */}
                <div
                    className="absolute left-5 right-5 bottom-5 rounded-2xl
                     bg-[#222222]
                     backdrop-blur-md px-4 py-3
                     shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                >
                    <p
                        className="text-[12px] leading-snug
                       text-red-700
                       max-h-20 overflow-y-auto pr-1
                       scrollbar-thin scrollbar-thumb-red-800/40 scrollbar-track-transparent
                       [scrollbar-width:thin]"
                    >
                        {bio}
                    </p>
                </div>

                {/* leggero alone rosso esterno */}
                <div className="pointer-events-none absolute -inset-1 rounded-[30px]
                        shadow-[0_0_90px_0_rgba(220,38,38,0.28)]" />
            </div>
        </div>
    );
}
