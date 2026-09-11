'use client';

import { Button } from '@/components/ui/button';
import { DiscordIcon } from './DiscordIcon';
import type { DiscordButtonProps } from './types';
import { Loader2 } from 'lucide-react';

export const DiscordButton = ({
  mode,
  onSuccess,
  isLoading = false,
  disabled = false,
}: DiscordButtonProps) => {
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
          <DiscordIcon />
          {mode === 'login' ? 'Discord' : 'Discord'}
        </>
      )}
    </Button>
  );
};
