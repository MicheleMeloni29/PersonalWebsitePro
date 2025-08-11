// app/provider.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import Galaxy from './components/backgroundReactBits';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            enableSystem={false}>
            <Galaxy />
            {/* children components */}
            {children}
        </ThemeProvider>
    );
}
