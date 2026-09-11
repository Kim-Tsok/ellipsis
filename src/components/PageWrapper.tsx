'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ISOLATED_LAYOUT_PATHS } from '@/lib/constants/routes';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const pathname = usePathname();

  // Function to check if path matches any pattern in the list
  const isPathMatch = (path: string, patterns: string[]): boolean => {
    return patterns.some((pattern) => {
      if (pattern.endsWith(':path*')) {
        const basePattern = pattern.replace('/:path*', '');
        return path.startsWith(basePattern + '/') || path === basePattern;
      }
      return path === pattern;
    });
  };

  const isIsolatedPage = isPathMatch(pathname, ISOLATED_LAYOUT_PATHS);

  if (isIsolatedPage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pb-20">{children}</main>
      <Footer />
    </>
  );
};

export default PageWrapper;
