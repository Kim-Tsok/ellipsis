'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { TopographicBackground } from '@/components/brand/TopographicBackground';
import { ButtonPrimary } from '@/components/ButtonPrimary';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6">
      <TopographicBackground />

      {/* Brand header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <BrandLogo variant="full" className="h-9 w-auto" />
      </div>

      {/* Centre content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Orbital decorative ring */}
        <div className="relative mb-10 flex h-[180px] w-[180px] items-center justify-center">
          <svg
            viewBox="0 0 180 180"
            className="absolute inset-0 h-full w-full animate-[spin_30s_linear_infinite]"
            aria-hidden
          >
            <defs>
              <path
                id="ring"
                d="M90,90 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
              />
            </defs>
            <text
              fontSize="11"
              fill="#9aa3a6"
              letterSpacing="2"
              className="font-instrument-serif"
            >
              <textPath href="#ring">
                not found · lost in the ether · page missing · 404 · gone ·&nbsp;
              </textPath>
            </text>
          </svg>

          {/* Centre dot cluster */}
          <div className="flex gap-1.5">
            {[0, 0.15, 0.3].map((delay) => (
              <motion.div
                key={delay}
                className="h-2.5 w-2.5 rounded-full bg-[#4FA1AF]"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>

        <h1
          className="font-instrument-serif text-[4.5rem] leading-[1] text-[#1a1a1a] sm:text-[5.5rem]"
          aria-label="Page not found"
        >
          404
        </h1>

        <p className="font-instrument-serif mt-4 max-w-xs text-[1.1rem] leading-relaxed text-[#4a4a4a] sm:text-[1.2rem]">
          This thought got away. <br /> It doesn&apos;t live here anymore.
        </p>

        <div className="mt-10">
          <ButtonPrimary href="/">Back to Ellipsis</ButtonPrimary>
        </div>

        <p className="mt-6 text-sm text-[#9aa3a6]">
          Or{' '}
          <Link
            href="/app"
            className="underline underline-offset-4 transition-colors hover:text-[#4FA1AF]"
          >
            open the app
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
