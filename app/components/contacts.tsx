'use client';

import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

export default function Contact() {
    return (
        <section
            id="contact"
            className="min-h-[calc(100vh-64px-40px)] flex items-center justify-center px-6 text-white"
        >
            <div className="text-center max-w-2xl transition-all duration-700 ease-in-out">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-800">Let's get in touch</h2>
                <p className="text-lg text-red-700 mb-6">
                    I'm always open to new opportunities, collaborations or just a chat about tech.
                </p>

                <div className="flex justify-center gap-6 mt-8 text-2xl">
                    <a
                        href="https://github.com/MicheleMeloni29"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="hover:text-red-600 transition duration-300"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="mailto:melonimichelee29@gmail.com"
                        rel="noopener noreferrer"
                        aria-label="Mail"
                        className="hover:text-red-600 transition duration-300"
                    >
                        <FaEnvelope />
                    </a>
                    <a
                        href="https://linkedin.com/in/michele-meloni-210a1a281/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-red-600 transition duration-300"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://www.instagram.com/michelemelonii/"
                        target="_blank"
                        aria-label="Instagram"
                        className="hover:text-red-600 transition duration-300"

                    >
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </section>
    );
}
