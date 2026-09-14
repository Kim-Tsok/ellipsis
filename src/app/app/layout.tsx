import type { ReactNode } from 'react';
import Image from 'next/image';
import { AppSidebar } from '@/components/app/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-full min-h-0 overflow-hidden bg-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Image
          src="/gradient-bg-app.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-left-top opacity-80"
        />
      </div>

      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="relative z-10 min-h-0 min-w-0 flex-1 overflow-hidden px-3 pb-20 pt-3 md:px-5 md:pb-5 md:pt-5">
        {children}
      </main>
    </div>
  );
}
