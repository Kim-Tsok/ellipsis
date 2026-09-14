'use client';

import { useState, useEffect, useTransition } from 'react';
import { DotPanel } from '@/components/app/DotPanel';
import { CaptureBar } from '@/components/app/CaptureBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, FileText, Trash2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPings, deletePing, convertPingToNote } from '@/app/actions/pings';

interface Ping {
  id: string;
  content: string;
  createdAt: Date | string;
}

function formatTime(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();

  if (sameDay) {
    return d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function PingsIndexPage() {
  const router = useRouter();
  const [pings, setPings] = useState<Ping[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track which ping id is mid-action, and which kind of action, so we
  // can show the right spinner without blocking the rest of the list.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    'note' | 'expand' | 'delete' | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPings() {
      try {
        const fetched = await getPings();
        setPings(fetched || []);
      } catch (err) {
        console.error('Failed to load pings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPings();
  }, []);

  const handleCaptured = (ping: {
    id: string;
    content: string;
    createdAt: Date;
  }) => {
    setPings((prev) => [ping, ...prev]);
  };

  const handleDelete = (id: string) => {
    setError(null);
    setPendingId(id);
    setPendingAction('delete');

    startTransition(async () => {
      try {
        await deletePing(id);
        setPings((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error('Failed to delete ping:', err);
        setError('Could not delete that ping.');
      } finally {
        setPendingId(null);
        setPendingAction(null);
      }
    });
  };

  const handleConvert = (id: string, expand: boolean) => {
    setError(null);
    setPendingId(id);
    setPendingAction(expand ? 'expand' : 'note');

    startTransition(async () => {
      try {
        const res = await convertPingToNote(id);
        if (res?.success && res.noteId) {
          setPings((prev) => prev.filter((p) => p.id !== id));
          router.push(
            expand
              ? `/app/notes/${res.noteId}?expand=1`
              : `/app/notes/${res.noteId}`
          );
        }
      } catch (err) {
        console.error('Failed to convert ping:', err);
        setError('Could not turn that ping into a note.');
        setPendingId(null);
        setPendingAction(null);
      }
    });
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <DotPanel>
        <div className="relative z-10 flex min-h-full w-full flex-col px-12 pt-12 pb-32">
          <div className="sticky top-0 z-20 mb-8 flex items-center justify-between bg-white/80 backdrop-blur-sm">
            <div>
              <h1 className="font-instrument-serif text-4xl text-[#1a1a1a]">
                Pings
              </h1>
              <p className="mt-1 text-sm text-[#8a9495]">
                Quick thoughts, waiting to become something more.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="min-h-0 flex-1">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : pings.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <Zap className="mb-2 h-6 w-6 text-gray-300" />
                <p className="font-instrument-serif text-2xl text-gray-400">
                  No pings yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Drop a thought in the capture bar below to get started.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {pings.map((ping) => {
                    const isThisPending = pendingId === ping.id;

                    return (
                      <motion.div
                        key={ping.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="flex h-48 flex-col justify-between rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-[#4FA1AF]/30 hover:shadow-md"
                      >
                        <div className="min-h-0 flex-1 overflow-hidden">
                          <p className="line-clamp-5 text-sm leading-relaxed whitespace-pre-wrap text-[#3a4344]">
                            {ping.content}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-gray-100/60 pt-3">
                          <span className="text-xs text-gray-400">
                            {formatTime(ping.createdAt)}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleConvert(ping.id, false)}
                              disabled={isPending}
                              title="Save as note"
                              aria-label="Save as note"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a9495] transition-colors hover:bg-[#eef8f9] hover:text-[#1f777f] disabled:opacity-40"
                            >
                              {isThisPending && pendingAction === 'note' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleConvert(ping.id, true)}
                              disabled={isPending}
                              title="Expand into note"
                              aria-label="Expand into note"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a9495] transition-colors hover:bg-[#eef8f9] hover:text-[#1f777f] disabled:opacity-40"
                            >
                              {isThisPending && pendingAction === 'expand' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4 text-[#4FA1AF]" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(ping.id)}
                              disabled={isPending}
                              title="Discard ping"
                              aria-label="Discard ping"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a9495] transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                            >
                              {isThisPending && pendingAction === 'delete' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        <CaptureBar onCaptured={handleCaptured} />
      </DotPanel>
    </div>
  );
}
