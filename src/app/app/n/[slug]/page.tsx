'use client';

import { useState } from 'react';
import { DotPanel } from '@/components/app/DotPanel';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NoteEditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Saving note...', { title, content });
    // AI clustering / embedding logic to be wired up here
  };

  return (
    <div className="flex h-full w-full flex-col">
      <DotPanel>
        <div className="relative z-10 flex h-full w-full flex-col px-12 py-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/app/notes" 
              className="flex items-center gap-2 text-[#8a8a8a] transition-colors hover:text-[#1a1a1a]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Notes</span>
            </Link>
            
            <ButtonPrimary onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm">
              <Save className="h-4 w-4" />
              <span>Save Note</span>
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
            
            <textarea
              placeholder="Start typing your structured thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 resize-none bg-transparent text-lg text-[#4a4a4a] outline-none placeholder:text-gray-300 leading-relaxed"
            />
          </motion.div>
        </div>
      </DotPanel>
    </div>
  );
}
