// app/layout.tsx (o src/app/layout.tsx)

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "./components/header";
import AnimatedBackground from "./components/background";  // <-- importa il componente SVG

export const metadata = {
  title: "Michele Meloni",
  description: "Portfolio of a frontend and mobile developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* rendiamo il body un contenitore relativo, così l’SVG in assoluto sta “dietro” */}
      <body className="relative">
        {/* 1) BACKGROUND SVG */}
        <AnimatedBackground />
        {/* 2) CONTENUTO SOPRA LO SFONDO */}
        <div className="relative z-10 flex flex-col h-screen">
          <header className="sticky top-0 z-20">
            <Header />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
