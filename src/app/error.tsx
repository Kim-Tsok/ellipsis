'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { TopographicBackground } from '@/components/brand/TopographicBackground';
import { ButtonPrimary } from '@/components/ButtonPrimary';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Ellipsis Error]', error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6">
      <TopographicBackground />

      {/* Brand header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <BrandLogo variant="full" className="h-9 w-auto" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Animated disrupted dot cluster */}
        <div className="mb-10 flex items-center gap-2">
          {[0, 0.1, 0.2].map((delay, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-[#4FA1AF]"
              animate={{
                y: [0, -10, 4, 0],
                opacity: [1, 0.4, 0.9, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <h1 className="font-instrument-serif text-[3.5rem] leading-[1.05] text-[#1a1a1a] sm:text-[4.5rem]">
          Something broke.
        </h1>

        <p className="font-instrument-serif mt-4 max-w-sm text-[1.05rem] leading-relaxed text-[#4a4a4a]">
          A thought got tangled. This one&apos;s on us — try again or head back.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-[#b0b8bb]">
            ref: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          {/* No href → renders as <button> */}
          <ButtonPrimary onClick={reset}>Try again</ButtonPrimary>

          <a
            href="/"
            className="font-instrument-serif text-sm text-[#9aa3a6] underline underline-offset-4 transition-colors hover:text-[#4FA1AF]"
          >
            Go home
          </a>
        </div>
      </motion.div>
    </main>
  );
}
