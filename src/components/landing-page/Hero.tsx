'use client';

import { ButtonPrimary } from '@/components/ButtonPrimary';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { TopographicBackground } from '@/components/brand/TopographicBackground';
import { ThoughtOrbit } from '@/components/landing-page/ThoughtOrbit';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/lib/constants/routes';
import { authClient } from '@/lib/auth/auth-client';

export function Hero() {
  const { data: session } = authClient.useSession();
  const ctaHref = session ? PROTECTED_PATHS.APP : AUTH_PATHS.REGISTER;

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      <TopographicBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-12 lg:px-16">
        <header className="flex justify-center pt-2">
          <BrandLogo variant="full" priority className="h-11 w-auto" />
        </header>

        <div className="relative flex flex-1 items-center py-12 lg:py-8">
          <div className="relative z-10 max-w-xl">
            <h1 className="font-instrument-serif text-[2.75rem] leading-[1.05] text-[#1a1a1a] sm:text-5xl lg:text-[4.15rem]">
              Just think...
              <br />
              We’ll handle the rest.
            </h1>
            <p className="font-instrument-serif mt-6 max-w-md text-base leading-relaxed text-[#4a4a4a] sm:text-lg">
              Capture the half-formed ideas, reminders, and fragments that show
              up throughout the day. Ellipsis figures out how they connect, lays
              them out as a graph, and nudges you to finish the ones worth
              keeping.
            </p>
            <div className="mt-8">
              <ButtonPrimary href={ctaHref}>
                {session ? 'Open Ellipsis' : 'Get Started'}
              </ButtonPrimary>
            </div>
          </div>

          <div className="pointer-events-none mt-12 w-full lg:absolute lg:top-1/2 lg:right-[-4%] lg:mt-0 lg:w-[52%] lg:-translate-y-1/2">
            <ThoughtOrbit />
          </div>
        </div>
      </div>
    </section>
  );
}
