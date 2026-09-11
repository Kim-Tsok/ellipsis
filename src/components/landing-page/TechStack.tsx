'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const techs = [
  { name: 'Next.js 15', desc: 'Latest React framework with App Router' },
  { name: 'React 19', desc: 'Latest React with Server Components' },
  { name: 'TypeScript', desc: 'Type-safe development' },
  { name: 'PostgreSQL', desc: 'Robust relational database' },
  { name: 'Prisma ORM', desc: 'Type-safe database access' },
  { name: 'BetterAuth.js', desc: 'Authentication for Next.js' },
  { name: 'Brevo Email', desc: 'Transactional email service' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling' },
];

export function TechStack() {
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setIsAutoPlay(true);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const duplicatedTechs = [...techs, ...techs];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-accent/5 absolute -right-48 bottom-1/3 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container mx-auto max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-foreground mb-4 text-4xl font-bold text-balance md:text-5xl">
            Modern Tech Stack
          </h2>
          <p className="text-foreground/60 mx-auto max-w-2xl text-lg">
            Built with the latest technologies and best practices for
            production-ready applications.
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          {/* Left gradient fade */}
          <div className="from-background via-background/80 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-32 bg-gradient-to-r to-transparent" />

          {/* Right gradient fade */}
          <div className="from-background via-background/80 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-32 bg-gradient-to-l to-transparent" />

          <motion.div
            className="flex gap-6 py-2"
            animate={{ x: isAutoPlay ? -1600 : 0 }}
            transition={{
              duration: 20,
              repeat: isAutoPlay ? Number.POSITIVE_INFINITY : 0,
              ease: 'linear',
            }}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {duplicatedTechs.map((tech, index) => (
              <motion.div
                key={index}
                className="min-w-max flex-shrink-0"
                whileHover={{ y: -4 }}
              >
                <div className="group border-border/60 bg-card/50 hover:border-border/80 relative min-w-80 rounded-2xl border p-6 shadow-xl backdrop-blur-sm transition-all duration-300">
                  <div className="relative">
                    <h3 className="text-foreground mb-2 text-xl font-semibold">
                      {tech.name}
                    </h3>
                    <p className="text-foreground/60">{tech.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
