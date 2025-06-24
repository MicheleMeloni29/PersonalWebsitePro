"use client";
import Image from "next/image";

export default function Hero() {

    return (
        <section className="min-h-[85vh]  text-red-800 flex mb-30 flex-col">
        
            {/* Hero Section */}
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-2 text-center">
                <Image
                    src="/IMG_IO.jpg" // <-- Sostituisci con il tuo file reale
                    alt="Michele Meloni"
                    width={120}
                    height={120}
                    className="rounded-full border-2 border-light-light-border_img dark:border-dark-dark_border_img' shadow-[0_0_20px_#cc0000] mb-6"
                />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Hi, I'm Michele Meloni</h1>
                <p className="text-red-900 text-lg max-w-2xl">
                    I build modern and performant web and mobile applications.
                </p>
            </div>
        </section>
    );
}
