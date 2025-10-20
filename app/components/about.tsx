'use client';

import { ComponentPropsWithoutRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import DecryptedText from './UI/DecriptedText';

type AboutProps = ComponentPropsWithoutRef<'section'>;

export default function About({ className, id = 'about', ...sectionProps }: AboutProps) {
    const { ref: sectionRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const [showTypewriter, setShowTypewriter] = useState(false);

    // start typewriter effect when in view
    if (inView && !showTypewriter) {
        setShowTypewriter(true);
    }

    const baseClasses = "min-h-[calc(100vh-64px-40px)] flex items-center justify-center px-6 text-white overflow-x-hidden";

    return (
        <section
            id={id}
            ref={sectionRef}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
        >
            <div className="max-w-3xl text-left">
                <h2 className="text-2xl md:text-4xl font-bold  text-red-800">About Me</h2>

                <AnimatePresence>
                    {showTypewriter && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-base md:text-2xl text-red-900 mb-8 pt-14"
                        > 
                            <span>
                                <DecryptedText
                                    text="Hi, I’m Michele. I started programming in college, and it changed everything."
                                    animateOn="view"              // per mobile è l’opzione migliore
                                    sequential                    // svela un carattere alla volta
                                    revealDirection="start"
                                    speed ={40}                   // velocità di svelamento
                                    encryptedClassName="text-rose-300/80 blur-[0.5px]"
                                />
                            </span>
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {inView && (
                        <motion.p
                            initial={{ opacity: 0, x: 720 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.3, delay: 2.9 }}
                            className="text-base md:text-lg text-red-900 mb-4 leading-relaxed pt-10"
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
                            className="text-base md:text-lg text-red-900 mb-4 leading-relaxed pt-10"
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
