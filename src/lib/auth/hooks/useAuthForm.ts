import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AuthFormData } from '@/components/auth/AuthForm/types';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { authClient } from '@/lib/auth/auth-client';
import { z } from 'zod';

interface UseAuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export const useAuthForm = ({ mode, onSuccess }: UseAuthFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestNewVerificationEmail = async (email: string) => {
    if (!email) {
      toast.error('Email is not available to resend verification.');
      return;
    }
    setLoading(true);
    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: window.location.origin + '/auth/login',
      });
      if (resendError) throw resendError;
      toast.success(AUTH_MESSAGES.INFO_VERIFICATION_EMAIL_SENT);
    } catch (apiError) {
      toast.error(
        apiError instanceof Error
          ? apiError.message
          : AUTH_MESSAGES.ERROR_DEFAULT
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        const { data: signUpData, error: signUpError } =
          await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: data.name!,
            callbackURL: window.location.origin + '/auth/login',
          });

        if (signUpError) {
          throw new Error(
            signUpError.message || AUTH_MESSAGES.ERROR_REGISTRATION_FAILED
          );
        }

        if (signUpData) {
          toast.success(AUTH_MESSAGES.SUCCESS_REGISTRATION);
          // BetterAuth sends verification automatically if configured
          router.push('/auth/login?registered=true');
        }
      } else {
        const { data: signInData, error: signInError } =
          await authClient.signIn.email({
            email: data.email,
            password: data.password,
          });

        if (signInError) {
          if (signInError.code === 'EMAIL_NOT_VERIFIED') {
            throw new Error(AUTH_MESSAGES.ERROR_EMAIL_NOT_VERIFIED);
          }
          throw new Error(
            signInError.message || AUTH_MESSAGES.ERROR_LOGIN_FAILED
          );
        }

        if (signInData) {
          if (onSuccess) {
            toast.success(AUTH_MESSAGES.SUCCESS_LOGIN);
            onSuccess();
          } else {
            router.push('/');
          }
        }
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === AUTH_MESSAGES.ERROR_EMAIL_NOT_VERIFIED
      ) {
        toast.error(AUTH_MESSAGES.ERROR_EMAIL_NOT_VERIFIED, {
          action: {
            label: 'Resend Email',
            onClick: () => handleRequestNewVerificationEmail(data.email),
          },
          duration: 10000,
        });
      } else if (err instanceof z.ZodError) {
        setError(err.errors.map((e) => e.message).join(', '));
      } else {
        setError(
          err instanceof Error ? err.message : AUTH_MESSAGES.ERROR_DEFAULT
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit,
    setError,
  };
};
