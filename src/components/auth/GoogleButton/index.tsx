'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from './GoogleIcon';
import type { GoogleButtonProps } from './types';
import { Loader2 } from 'lucide-react';
export const GoogleButton = ({
  mode,
  onSuccess,
  isLoading = false,
  disabled = false,
}: GoogleButtonProps) => {
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
          <GoogleIcon />
          {mode === 'login' ? 'Google' : 'Google'}
        </>
      )}
    </Button>
  );
};
