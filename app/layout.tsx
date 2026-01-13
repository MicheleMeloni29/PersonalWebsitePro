import Header from './components/header';
import Providers from './provider';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Michele Meloni',
  description: 'Portfolio of a frontend and mobile developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-full overflow-x-hidden">
        <Providers>
          <div className="relative z-10 flex flex-col h-screen">
            <header className="sticky top-0 z-20">
              <Header />
            </header>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

