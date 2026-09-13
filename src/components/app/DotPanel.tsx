'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function DotPanel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-[#fdfdfd] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
    >
      {/* Dot pattern overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40" 
        style={{
          backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {children}
      </div>
    </motion.div>
  );
}
