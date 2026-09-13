import Image from 'next/image';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { TopographicBackground } from '@/components/brand/TopographicBackground';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <TopographicBackground />

      <header className="absolute inset-x-0 top-0 z-20 flex justify-center pt-8">
        <BrandLogo variant="full" priority className="h-11 w-auto" />
      </header>

      {/* Large sweeping gradient orb on the right */}
      <div className="pointer-events-none absolute -right-[35vw] top-1/2 z-0 hidden -translate-y-1/2 h-[140vh] w-[140vh] lg:block">
        <Image
          src="/gradient-orb.png"
          alt=""
          width={9000}
          height={9000}
          priority
          unoptimized
          className="object-contain"
        />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.95fr)]">
        <div className="flex items-center px-8 pt-24 pb-12 sm:px-14 md:px-20 lg:px-24 lg:pt-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="hidden lg:block" />
      </div>
    </div>
  );
}
