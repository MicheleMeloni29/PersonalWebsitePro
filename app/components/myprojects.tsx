'use client';

import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useDragControls, useMotionValue } from 'framer-motion';

const projects = [
    {
        title: 'Il Mio Orto',
        short: 'Project carried out in a team with two colleagues to complete the practical part of the course "Human-machine interaction"',
        full: 'We had the task of designing and creating an android application using the Java language. So we decided to create an application that would allow users to organize their own small vegetable garden at home and keep it under control even remotely with various humidity sensors and remote irrigation device. The login is managed so that every time the user wants to log in, he must first register by filling in the mandatory fields. Once the data is stored, the user can log in. The home page shows the user the state of the sensors and the possibility to irrigate the garden. The application also allows you to add new plants, view the history of irrigation and sensor data, and receive notifications when the plants need attention. The project was a great opportunity to apply our knowledge of Java and Android development, as well as to work collaboratively in a team.',
        images: ['/IlMioOrto/Start.png',
            '/IlMioOrto/Login.png',
            '/IlMioOrto/Signin.png',
            '/IlMioOrto/Home.png'],
    },
    {
        title: 'Frogger',
        short: 'Video game created in C with lncurses library for the course "Operative Systems" with a colleague',
        full: 'This is a video game created in C using the lncurses library, which allows for the creation of text-based user interfaces. The game is inspired by the classic Frogger game, where the player must navigate a frog across a busy road and a river filled with obstacles. The player controls the frog using the arrow keys to move up, down, left, or right. The goal is to reach the other side of the screen without getting hit by cars or falling into the water. The game features a simple scoring system, where the player earns points for successfully crossing the road and river. The game ends when the player either reaches the goal or loses all their lives.',
        images: [
            { type: 'video', src: '/Frogger/Video.mp4' },
        ],
    },
    {
        title: 'WeatherApp',
        short: 'App developed in React Native and tested with Expo on local weather forecasts and added locations',
        full: " I developed this app with the goal of getting started with API calls and geolocation. So I created this app that lets you view weather forecasts(using APIs provided by openWeatherMap). Users can register, which will log them into the database and then log in and open their own session, which will store their settings and the locations they've chosen for the forecast. By default, you always have the weather forecast card for the device's current location. If you want to see weather forecasts for other locations, you can use the dedicated screen to search for the location of your choice or search for it on the maps and insert it.You will then have a new card on the home screen with a new location and its weather forecast.",
        images: [
            'WeatherApp/welcomeLight.png',
            'WeatherApp/welcomeUncompleteLight.png',
            'WeatherApp/welcomeDark.png',
            'WeatherApp/registerEmptyLight.png',
            'WeatherApp/regiterErrorLight.png',
            'WeatherApp/registerLightOk.png',
            'WeatherApp/registerDark.png',
            'WeatherApp/homeLight.png',
            'WeatherApp/homeLight+.png',
            'WeatherApp/homeDark.png',
            'WeatherApp/addLocationLight1.png',
            'WeatherApp/addLocationLight2.png',
            'WeatherApp/addLocationLight3.png',
            'WeatherApp/addLocationDark.png',
            'WeatherApp/settingsLight.png',
            'WeatherApp/settingsDark.png',
        ]
    },
];

export default function Projects() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Monitor window size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
        >
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-red-800 text-center">
                My Projects
            </h2>

            {/* Main container */}
            <div className="relative w-full max-w-7xl flex items-center justify-center">
                {/* Left Arrow - Hidden on mobile */}
                {!isMobile && (
                    <button
                        onClick={handlePrevProject}
                        className="absolute left-2 lg:left-4 z-20 p-3 text-red-500 hover:text-red-700 transition-all rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Previous project"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                )}

                {/* Project Card Container */}
                <div className="w-full max-w-4xl mx-auto">
                    <div
                        className="w-full min-h-[70vh] sm:min-h-[60vh] flex flex-col items-center justify-center 
                        bg-[#5e5e5ec5] dark:bg-[#696969b9] p-4 sm:p-6 lg:p-8 rounded-2xl 
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_6px_rgba(0,0,0,0.6),_0_10px_15px_rgba(0,0,0,0.3)] 
                        border border-[#3d3d3d] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-shadow duration-500"
                    >
                        {/* Project Content */}
                        <div className="flex flex-col items-center w-full max-w-3xl text-center space-y-6">
                            {/* Project Title */}
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mb-2">
                                {projects[currentIndex].title}
                            </h3>

                            {/* Project Description */}
                            <div className="relative w-full">
                                <div className="text-sm sm:text-base text-red-700 max-h-32 sm:max-h-40 overflow-y-auto pr-2 transition-all duration-500 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-transparent">
                                    {expanded ? projects[currentIndex].full : projects[currentIndex].short}
                                </div>
                                {!expanded && (
                                    <button
                                        onClick={() => setExpanded(true)}
                                        className="mt-3 text-red-600 underline text-xs sm:text-sm hover:text-red-800 transition-colors"
                                    >
                                        Read more
                                    </button>
                                )}
                            </div>

                            {/* Image/Video Carousel */}
                            <div className="w-full flex flex-col items-center space-y-4">
                                <motion.div
                                    className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl overflow-hidden cursor-grab active:cursor-grabbing"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.1}
                                    onDragEnd={(event, info) => {
                                        if (Math.abs(info.offset.x) > 50) {
                                            if (info.offset.x > 50) {
                                                handleImageSwipe('right');
                                            } else if (info.offset.x < -50) {
                                                handleImageSwipe('left');
                                            }
                                        }
                                    }}
                                    whileTap={{ cursor: "grabbing" }}
                                >
                                    <div className="flex items-center justify-center relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
                                        {projects[currentIndex].images.map((media, idx) => {
                                            const total = projects[currentIndex].images.length;
                                            const relativeIndex = (idx - imageIndex + total) % total;

                                            let scale = 0.7;
                                            let opacity = 0.4;
                                            let translateX = "-100%";
                                            let zIndex = 0;

                                            if (relativeIndex === 0) {
                                                scale = 1;
                                                opacity = 1;
                                                translateX = "0";
                                                zIndex = 10;
                                            } else if (relativeIndex === 1) {
                                                translateX = "80%";
                                                scale = 0.8;
                                                opacity = 0.6;
                                            } else if (relativeIndex === total - 1) {
                                                translateX = "-80%";
                                                scale = 0.8;
                                                opacity = 0.6;
                                            } else {
                                                return null;
                                            }

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
                                                    className="absolute flex items-center justify-center"
                                                    animate={{
                                                        scale,
                                                        opacity,
                                                        x: translateX,
                                                        zIndex,
                                                    }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    {type === "image" ? (
                                                        <div className="relative max-w-full max-h-full flex items-center justify-center">
                                                            <Image
                                                                src={mediaSrc}
                                                                alt={`${projects[currentIndex].title} screenshot ${idx + 1}`}
                                                                width={400}
                                                                height={300}
                                                                className="rounded-lg border border-gray-300 dark:border-gray-600 
                                                                         max-w-full max-h-full object-contain 
                                                                         w-auto h-auto
                                                                         shadow-lg"
                                                                style={{
                                                                    maxWidth: isMobile ? '280px' : '400px',
                                                                    maxHeight: isMobile ? '200px' : '300px'
                                                                }}
                                                                sizes="(max-width: 640px) 280px, 400px"
                                                                priority={relativeIndex === 0}
                                                                quality={90}
                                                            />
                                                        </div>
                                                    ) : type === "video" ? (
                                                        <video
                                                            src={mediaSrc}
                                                            className="rounded-lg border border-gray-300 dark:border-gray-600 
                                                                     object-contain shadow-lg
                                                                     max-w-full max-h-full"
                                                            style={{
                                                                maxWidth: isMobile ? '280px' : '400px',
                                                                maxHeight: isMobile ? '200px' : '300px',
                                                                width: 'auto',
                                                                height: 'auto'
                                                            }}
                                                            autoPlay={relativeIndex === 0}
                                                            muted
                                                            loop
                                                            playsInline
                                                            controls={relativeIndex === 0}
                                                        />
                                                    ) : null}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Image Navigation Dots */}
                                {projects[currentIndex].images.length > 1 && (
                                    <div className="flex space-x-2">
                                        {projects[currentIndex].images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setImageIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === imageIndex
                                                    ? 'bg-red-600 w-6'
                                                    : 'bg-red-300 hover:bg-red-400'
                                                    }`}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Mobile Navigation Buttons */}
                                {isMobile && (
                                    <div className="flex space-x-8 mt-4">
                                        <button
                                            onClick={handlePrevProject}
                                            className="p-3 text-red-500 hover:text-red-700 transition-all rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                            aria-label="Previous project"
                                        >
                                            <FaChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={handleNextProject}
                                            className="p-3 text-red-500 hover:text-red-700 transition-all rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                            aria-label="Next project"
                                        >
                                            <FaChevronRight size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Drag instruction text */}
                                <div className="text-xs text-red-400 opacity-70 mt-2">
                                    {isMobile ? "Swipe to navigate images" : "Drag to navigate images"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Arrow - Hidden on mobile */}
                {!isMobile && (
                    <button
                        onClick={handleNextProject}
                        className="absolute right-2 lg:right-4 z-20 p-3 text-red-500 hover:text-red-700 transition-all rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Next project"
                    >
                        <FaChevronRight size={20} />
                    </button>
                )}
            </div>
        </section>
    );
}