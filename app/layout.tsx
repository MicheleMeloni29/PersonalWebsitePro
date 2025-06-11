import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from '../components/header';
import Footer from '../components/footer';

export const metadata = {
  title: 'Michele Meloni',
  description: 'Portfolio of a frontend and mobile developer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d0d0d] text-white">
        <div className="flex flex-col h-screen">
          <header className="sticky top-0 z-50">
            <Header />
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>

        </div>
      </body>
    </html>
  );
}
