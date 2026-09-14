import { Hero } from '../components/landing-page/Hero';
import { Features } from '../components/landing-page/Features';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants/site';

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
