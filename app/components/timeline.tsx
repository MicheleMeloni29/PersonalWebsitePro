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
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .map((entry) => ({
                        index: Number(entry.target.getAttribute('data-index')),
                        ratio: entry.intersectionRatio,
                    }));

                if (visible.length > 0) {
                    const mostVisible = visible.reduce((prev, curr) => (curr.ratio > prev.ratio ? curr : prev));
                    setVisibleIndex(mostVisible.index);
                }
            },
            {
                root: null,
                rootMargin: '-20% 0% -20% 0%', // Focus al centro dello schermo
                threshold: [0.3, 0.6, 1],
            }
        );

        itemsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="timeline"
            className="min-h-[calc(100vh-64px-40px)] flex items-center justify-center px-6 pb-32 pt-26"
        >
            <div className="relative max-w-2xl w-full">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-800">My Journey</h2>

                <div className="relative border-l border-red-800 pl-6 space-y-12 max-w-2xl min-h-[150vh] ">


                    {/* Timeline items */}
                    {timelineData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            data-index={idx}
                            ref={(el) => { itemsRef.current[idx] = el; }}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            animate={{
                                scale: visibleIndex === idx ? 1.05 : 1,
                                opacity: visibleIndex === idx ? 1 : 0.6,
                              }}
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
