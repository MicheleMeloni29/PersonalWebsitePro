import Header from './components/header';
import Providers from './provider';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

// Global metadata used by Next.js for the default page title and description.
export const metadata = {
  title: 'Michele Meloni',
  description: 'Portfolio of a frontend and mobile developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning avoids noisy mismatches when client-only providers update the initial markup.
    <html lang="en" suppressHydrationWarning>
      <body className="h-full overflow-x-hidden">
        {/* Wraps the app with shared providers such as theme and language context. */}
        <Providers>
          {/* Main application shell with a persistent header and scrollable page content. */}
          <div className="relative z-10 flex flex-col h-screen">
            <header className="sticky top-0 z-20">
              <Header />
            </header>
            {/* Route content is rendered here while the header remains visible. */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
        {/* Vercel Analytics tracks page usage in production. */}
        <Analytics />
      </body>
    </html>
  );
}
