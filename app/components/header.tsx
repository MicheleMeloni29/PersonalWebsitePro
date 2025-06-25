'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  FaHome,
  FaUser,
  FaClock,
  FaProjectDiagram,
  FaEnvelope,
  FaSun
} from 'react-icons/fa';

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const links = [
    { href: '#hero', icon: <FaHome /> },
    { href: '#about', label: 'About', icon: <FaUser /> },
    { href: '#timeline', label: 'Timeline', icon: <FaClock /> },
    { href: '#projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { href: '#contact', label: 'Contact', icon: <FaEnvelope /> },
  ];

  return (
    <header
      className={`fixed ${isMobile ? 'bottom-14' : 'top-8'} left-1/2 -translate-x-1/2 z-50`}
    >
      <nav className="
        flex gap-4 px-4 py-2
          bg-gradient-to-br from-[#e2e2e2] to-[#b1b1b1]
          dark:from-[#111111] dark:to-[#0d0d0d]
          rounded-full border border-red-800
          shadow-[0_4px_6px_rgba(0,0,0,0.4)] backdrop-blur-md"
      >
        {links.map(({ href, label, icon }) => (
          <a
            key={href}
            href={href}
            className="
              flex items-center gap-2 px-3 py-1
              rounded-md transition-all duration-300 hover:scale-105
              hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]
            text-red-900 dark:text-white"
          >
            {React.cloneElement(icon, {
              className: `text-lg text-red-900 dark:text-white`
            })}
            {!isMobile && (
              <span className="text-sm font-medium">{label}</span>
            )}
          </a>
        ))}

        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            flex items-center gap-2 px-3 py-1
            rounded-md transition-all duration-300 hover:scale-105
            hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]"
        >
          <FaSun className="text-lg" />
          {!isMobile && (
            <span className="text-sm font-medium">
              {theme === 'light' ? '' : ''}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
