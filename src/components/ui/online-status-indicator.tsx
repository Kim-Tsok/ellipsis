'use client';

import { cn } from '@/lib/utils';

interface OnlineStatusIndicatorProps {
  className?: string;
}

export const OnlineStatusIndicator = ({
  className,
}: OnlineStatusIndicatorProps) => {
  const sizeClasses = 'h-3 w-3';

  return (
    <span
      className={cn('relative flex', sizeClasses, className)}
      aria-label="Online"
    >
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'
        )}
      ></span>
      <span
        className={cn('relative inline-flex rounded-full bg-green-500 h-full w-full')} 
      ></span>
    </span>
  );
}; 