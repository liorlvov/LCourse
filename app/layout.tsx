import type { Metadata, Viewport } from 'next';
import 'katex/dist/katex.min.css';
// Fonts are self-hosted (no requests to Google): Karantina for display, IBM Plex Sans Hebrew for text, Plex Mono for readouts.
import '@fontsource/karantina/700.css';
import '@fontsource/ibm-plex-sans-hebrew/400.css';
import '@fontsource/ibm-plex-sans-hebrew/500.css';
import '@fontsource/ibm-plex-sans-hebrew/700.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'פיזיקה 3 · תנודות וגלים, בלי שהחומר יפחיד',
  description: 'סביבת למידה לפיזיקה 3: כל נושא מתחיל במה הבעיה ולמה זה מעניין, ממשיך באינטואיציה, ורק אז הוכחה צעד אחר צעד. שיעורים 1–4 בחינם.',
  openGraph: {
    title: 'פיזיקה 3 · תנודות וגלים, בלי שהחומר יפחיד',
    description: 'הסברים, הוכחות צעד אחר צעד ותרגילים פתורים. שיעורים 1–4 בחינם.',
    locale: 'he_IL',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3eee4' },
    { media: '(prefers-color-scheme: dark)', color: '#121418' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
