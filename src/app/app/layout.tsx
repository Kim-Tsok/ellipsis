import type { ReactNode } from 'react';
import Image from 'next/image';
import { AppSidebar } from '@/components/app/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-white overflow-hidden">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <Image
          src="/gradient-bg-app.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-left-top opacity-80"
        />
      </div>

      {/* Sidebar Navigation */}
      <AppSidebar />

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-screen flex-1 pl-64 pr-6 pt-6 pb-6">
        {children}
      </main>
    </div>
  );
}
