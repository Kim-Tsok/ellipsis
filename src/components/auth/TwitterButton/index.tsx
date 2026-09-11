'use client';

import { Button } from '@/components/ui/button';
import { TwitterIcon } from './TwitterIcon';
import type { TwitterButtonProps } from './types';
import { Loader2 } from 'lucide-react';

export const TwitterButton = ({
  mode,
  onSuccess,
  isLoading = false,
  disabled = false,
}: TwitterButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full rounded-full"
      onClick={onSuccess}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === 'login' ? 'Signing in...' : 'Signing up...'}
        </>
      ) : (
        <>
          <TwitterIcon />
          {mode === 'login' ? 'Twitter' : 'Twitter'}
        </>
      )}
    </Button>
  );
};
