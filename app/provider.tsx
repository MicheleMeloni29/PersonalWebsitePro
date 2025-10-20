'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './components/data/LanguageProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
        >
            <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
    );
}
