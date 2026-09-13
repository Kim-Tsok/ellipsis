'use client';

import { Search, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export function SearchBar() {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="absolute left-1/2 top-8 z-20 flex w-full max-w-md -translate-x-1/2 items-center overflow-hidden rounded-full border border-gray-200 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-md"
    >
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent font-instrument-serif text-xl outline-none placeholder:text-gray-400"
      />
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4FA1AF]/10 text-[#4FA1AF] transition-colors hover:bg-[#4FA1AF]/20">
        <Mic className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
