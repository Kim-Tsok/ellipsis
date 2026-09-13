'use client';

import { useState } from 'react';
import { Mic, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from '@/lib/animations';

export function CaptureBar() {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    // Animate the submission here (to be implemented later)
    console.log('Captured:', value);
    setValue('');
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.32, 0.72, 0, 1] as const }}
      className="absolute bottom-8 left-1/2 z-20 flex w-full max-w-lg -translate-x-1/2 items-center rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-lg backdrop-blur-md transition-shadow duration-300 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-[#4FA1AF]/20"
    >
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <input
          type="text"
          placeholder="Capture a thought..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent px-4 font-instrument-serif text-xl outline-none placeholder:text-gray-400"
        />
        
        <AnimatePresence mode="popLayout">
          {value.trim().length > 0 ? (
            <motion.button
              key="submit"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={TRANSITIONS.microInteraction}
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={TRANSITIONS.microInteraction}
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4FA1AF]/10 text-[#4FA1AF] transition-colors hover:bg-[#4FA1AF]/20"
            >
              <Mic className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
