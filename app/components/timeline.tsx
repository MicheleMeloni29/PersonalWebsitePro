'use client';

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Timeline data
const timelineData = [
    {
        year: "2018 June",
        title: "Diploma",
        description: "I obtained my diploma at IIS 'Diongi Scano - Ottone Bacaredda' in Cagliari, Italy.",
    },
    {
        year: "2018 July-",
        title: "First Job",
        description: "I spent the summer working as a driver for a rental car company",
    },
    {
        year: "2018 October-2024 June",
        title: "Driver",
        description: "I started working as a driver for a local pizzeria.",
    },
    {
        year: "2019 January-2019 May",
        title: "Smartphone Technician",
        description: "I worked in an electronics repair shop, mainly fixing smartphones and providing customer support.",
    },
    {
        year: "2020 September",
        title: "Start informatics Studies",
        description: "I enrolled in the 'Informatics' course at the University of Cagliari, Italy.",
    },
    {
        year: "2021",
        title: "Coding bases",
        description: "I started learning the basics of coding, with C language",
    },
    {
        year: "2022",
        title: "First mobile/web development",
        description: "Learn Java and started developing Android applications and HTML/CSS for webpages.",
    },
    {
        year: "2023",
        title: "Start passion for web and mobile development",
        description: "Learnt backend basics and discovered mobile technologies like Flutter and React Native.",
    },
    {
        year: "2024",
        title: "Development Passion",
        description: "Develop applications with React Native, learn Django and Next.js for full-stack development.",
    },
];

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const sectionHeight = rect.height;
            const sectionTop = rect.top;

            const visibleStart = Math.max(0, viewportHeight - sectionTop);
            const totalScrollable = sectionHeight + viewportHeight;
            const progress = Math.min(Math.max(visibleStart / totalScrollable, 0), 1);

            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // run once on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id="timeline"
            className="min-h-[calc(100vh-64px-40px)] flex items-center justify-center px-6 pb-32  text-white "
        >
            <div className="relative pt-28 max-w-2xl w-full" ref={containerRef}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-800">My Journey</h2>

                <div className="relative border-l border-red-800 pl-6 space-y-12 max-w-2xl min-h-[150vh] ">


                    {/* Timeline items */}
                    {timelineData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="relative"
                        >
                            <p className="text-sm text-red-900">{item.year}</p>
                            <h3 className="text-lg font-bold text-red-600">{item.title}</h3>
                            <p className="text-base text-red-900">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
