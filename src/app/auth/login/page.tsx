'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/AuthShell';
import { EmailAuthFields } from '@/components/auth/EmailAuthFields';
import { useAuthForm } from '@/lib/auth/hooks/useAuthForm';
import { useGoogleAuth } from '@/lib/auth/hooks/useGoogleAuth';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';
import { AUTH_PATHS } from '@/lib/constants/routes';
import { authClient } from '@/lib/auth/auth-client';
import { Spinner } from '@/components/ui/spinner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully! You can now log in.');
    }
  }, [searchParams]);

  const {
    loading: formLoading,
    error,
    handleSubmit,
    setError,
  } = useAuthForm({
    mode: 'login',
    onSuccess: () => router.push(DEFAULT_LOGIN_REDIRECT),
  });

  const { loading: googleLoading, handleGoogleSignIn } = useGoogleAuth({
    onError: (err: Error) => setError(err.message),
  });

  useEffect(() => {
    if (!authLoading && session) {
      router.push(DEFAULT_LOGIN_REDIRECT);
    }
  }, [session, authLoading, router]);

  if (authLoading || session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-instrument-serif text-6xl leading-[1.05] tracking-tight text-[#1a1a1a] sm:text-7xl">
        Hi, <span className="text-[#4FA1AF]">there</span>...
        <br />
        Welcome Back
      </h1>

      <EmailAuthFields
        mode="login"
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={() => handleSubmit({ email, password })}
        onGoogle={handleGoogleSignIn}
        isLoading={formLoading}
        googleLoading={googleLoading}
        error={error}
      />

      <p className="font-instrument-serif mt-10 text-[#8a8a8a]">
        <Link
          href={AUTH_PATHS.REGISTER}
          className="underline decoration-[#8a8a8a] underline-offset-4 transition-colors hover:text-[#4FA1AF] hover:decoration-[#4FA1AF]"
        >
          Not you? Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner className="h-10 w-10" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
