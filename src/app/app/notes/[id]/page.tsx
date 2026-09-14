'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DotPanel } from '@/components/app/DotPanel';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getNoteById, updateNote, expandNote } from '@/app/actions/notes';
import { MarkdownEditor } from '@/components/app/MarkdownEditor';

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSaving, startSaveTransition] = useTransition();
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    async function loadNote() {
      try {
        const note = await getNoteById(noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
        }
      } catch (error) {
        console.error('Failed to load note:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (noteId) loadNote();
  }, [noteId]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    startSaveTransition(async () => {
      try {
        await updateNote(noteId, title, content);
        router.push('/app/notes');
      } catch (error) {
        console.error('Failed to update note:', error);
      }
    });
  };

  const handleExpand = async () => {
    setIsExpanding(true);
    try {
      // First save current state before expanding, to ensure context is up to date
      await updateNote(noteId, title, content);
      
      const res = await expandNote(noteId);
      if (res?.success && res.content) {
        setExpandedContent(res.content);
      }
    } catch (error) {
      console.error('Failed to expand note:', error);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleAcceptExpansion = () => {
    if (!expandedContent) return;

    startSaveTransition(async () => {
      try {
        await updateNote(noteId, title, expandedContent);
        setContent(expandedContent);
        setExpandedContent(null);
      } catch (error) {
        console.error('Failed to accept expanded note:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col">
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
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExpand}
                disabled={isExpanding || isSaving || !title.trim() || !content.trim()}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#1a1a1a] shadow-sm transition-all hover:border-[#4FA1AF] hover:text-[#4FA1AF] disabled:opacity-50"
              >
                {isExpanding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#4FA1AF]" />}
                <span>{isExpanding ? 'Expanding...' : 'Expand Note'}</span>
              </button>

              <ButtonPrimary 
                onClick={handleSave} 
                disabled={isSaving || isExpanding || !title.trim() || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </ButtonPrimary>
            </div>
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

            {expandedContent && (
              <section className="mt-8 rounded-xl border border-[#4FA1AF]/40 bg-[#f4fafb] p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">Expanded note ready for review</p>
                    <p className="text-sm text-[#5f6b6d]">Review the formatted Markdown, then choose whether to keep it.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedContent(null)}
                      disabled={isSaving}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#4a4a4a] transition-colors hover:border-gray-400 disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <ButtonPrimary
                      onClick={handleAcceptExpansion}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm disabled:opacity-50"
                    >
                      {isSaving ? 'Accepting...' : 'Accept changes'}
                    </ButtonPrimary>
                  </div>
                </div>
                <MarkdownEditor value={expandedContent} readOnly />
              </section>
            )}
          </motion.div>
        </div>
      </DotPanel>
    </div>
  );
}
