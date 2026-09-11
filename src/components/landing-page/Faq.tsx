'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is the template production-ready?',
    answer:
      'Yes, absolutely. The template includes security best practices, proper error handling, and is designed to be deployed to production immediately after setting up necessary services. It includes bcrypt password hashing, secure session management, and CSRF protection.',
  },
  {
    question: 'Can I use this with my own database?',
    answer:
      'Yes. the template comes pre-configured for Neon PostgreSQL and Prisma ORM. The ORM and database configuration can be customized for your needs.',
  },
  {
    question: 'What about OAuth providers other than Google and GitHub?',
    answer:
      'The template uses BetterAuth.js which supports 50+ OAuth providers. Out of the box, it supports Google, GitHub, Discord, and Twitter. Adding additional providers is as simple as adding a few lines of code.',
  },
  {
    question: 'How do I customize the email templates?',
    answer:
      'Email templates are stored in the codebase and can be fully customized. The template comes with default verification and password reset email templates that can be modified to match your branding.',
  },
  {
    question: 'Can I use this for commercial projects?',
    answer:
      'Absolutely. The template is open-source and free to use for both personal and commercial projects. No attribution required, no license fees.',
  },
];

export function FAQ() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="px-4 py-20 md:py-32">
      <motion.div
        className="container mx-auto max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold text-balance md:text-5xl">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div variants={containerVariants}>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="border-border/40 data-[state=open]:bg-card/40 rounded-xl border px-6 backdrop-blur-sm transition-colors"
                >
                  <AccordionTrigger className="hover:text-primary text-left font-semibold transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
