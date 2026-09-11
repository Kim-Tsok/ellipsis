import Image from 'next/image';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { TopographicBackground } from '@/components/brand/TopographicBackground';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <TopographicBackground />

      <header className="relative z-20 flex justify-center pt-8">
        <BrandLogo variant="full" priority className="h-11 w-auto" />
      </header>

      <div className="relative z-10 grid min-h-[calc(100vh-5.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.95fr)]">
        <div className="flex items-center px-8 py-12 sm:px-14 md:px-20 lg:px-24">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="pointer-events-none relative hidden min-h-[420px] lg:block">
          <Image
            src="/gradient-orb.png"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover object-left"
          />
        </div>
      </div>
    </div>
  );
}
