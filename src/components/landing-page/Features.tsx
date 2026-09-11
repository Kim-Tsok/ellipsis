'use client';

import { motion } from 'framer-motion';
import { Lock, Mail, Cloud, Zap } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Secure Authentication',
    description:
      'High security with bcrypt hashing and secure session management',
  },
  {
    icon: Mail,
    title: 'Email Services',
    description:
      'Built-in email verification, password reset, and transactional emails via Brevo',
  },
  {
    icon: Cloud,
    title: 'Multi-Provider OAuth',
    description:
      'Google, GitHub, Discord and Twitter OAuth support out of the box for seamless authentication',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built on Next.js 15 with Turbopack for instant page loads and optimal performance',
  },
];

export function Features() {
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
        <div className="bg-primary/5 absolute top-1/2 left-1/3 h-64 w-64 rounded-full blur-3xl" />
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
            Professional-grade features
          </h2>
          <p className="text-foreground/60 mx-auto max-w-2xl text-lg">
            Everything built-in. No configuration nightmares. Just secure,
            scalable authentication.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -4 }}
              >
                <div className="border-border/60 bg-card/50 hover:border-border/80 shadow-card/20 hover:shadow-card/40 relative h-full rounded-2xl border p-8 shadow-lg backdrop-blur-sm transition-all duration-300">
                  <div className="bg-primary/20 border-primary/30 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border">
                    <Icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
