import { Hero } from '../components/landing-page/Hero';
import { Features } from '../components/landing-page/Features';
import { CodeExamples } from '../components/landing-page/CodeExamples';
import { TechStack } from '../components/landing-page/TechStack';
import { AdvantagesShowcase } from '../components/landing-page/Advantages';
import { Integrations } from '../components/landing-page/Integrations';
import { FAQ } from '../components/landing-page/Faq';
import type { Metadata } from 'next';
// import Form from './form';

export const metadata: Metadata = {
  // * Metadata is inherited from layout.tsx
};

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <header>
        <Hero />
        <Features />
        <CodeExamples />
        <Integrations />
        <TechStack />
        <AdvantagesShowcase />
        <FAQ />
        {/* For testing Neon database connection */}
        {/* <Form /> */}
      </header>
    </main>
  );
}
