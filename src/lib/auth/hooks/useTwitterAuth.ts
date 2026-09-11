import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';

interface UseTwitterAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useTwitterAuth = ({
  onSuccess,
  onError,
}: UseTwitterAuthProps = {}) => {
  const [loading, setLoading] = useState(false);

  const handleTwitterSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'twitter',
        callbackURL: DEFAULT_LOGIN_REDIRECT,
      });
      onSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Twitter sign in failed');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleTwitterSignIn,
  };
};
