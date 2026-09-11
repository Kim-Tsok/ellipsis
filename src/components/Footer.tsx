'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { APP_NAME } from '@/lib/constants/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Security', href: '#security' },
        { label: 'Roadmap', href: '#roadmap' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API Reference', href: '#api' },
        {
          label: 'GitHub',
          href: 'https://github.com/jhn322/better-auth-template',
        },
        { label: 'Community', href: '#community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Contact', href: '#contact' },
        { label: 'Careers', href: '#careers' },
      ],
    },
  ];

  return (
    <footer className="bg-card/30 border-border/60 w-full border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          className="flex flex-col space-y-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-lg font-bold">
                  N
                </span>
              </div>
              <h3 className="text-xl font-bold">{APP_NAME}</h3>
            </div>
            <p className="text-foreground/60 max-w-sm">
              Production-ready authentication for Next.js applications. Ship
              faster with security built-in.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="https://github.com/jhn322/better-auth-template"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <Separator className="bg-border/40" />

          {/* Links Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h4 className="mb-4 font-semibold">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-foreground/60 hover:text-primary text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="bg-border/40" />

          {/* Bottom Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-foreground/60 text-sm">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-foreground/60 hover:text-primary text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-foreground/60 hover:text-primary text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
