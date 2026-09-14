'use client';

import { useState, useEffect } from 'react';
import { DotPanel } from '@/components/app/DotPanel';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { getNotes } from '@/app/actions/notes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
}

export default function NotesIndexPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes || []);
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotes();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <DotPanel>
        <div className="relative z-10 flex min-h-full w-full flex-col px-12 pt-12 pb-12">
          <div className="sticky top-0 z-20 mb-8 flex items-center justify-between bg-white/80 pt-12 backdrop-blur-sm">
            <h1 className="font-instrument-serif text-4xl text-[#1a1a1a]">
              Your Notes
            </h1>
            <Link href="/app/notes/new">
              <ButtonPrimary className="flex items-center gap-2 px-4 py-2 text-sm">
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </ButtonPrimary>
            </Link>
          </div>

          <div className="min-h-0 flex-1 pr-4">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : notes.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <p className="font-instrument-serif text-2xl text-gray-400">
                  No notes yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Create your first note to get started.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {notes.map((note) => (
                  <Link
                    href={`/app/notes/${note.id}`}
                    key={note.id}
                    className="group flex h-56 cursor-pointer flex-col justify-between rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-[#4FA1AF]/30 hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-instrument-serif line-clamp-1 text-2xl text-[#1a1a1a] transition-colors group-hover:text-[#4FA1AF]">
                        {note.title}
                      </h3>
                      <div className="note-card-markdown mt-2 h-24 overflow-hidden text-sm text-[#687577]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100/60 pt-3 text-xs text-gray-400">
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </DotPanel>
    </div>
  );
}
