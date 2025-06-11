'use client';

import { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-[#0d0d0d] w-full h-16 flex items-center justify-between px-6 relative">
            {/* Desktop menu centrato */}
            <nav className="hidden md:flex mx-auto space-x-20 text-sm font-semibold text-gray-300">
                <a href="#about" className="hover:text-red-900 transition duration-200 hover:scale-105">About</a>
                <a href="#timeline" className="hover:text-red-900 transition duration-200 hover:scale-105">Timeline</a>
                <a href="#projects" className="hover:text-red-900 transition duration-200 hover:scale-105">Projects</a>
                <a href="#contact" className="hover:text-red-900 transition duration-200 hover:scale-105">Contact</a>
            </nav>

            {/* Mobile hamburger (in alto a destra) */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`pt-5 absolute right-6 md:hidden text-2xl focus:outline-none transition-colors duration-300 ${isMenuOpen ? "text-red-900" : "text-white"
                    }`}
            >
                ☰
            </button>

            {/* Mobile menu dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-14 right-0 h-full w-24 bg-[#0d0d0d] animate-slideDown z-50 shadow-2xl">
                    <nav className="flex flex-col items-center gap-6 py-6 text-md font-mono text-gray-300">
                        {["About", "Timeline", "Projects", "Contact"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="relative hover:text-red-900 transition duration-200 hover:scale-105"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-900 transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
