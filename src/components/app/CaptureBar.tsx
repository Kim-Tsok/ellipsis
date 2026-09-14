'use client';

import { useState, useTransition } from 'react';
import { Mic, ArrowUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from '@/lib/animations';
import { IconCircleSurface } from '@/components/ButtonPrimary';
import { createPing } from '@/app/actions/pings';

interface CaptureBarProps {
  // Called after a ping is successfully saved, e.g. so a Pings list
  // on screen can refetch or optimistically prepend the new ping.
  onCaptured?: (ping: { id: string; content: string; createdAt: Date }) => void;
}

export function CaptureBar({ onCaptured }: CaptureBarProps = {}) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = value.trim();
    if (!content || isPending) return;

    setError(null);

    startTransition(async () => {
      try {
        const res = await createPing(content);
        if (res?.success && res.ping) {
          setValue('');
          onCaptured?.(res.ping);
        }
      } catch (err) {
        console.error('Failed to capture ping:', err);
        setError('Could not save that thought. Try again.');
      }
    });
  };

  return (
    <div className="absolute bottom-8 left-1/2 z-20 flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.4,
          ease: [0.32, 0.72, 0, 1] as const,
        }}
        className="flex w-full items-center rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-lg backdrop-blur-md transition-shadow duration-300 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-[#4FA1AF]/20"
      >
        <form onSubmit={handleSubmit} className="flex w-full items-center">
          <input
            type="text"
            placeholder="Capture a thought..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isPending}
            className="font-instrument-serif w-full bg-transparent px-4 text-xl outline-none placeholder:text-gray-400 disabled:opacity-60"
          />

          <AnimatePresence mode="popLayout">
            {isPending ? (
              <motion.div
                key="pending"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={TRANSITIONS.microInteraction}
                className="flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <Loader2 className="h-5 w-5 animate-spin text-[#4FA1AF]" />
              </motion.div>
            ) : value.trim().length > 0 ? (
              <motion.button
                key="submit"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={TRANSITIONS.microInteraction}
                type="submit"
                aria-label="Submit thought"
                className="group shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a] active:scale-95"
              >
                <IconCircleSurface
                  icon={<ArrowUp className="h-5 w-5" />}
                  size={40}
                  tone="dark"
                />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={TRANSITIONS.microInteraction}
                type="button"
                aria-label="Record a thought"
                className="group shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22464d] active:scale-95"
              >
                <IconCircleSurface
                  icon={<Mic className="h-5 w-5" />}
                  size={40}
                  tone="teal"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full bg-white/90 px-3 py-1 text-xs text-red-500 shadow-sm backdrop-blur-md"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
