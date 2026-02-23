'use client';

import { ComponentPropsWithoutRef } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';
import { useLanguage } from './data/LanguageProvider';

type ContactProps = ComponentPropsWithoutRef<'section'>;

export default function Contact({ className, id = 'contact', ...sectionProps }: ContactProps) {
    const { t } = useLanguage();
    const baseClasses = "min-h-[calc(100vh-64px-40px)] flex items-center justify-center px-6 text-white dark:text-red-900";

    return (
        <section
            id={id}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
        >
            <div className="text-center max-w-2xl transition-all duration-700 ease-in-out">
                <h2 className="text-3xl md:text-4xl xl:text-4xl font-bold mb-6 text-red-800">{t("Contacts", "title")}</h2>
                <p className="text-lg text-red-400 mb-6">
                    {t("Contacts", "intro")}
                </p>

                <div className="flex justify-center gap-12 mt-8 text-4xl">
                    <a
                        href="mailto:melonimichelee29@gmail.com"
                        rel="noopener noreferrer"
                        aria-label={t("Contacts", "aria.mail")}
                        className="hover:text-red-600 transition duration-300"
                    >
                        <FaEnvelope />
                    </a>
                    <a
                        href="https://linkedin.com/in/michele-meloni-210a1a281/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("Contacts", "aria.linkedin")}
                        className="hover:text-red-600 transition duration-300"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://www.instagram.com/michelemelonii/"
                        target="_blank"
                        aria-label={t("Contacts", "aria.instagram")}
                        className="hover:text-red-600 transition duration-300"

                    >
                        <FaInstagram />
                    </a>
                </div>
                <p className="text-lg text-red-400 mb-6 pt-8">
                    {t("Contacts", "repoHint")}
                </p>
                <div className="flex justify-center gap-6 mt-8 text-4xl">
                    
                    <a
                        href="https://github.com/MicheleMeloni29"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("Contacts", "aria.github")}
                        className="hover:text-red-600 transition duration-300"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>
        </section>
    );
}
