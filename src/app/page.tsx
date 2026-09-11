import { Hero } from '../components/landing-page/Hero';
import { Features } from '../components/landing-page/Features';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants/site';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: `${APP_NAME}`,
};

export default function Home() {
  return (
    <main id="main-content" className="bg-white">
      <Hero />
      <Features />
    </main>
  );
}
