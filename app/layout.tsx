// app/layout.tsx
import Header from './components/header';
import Providers from './provider';
import '../styles/globals.css';

// Exported metadata object used by Next.js for setting page title and description (SEO)
export const metadata = {
  title: 'Michele Meloni',
  description: 'Portfolio of a frontend and mobile developer',
};
/**
 * RootLayout is the main layout component that wraps all pages and provides global structure.
 * @param children - The page content to render within the layout.
 */
      {/* the body remains a server component */}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* il body resta un server component */}
      <body className="relative overflow-x-hidden">
        {/* qui avvolgiamo in client wrapper */}
        <Providers>
          <div className="relative z-10 flex flex-col h-screen">
            <header className="sticky top-0 z-20">
              <Header />
            </header>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
