'use client';

import { Loader2 } from 'lucide-react';
import { GoogleIcon } from '@/components/auth/GoogleButton/GoogleIcon';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import type { AuthMode } from '@/components/auth/AuthForm/types';
import { cn } from '@/lib/utils';

type EmailAuthFieldsProps = {
  mode: AuthMode;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoogle: () => void;
  isLoading?: boolean;
  googleLoading?: boolean;
  error?: string | null;
};

const fieldClass =
  'font-instrument-serif w-full border-0 border-b border-[#1a1a1a]/50 bg-transparent px-0 py-3 text-xl text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#4FA1AF] focus:border-2';

export function EmailAuthFields({
  mode,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogle,
  isLoading = false,
  googleLoading = false,
  error,
}: EmailAuthFieldsProps) {
  const busy = isLoading || googleLoading;

  return (
    <form
      className="mt-14 space-y-10"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="block">
        <span className="font-instrument-serif text-base text-[#1a1a1a] mb-2">
          Enter your email
        </span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          disabled={busy}
          onChange={(event) => onEmailChange(event.target.value)}
          className={cn(fieldClass, 'w-full')}
        />
      </label>

      <label className="block">
        <span className="font-instrument-serif text-base text-[#1a1a1a] mb-2">
          Enter your password
        </span>
        <input
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={mode === 'register' ? 8 : 1}
          value={password}
          disabled={busy}
          onChange={(event) => onPasswordChange(event.target.value)}
          className={cn(fieldClass, 'w-full')}
        />
      </label>

      {error ? (
        <p className="font-instrument-serif text-sm text-red-500 mt-2">{error}</p>
      ) : null}

      <div className="flex flex-col items-start gap-6">
        <ButtonPrimary type="submit" disabled={busy}>
          {isLoading
            ? 'Working...'
            : mode === 'login'
              ? 'Sign In'
              : 'Create account'}
        </ButtonPrimary>

        <button
          type="button"
          onClick={onGoogle}
          disabled={busy}
          className="font-instrument-serif flex items-center gap-3 text-base text-[#1a1a1a] underline decoration-[#1a1a1a]/40 underline-offset-4 transition-colors hover:text-[#4FA1AF] hover:decoration-[#4FA1AF] disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>
      </div>
    </form>
  );
}
