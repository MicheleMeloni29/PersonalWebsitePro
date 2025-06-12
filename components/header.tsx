'use client';

import { useEffect, useState } from 'react';
import {
  FaUser,
  FaClock,
  FaProjectDiagram,
  FaEnvelope,
} from 'react-icons/fa';

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const links = [
    { href: '#about', label: 'About', icon: <FaUser /> },
    { href: '#timeline', label: 'Timeline', icon: <FaClock /> },
    { href: '#projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { href: '#contact', label: 'Contact', icon: <FaEnvelope /> },
  ];

  return (
    <header
      className={`fixed ${
        isMobile ? 'bottom-12' : 'top-4'
      } left-1/2 -translate-x-1/2 z-50`}
    >
          <nav className="flex gap-4 px-4 py-2 bg-[#0d0d0d] text-[#cccccc] rounded-full border border-red-800 shadow-lg backdrop-blur-md">
        {links.map(({ href, label, icon }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-2 px-3 py-1 rounded-md transition hover:bg-red-800/80"
          >
            <span className="text-lg">{icon}</span>
            {!isMobile && (
              <span className="text-sm font-medium">{label}</span>
            )}
          </a>
        ))}
      </nav>
    </header>
  );
}
