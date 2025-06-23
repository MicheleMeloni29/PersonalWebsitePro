'use client';

import { useEffect, useState } from 'react';
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
  const [showIconName, setShowIconName] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Initial check
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
  // This hunctions shows the name of icon if pointer is hovered
  const handleMouseEnter = () => {
    if (isMobile) return;
    setShowIconName(true);
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
    setShowIconName(false);
  };




  const links = [
    { href: '#hero', icon: <FaHome /> },
    { href: '#about', label: 'About', icon: <FaUser /> },
    { href: '#timeline', label: 'Timeline', icon: <FaClock /> },
    { href: '#projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { href: '#contact', label: 'Contact', icon: <FaEnvelope /> },
    { href: '#theme', icon: <FaSun /> }
  ];

  return (
    <header
      className={`fixed ${isMobile ? 'bottom-14' : 'top-8'
        } left-1/2 -translate-x-1/2 z-50`}
    >
      <nav className="flex gap-4 px-1 py-2  bg-gtradient-to-br-from [#111]to-[#0d0d0d] text-[#cccccc] rounded-full border border-red-800 shadow-[0_4px_6px_rgba(255,0,0,0.2),0_1px_3px_rgba(0,0,0,0.4)] ring-1 ring-red-900/50 backdrop-blur-md">
        {links.map(({ href, label, icon }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_15px_rgba(255,0,0,0.4)]"
          >
            <span className="text-lg">{icon}</span>
            {!isMobile && (

              <span className="text-sm font-medium">{label}
              </span>
            )}
          </a>
        ))}
      </nav>
    </header>
  );
}
