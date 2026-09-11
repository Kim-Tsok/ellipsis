import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';

interface UseDiscordAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDiscordAuth = ({
  onSuccess,
  onError,
}: UseDiscordAuthProps = {}) => {
  const [loading, setLoading] = useState(false);

  const handleDiscordSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'discord',
        callbackURL: DEFAULT_LOGIN_REDIRECT,
      });
      onSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Discord sign in failed');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleDiscordSignIn,
  };
};
