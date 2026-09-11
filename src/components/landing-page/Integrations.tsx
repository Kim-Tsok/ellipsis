'use client';

import { motion } from 'framer-motion';
import { Database, Mail, Lock, Zap } from 'lucide-react';

const integrations = [
  {
    icon: Database,
    title: 'PostgreSQL Database',
    description:
      'Enterprise-grade database with Prisma ORM for type-safe queries and migrations',
  },
  {
    icon: Mail,
    title: 'Brevo Email Service',
    description:
      'Reliable transactional email delivery for verifications and password resets',
  },
  {
    icon: Lock,
    title: 'BetterAuth.js',
    description:
      'Industry-standard authentication with OAuth providers and secure sessions',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description:
      'Instant session synchronization and authentication state across your app',
  },
];

export function Integrations() {
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
    <section className="px-4 py-20 md:py-32">
      <motion.div
        className="container mx-auto max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold text-balance md:text-5xl">
            Reliable Integrations
          </h2>
          <p className="text-foreground/60 mx-auto max-w-2xl text-lg">
            Built with industry-standard tools and services you already know and
            trusts.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2"
          variants={containerVariants}
        >
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -4 }}
              >
                <div className="border-border/60 bg-card/50 hover:border-border/80 relative rounded-2xl border p-8 shadow-xl backdrop-blur-sm transition-all duration-300">
                  <div className="flex h-full flex-col items-start gap-5">
                    <div className="bg-primary/20 border-primary/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border">
                      <Icon className="text-primary h-6 w-6" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="text-foreground text-xl font-semibold">
                        {integration.title}
                      </h3>
                      <p className="text-foreground/60 leading-relaxed">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
