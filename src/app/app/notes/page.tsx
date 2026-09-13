'use client';

import { DotPanel } from '@/components/app/DotPanel';
import { SearchBar } from '@/components/app/SearchBar';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ButtonPrimary } from '@/components/ButtonPrimary';

export default function NotesIndexPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <DotPanel>
        <SearchBar />
        
        <div className="relative z-10 flex h-full w-full flex-col px-12 pb-12 pt-28">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-instrument-serif text-4xl text-[#1a1a1a]">Your Notes</h1>
            <Link href="/app/n/new">
              <ButtonPrimary className="flex items-center gap-2 px-4 py-2 text-sm">
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </ButtonPrimary>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Example Note Card */}
              <Link href="/app/n/example-note" className="group flex h-48 flex-col justify-between rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-[#4FA1AF]/30 hover:shadow-md">
                <div>
                  <h3 className="font-instrument-serif text-2xl text-[#1a1a1a] group-hover:text-[#4FA1AF] transition-colors">Project Brainstorm</h3>
                  <p className="mt-2 text-sm text-[#8a8a8a] line-clamp-3">
                    Initial thoughts on the new architecture. We need to ensure the graph view can scale to thousands of nodes...
                  </p>
                </div>
                <div className="text-xs text-gray-400">2 hours ago</div>
              </Link>
            </motion.div>
          </div>
        </div>
      </DotPanel>
    </div>
  );
}
