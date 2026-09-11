import * as React from 'react';
import { cn } from '@/lib/utils';

const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
      {...props}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };

