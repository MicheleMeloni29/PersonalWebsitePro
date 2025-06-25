// app/provider.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import AnimatedBackground from './components/background';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}>
            {/* animated background */}
            <AnimatedBackground />
            {children}
        </ThemeProvider>
    );
}
