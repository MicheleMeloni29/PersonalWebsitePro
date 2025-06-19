'use client';

import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

const projects = [
    {
        title: 'Il Mio Orto',
        short: 'Project carried out in a team with two colleagues to complete the practical part of the course "Human-machine interaction"',
        full: 'We had the task of designing and creating an android application using the Java language. So we decided to create an application that would allow users to organize their own small vegetable garden at home and keep it under control even remotely with various humidity sensors and remote irrigation device. The login is managed so that every time the user wants to log in, he must first register by filling in the mandatory fields. Once the data is stored, the user can log in.',
        images: ['/IlMioOrto/Start.png', 'IlMioOrto/Login.png', '/IlMioOrto/Signin.png', '/IlMioOrto/Home.png'],
    },

];

export default function Projects() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const handleNextProject = () => {
        setExpanded(false);
        setImageIndex(0);
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    };

    const handlePrevProject = () => {
        setExpanded(false);
        setImageIndex(0);
        setCurrentIndex((prev) =>
            prev === 0 ? projects.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setImageIndex((prev) =>
            (prev + 1) % projects[currentIndex].images.length
        );
    };

    const handlePrevImage = () => {
        setImageIndex((prev) =>
            prev === 0 ? projects[currentIndex].images.length - 1 : prev - 1
        );
    };

    return (
        <section
            id="projects"
            className="min-h-[calc(100vh-64px-40px)] flex flex-col items-center justify-center px-6 pb-32"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-800">My Projects</h2>

            <div className="relative w-full max-w-6xl flex items-center justify-center">

                {/* Freccia sinistra */}
                <button
                    onClick={handlePrevProject}
                    className="absolute left-0 z-10 p-4 text-red-500 hover:text-red-700 transition-all"
                >
                    <FaChevronLeft size={24} />
                </button>

                {/* Contenitore carosello */}
                <div
                    className="min-h-[calc(100vh-64px-40px)] w-full max-w-5xl flex items-center justify-center 
                bg-[#222223] px-6 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_6px_rgba(0,0,0,0.6),_0_10px_15px_rgba(0,0,0,0.3)] 
                border border-[#3d3d3d] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-shadow duration-500"
                >
                    {/* Card progetto */}
                    <div className="flex flex-col items-center text-white max-w-xl px-4 text-center">
                        <h3 className="text-2xl font-bold text-red-600 mb-2">
                            {projects[currentIndex].title}
                        </h3>
                        <div className="relative mb-4">
                            <div className="text-base text-red-700 overflow-y-auto  max-h-32 pr-1 transition-all duration-500 scrollbar-hide">
                                {expanded ? projects[currentIndex].full : projects[currentIndex].short}
                            </div>
                            {!expanded && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="mt-2 text-red-600 underline text-sm absolute bottom-0 right-0 top-10"
                                >
                                    Find more
                                </button>
                            )}
                        </div>

                        {/* Carosello immagini centrato */}
                        <div className="relative w-full overflow-hidden pt-20 ">
                            <div className="flex items-center justify-center">
                                <div
                                    className="flex gap-4 transition-transform duration-500 ease-in-out"
                                    style={{
                                        transform: `translateX(calc(50% - ${(imageIndex + 0.5) * 220}px))`,
                                    }}
                                >
                                    {projects[currentIndex].images.map((src, idx) => {
                                        const isActive = idx === imageIndex;
                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={{ scale: isActive ? 1.2 : 0.9, opacity: isActive ? 1 : 0.6 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-shrink-0"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`Project image ${idx + 1}`}
                                                    width={120}
                                                    height={80}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Frecce per navigare */}
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                                <button onClick={handlePrevImage} className="text-white hover:text-red-600">
                                    <FaChevronLeft size={24} />
                                </button>
                            </div>
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                                <button onClick={handleNextImage} className="text-white hover:text-red-600">
                                    <FaChevronRight size={24} />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Freccia destra */}
                <button
                    onClick={handleNextProject}
                    className="absolute right-0 z-10 p-4 text-red-500 hover:text-red-700 transition-all"
                >
                    <FaChevronRight size={24} />
                </button>
            </div>
        </section>
    );

}
