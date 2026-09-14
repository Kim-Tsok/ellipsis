'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DotPanel } from '@/components/app/DotPanel';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createNote } from '@/app/actions/notes';
import { MarkdownEditor } from '@/components/app/MarkdownEditor';

export default function NoteEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    startTransition(async () => {
      try {
        const res = await createNote(title, content);
        if (res?.success) {
          router.push('/app/notes');
        }
      } catch (error) {
        console.error('Failed to save note:', error);
      }
    });
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <DotPanel>
        <div className="relative z-10 flex min-h-full w-full flex-col px-12 py-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/app/notes" 
              className="flex items-center gap-2 text-[#8a8a8a] transition-colors hover:text-[#1a1a1a]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Notes</span>
            </Link>
            
            <ButtonPrimary 
              onClick={handleSave} 
              disabled={isPending || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isPending ? 'Saving...' : 'Save Note'}</span>
            </ButtonPrimary>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-1 flex-col mx-auto w-full max-w-3xl"
          >
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent font-instrument-serif text-5xl text-[#1a1a1a] outline-none placeholder:text-gray-300 mb-8"
            />
            
            <MarkdownEditor value={content} onChange={setContent} />
          </motion.div>
        </div>
      </DotPanel>
    </div>
  );
}
