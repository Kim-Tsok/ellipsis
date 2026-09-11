'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/lib/constants/routes';
import { authClient } from '@/lib/auth/auth-client';

export function Hero() {
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.0, 0.0, 0.2, 1.0] as const },
    },
  };

  return (
    <section className="relative w-full overflow-hidden px-4 py-16 md:py-24 lg:py-32 xl:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-0 right-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent/5 absolute bottom-0 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-40 backdrop-blur-[100px]" />
      </div>

      <motion.div
        className="container mx-auto max-w-5xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main headline */}
        <motion.div variants={itemVariants} className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            <span className="text-foreground">Build Secure</span>
            <br />
            <span className="text-primary">Build Better.</span>
          </h1>

          <p className="text-foreground/70 mx-auto max-w-2xl text-lg text-balance md:text-xl">
            Complete authentication template with Next.js, PostgreSQL, and OAuth
            support. Everything you need to launch secure applications faster.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-row flex-wrap justify-center gap-3 pt-4"
        >
          <Link
            href={
              isAuthenticated
                ? PROTECTED_PATHS.DASHBOARD_BASE
                : AUTH_PATHS.LOGIN
            }
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground group relative overflow-hidden rounded-full px-6 py-3 text-sm shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl md:px-8 md:py-6 md:text-base"
            >
              <span className="relative flex items-center gap-2">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link href={AUTH_PATHS.REGISTER}>
              <Button
                size="lg"
                className="border-primary/40 bg-primary/10 hover:bg-primary/20 text-foreground rounded-full border-2 px-6 py-3 text-sm shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl md:px-8 md:py-6 md:text-base"
              >
                Sign Up Free
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Floating code snippet preview */}
        <motion.div
          variants={itemVariants}
          className="pt-12"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="bg-card/80 border-border/50 shadow-card/20 mx-auto max-w-2xl rounded-2xl border p-1 shadow-2xl backdrop-blur-xl">
            <div className="bg-background/40 overflow-hidden rounded-xl p-6 font-mono text-sm">
              <div className="mb-4 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <pre className="overflow-x-auto text-blue-400">
                <code>{`// One command to get started
npx create-next-app@latest --auth-template

// Full authentication included
- Email/Password Auth
- OAuth (Google & GitHub)
- Email Verification
- Password Reset`}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
