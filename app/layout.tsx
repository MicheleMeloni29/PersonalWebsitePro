// app/layout.tsx (o src/app/layout.tsx)

import "../styles/globals.css";
import Header from "./components/header";
import AnimatedBackground from "./components/background";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Michele Meloni",
  description: "Frontend Developer Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden">
        {/* 1) ThemeProvider per next-themes */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* 2) BACKGROUND SVG */}
          <AnimatedBackground />
          {/* 3) CONTENUTS*/}
          <div className="relative z-10 flex flex-col h-screen">
            <header className="sticky top-0 z-20">
              <Header />
            </header>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
