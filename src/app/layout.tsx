import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { Providers } from '../app/providers';
import { Toaster } from 'sonner';
import { APP_NAME } from '@/lib/constants/site';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description:
    'Capture half-formed ideas as they come. Ellipsis connects your fragments and nudges you to finish the ones that matter.',
  keywords: ['second brain', 'notes', 'ideas', 'graph', 'Ellipsis'],
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: `${APP_NAME}`,
    description:
      'A second brain that tidies your thoughts for you, instead of making you do it upfront.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
