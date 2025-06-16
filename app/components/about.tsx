'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

export default function About() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const [showTypewriter, setShowTypewriter] = useState(false);

    // start typewriter effect when in view
    if (inView && !showTypewriter) {
        setShowTypewriter(true);
    }


    return (
        <section
            id="about"
            ref={ref}
            className="min-h-[calc(100vh-64px-40px)] flex items-center justify-center px-6 text-white overflow-x-hidden"
        >
            <div className="max-w-3xl text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-800">About Me</h2>

                <AnimatePresence>
                    {showTypewriter && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="text-xl md:text-2xl text-red-900 mb-8"
                        >
                            <Typewriter
                                words={[
                                    'Hi, I’m Michele. I started programming in college, and it changed everything.',
                                ]}
                                cursor
                                cursorStyle="_"
                                typeSpeed={35}
                                delaySpeed={2500}
                                
                            />
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {inView && (
                        <motion.p
                            initial={{ opacity: 0, x: 720 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.3, delay: 2.9 }}
                            className="text-base md:text-lg text-red-900 mb-4 leading-relaxed"
                        >
                            The first lines of code, written just for fun, turned into a passion. I dove deep into
                            mobile and frontend development, discovering React, React Native, TypeScript,
                            JavaScript, and Flutter.
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {inView && (
                        <motion.p
                            initial={{ opacity: 0, x: -720 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.3, delay: 3.2 }}
                            className="text-base md:text-lg text-red-900 mb-4 leading-relaxed"
                        >
                            As a self-taught developer, I built projects, explored backend with Python, and keep
                            learning every day. I code to grow, to solve problems, and to turn ideas into reality.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
