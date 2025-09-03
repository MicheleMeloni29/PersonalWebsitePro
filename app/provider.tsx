'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './components/UI/LanguageProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"  // o "system" se vuoi seguire il sistema
            enableSystem={true}
        >
            <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
    );
}
