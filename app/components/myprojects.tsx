'use client';

import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import { useDragControls, useMotionValue } from 'framer-motion';
import { title } from 'process';


const projects = [
    {
        title: 'Il Mio Orto',
        short: 'Project carried out in a team with two colleagues to complete the practical part of the course "Human-machine interaction"',
        full: 'We had the task of designing and creating an android application using the Java language. So we decided to create an application that would allow users to organize their own small vegetable garden at home and keep it under control even remotely with various humidity sensors and remote irrigation device. The login is managed so that every time the user wants to log in, he must first register by filling in the mandatory fields. Once the data is stored, the user can log in. The home page shows the user the state of the sensors and the possibility to irrigate the garden. The application also allows you to add new plants, view the history of irrigation and sensor data, and receive notifications when the plants need attention. The project was a great opportunity to apply our knowledge of Java and Android development, as well as to work collaboratively in a team.',
        images: ['/IlMioOrto/Start.png', 'IlMioOrto/Login.png', '/IlMioOrto/Signin.png', '/IlMioOrto/Home.png'],
    },
    {
        title: 'Frogger',
        short: 'Video game created in C with lncurses library fro the course "Operative Systems" whith a colleague',
        full: 'This is a video game created in C using the lncurses library, which allows for the creation of text-based user interfaces. The game is inspired by the classic Frogger game, where the player must navigate a frog across a busy road and a river filled with obstacles. The player controls the frog using the arrow keys to move up, down, left, or right. The goal is to reach the other side of the screen without getting hit by cars or falling into the water. The game features a simple scoring system, where the player earns points for successfully crossing the road and river. The game ends when the player either reaches the goal or loses all their lives.',
        images: [
            { type: 'video', src: '/Frogger/Video.mp4' },
        ],
    },

];

export default function Projects() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [startX, setStartX] = useState<number | null>(null);
    const [endX, setEndX] = useState<number | null>(null);
    const dragX = useMotionValue(0);
    const dragControls = useDragControls();


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

    const handleImageSwipe = (direction: 'left' | 'right') => {
        const total = projects[currentIndex].images.length;
        if (direction === 'left') {
            setImageIndex((prev) => (prev + 1) % total);
        } else {
            setImageIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
        }
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
                    className="min-h-[calc(100vh-65px-40px)] w-full max-w-5xl flex items-center justify-center 
                bg-[#222223] px-6 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_6px_rgba(0,0,0,0.6),_0_10px_15px_rgba(0,0,0,0.3)] 
                border border-[#3d3d3d] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-shadow duration-500"
                >
                    {/* Card progetto */}
                    <div className="flex flex-col items-center max-w-xl px-4 text-center">
                        <h3 className="text-2xl font-bold text-red-600 mb-2">
                            {projects[currentIndex].title}
                        </h3>
                        <div className="relative mb-4">
                            <div className="text-base text-red-700 overflow-y-auto max-h-32 pr-1 transition-all duration-500 scrollbar-hide ">
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

                        {/* Carosello immagini con drag*/}
                        <motion.div
                            className="relative w-full max-w-lg overflow-hidden pt-15 pb-70"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(event, info) => {
                                if (info.offset.x < -50) handleImageSwipe('left');
                                else if (info.offset.x > 50) handleImageSwipe('right');
                            }}
                        >
                            <div className="flex items center justify-center relative gap-4">
                                {projects[currentIndex].images.map((media, idx) => {
                                    const total = projects[currentIndex].images.length;
                                    const relativeIndex = (idx - imageIndex + total) % total;

                                    let scale = 0.8;
                                    let opacity = 0.5;
                                    let translateX = "-80%";

                                    if (relativeIndex === 0) {
                                        scale = 1.2;
                                        opacity = 1;
                                        translateX = "0";
                                    } else if (relativeIndex === 1) {
                                        translateX = "100%";
                                    } else if (relativeIndex === total - 1) {
                                        translateX = "-100%";
                                    } else {
                                        return null;
                                    }

                                    // Qui analizziamo correttamente type e mediaSrc
                                    let type = "image";
                                    let mediaSrc = "";

                                    if (typeof media === "string") {
                                        mediaSrc = media;
                                    } else if (typeof media === "object" && media !== null) {
                                        mediaSrc = media.src;
                                        type = media.type;
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            className="absolute"
                                            animate={{
                                                scale,
                                                opacity,
                                                x: translateX,
                                                zIndex: relativeIndex == 0 ? 10 : 0,
                                            }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {type === "image" ? (
                                                <Image
                                                    src={mediaSrc}
                                                    alt={`Project image ${idx + 1}`}
                                                    width={100}
                                                    height={6}
                                                    className="rounded-lg border poiter-events-none"
                                                />
                                            ) : type === "video" ? (
                                                <video
                                                    src={mediaSrc}
                                                    width={140}
                                                    height={90}
                                                    className="rounded-lg border pointer-events-none"
                                                    autoPlay={relativeIndex === 0}
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : null}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
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
