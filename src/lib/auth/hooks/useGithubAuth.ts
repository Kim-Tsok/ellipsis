import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';

interface UseGithubAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useGithubAuth = ({
  onSuccess,
  onError,
}: UseGithubAuthProps = {}) => {
  const [loading, setLoading] = useState(false);

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: DEFAULT_LOGIN_REDIRECT,
      });
      onSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('GitHub sign in failed');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGithubSignIn,
  };
};
