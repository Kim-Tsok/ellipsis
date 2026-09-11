'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const advantages = [
  {
    title: '99% Success Rate',
    description:
      'Proven authentication system trusted by thousands of developers',
  },
  {
    title: '128+ Plugins',
    description: 'Extensive ecosystem of integrations and extensions',
  },
  {
    title: '40 Million Users',
    description: 'Powering authentication for millions of active users',
  },
  {
    title: '98% Performance',
    description:
      'Lightning-fast authentication with optimized database queries',
  },
];

export function AdvantagesShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-1/4 left-1/2 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container mx-auto max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold text-balance md:text-5xl">
            Unlock Proven Advantages
          </h2>
          <p className="text-foreground/60 mx-auto max-w-2xl text-lg">
            Modern features with proven reliability and performance.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2"
          variants={containerVariants}
        >
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -4 }}
            >
              <div className="border-border/60 bg-card/50 hover:border-border/80 relative rounded-2xl border p-8 shadow-xl backdrop-blur-sm transition-all duration-300">
                <div className="mb-4 flex items-start gap-4">
                  <div className="bg-primary/20 border-primary/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border">
                    <CheckCircle2 className="text-primary h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground mb-2 text-2xl font-semibold">
                      {advantage.title}
                    </h3>
                  </div>
                </div>
                <p className="text-foreground/60 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
