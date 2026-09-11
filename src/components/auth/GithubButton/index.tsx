'use client';

import { Button } from '@/components/ui/button';
import { GithubIcon } from './GithubIcon';
import type { GithubButtonProps } from './types';
import { Loader2 } from 'lucide-react';

export const GithubButton = ({
  mode,
  onSuccess,
  isLoading = false,
  disabled = false,
}: GithubButtonProps) => {
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
          <GithubIcon />
          {mode === 'login' ? 'Github' : 'Github'}
        </>
      )}
    </Button>
  );
};
