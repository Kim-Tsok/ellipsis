'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, SquarePen, Inbox } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';

const NAV_ITEMS = [
  { name: 'Graph', href: '/app', icon: Sparkles },
  { name: 'Notes', href: '/app/notes', icon: SquarePen },
  { name: 'Digest', href: '/app/digest', icon: Inbox },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col px-8 py-10">
      <div className="mb-14 pl-2">
        <BrandLogo variant="full" className="h-8 w-auto text-[#1a1a1a]" />
      </div>

      <nav className="flex flex-col gap-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center gap-4 rounded-lg px-3 py-2 text-lg transition-colors ${
                isActive
                  ? 'text-[#1a1a1a] font-medium'
                  : 'text-[#4a4a4a] hover:text-[#1a1a1a]'
              }`}
            >
              <item.icon
                strokeWidth={1.5}
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-[#4FA1AF]' : 'text-[#8a8a8a] group-hover:text-[#4FA1AF]'
                }`}
              />
              <span className="font-instrument-serif text-2xl tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
