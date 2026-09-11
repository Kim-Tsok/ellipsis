import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../app/providers';
import { Toaster } from 'sonner';
import { APP_NAME } from '@/lib/constants/site';
import PageWrapper from '@/components/PageWrapper';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Next.js Better Auth Template`,
  description: `${APP_NAME} is a Next.js Better Auth Template`,
  keywords: ['Next.js', 'Authentication', 'Postgres', 'Template'],
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: `${APP_NAME} | Next.js Better Auth Template`,
    description: `${APP_NAME} is a Next.js Better Auth Template`,
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
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <PageWrapper>{children}</PageWrapper>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
