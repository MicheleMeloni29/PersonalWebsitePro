// The last section of the page, containing contact information and links to social media profiles and repositories. 
'use client';

import { ComponentPropsWithoutRef } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram, FaFile } from 'react-icons/fa';
import { useLanguage } from './data/LanguageProvider';

// Allows the component to behave like a regular section while accepting extra HTML props.
type ContactProps = ComponentPropsWithoutRef<'section'>;

export default function Contact({ className, id = 'contact', ...sectionProps }: ContactProps) {
    const { t } = useLanguage();
    const baseClasses = "min-h-screen px-6 py-12 text-white dark:text-red-900";

    return (
        <section
            id={id}
            {...sectionProps}
            className={`${baseClasses}${className ? ` ${className}` : ''}`}
        >
            <div className="flex min-h-[calc(100vh-6rem)] flex-col justify-between">
                <div className="flex flex-1 items-center justify-center">
                    <div className="max-w-2xl text-center transition-all duration-700 ease-in-out">
                        <h2 className="mb-6 text-2xl font-bold uppercase text-red-900 md:text-4xl xl:text-4xl">{t("Contacts", "title")}</h2>
                        <p className="mb-6 text-md text-red-500">
                            {t("Contacts", "intro")}
                        </p>

                        <div className="mt-8 flex justify-center gap-12 text-4xl">
                            <a
                                href="mailto:melonimichelee29@gmail.com"
                                rel="noopener noreferrer"
                                aria-label={t("Contacts", "aria.mail")}
                                className="transition duration-300 hover:text-red-700"
                            >
                                <FaEnvelope />
                            </a>
                            <a
                                href="https://linkedin.com/in/michele-meloni-210a1a281/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t("Contacts", "aria.linkedin")}
                                className="transition duration-300 hover:text-red-700"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://www.instagram.com/michelemelonii/"
                                target="_blank"
                                aria-label={t("Contacts", "aria.instagram")}
                                className="transition duration-300 hover:text-red-700"
                            >
                                <FaInstagram />
                            </a>
                        </div><p className="mb-6 pt-8 text-md text-red-500">
                            {t("Contacts", "cvCta")}
                        </p>

                        <div className="mt-8 flex justify-center gap-6 text-4xl">
                            <a
                                href="/cv/Michele_Meloni_CV.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t("Contacts", "aria.cv")}
                                className="transition duration-300 hover:text-red-700"
                            >
                                <FaFile />
                            </a>
                        </div>
                        <p className="mb-6 pt-8 text-md text-red-500">
                            {t("Contacts", "repoHint")}
                        </p>

                        <div className="mt-8 flex justify-center gap-6 text-4xl">
                            <a
                                href="https://github.com/MicheleMeloni29"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t("Contacts", "aria.github")}
                                className="transition duration-300 hover:text-red-700"
                            >
                                <FaGithub />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-10 text-center">
                    <div className="mx-auto mb-4 h-px w-full max-w-xl bg-red-900/35" />
                    <p className="text-xs uppercase tracking-[0.2em] text-red-700">
                        2026 Michele Meloni.
                    </p>
                </div>
            </div>
        </section>
    );
}
