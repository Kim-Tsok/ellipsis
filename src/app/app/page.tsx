'use client';

import { DotPanel } from '@/components/app/DotPanel';
import { CaptureBar } from '@/components/app/CaptureBar';
import { motion } from 'framer-motion';

export default function AppGraphPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <DotPanel>
        
        {/* Placeholder for the Graph Nodes */}
        <div className="relative flex h-full w-full flex-1 items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="font-instrument-serif text-3xl text-gray-400">
              Your graph is empty.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Capture a ping to get started.
            </p>
          </motion.div>
        </div>

        <CaptureBar />
      </DotPanel>
    </div>
  );
}
