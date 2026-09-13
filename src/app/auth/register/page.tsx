'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { EmailAuthFields } from '@/components/auth/EmailAuthFields';
import { useAuthForm } from '@/lib/auth/hooks/useAuthForm';
import { useGoogleAuth } from '@/lib/auth/hooks/useGoogleAuth';
import { Spinner } from '@/components/ui/spinner';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';
import { AUTH_PATHS } from '@/lib/constants/routes';
import { authClient } from '@/lib/auth/auth-client';

function RegisterContent() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    loading: formLoading,
    error,
    handleSubmit,
    setError,
  } = useAuthForm({
    mode: 'register',
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

  const nameFromEmail = email.includes('@') ? email.split('@')[0] : email;

  return (
    <AuthShell>
      <h1 className="font-instrument-serif text-5xl leading-[1.05] text-[#1a1a1a] sm:text-6xl">
        Just think ...
        <br />
        Create your space
      </h1>

      <EmailAuthFields
        mode="register"
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={() =>
          handleSubmit({
            email,
            password,
            name: nameFromEmail || 'Ellipsis user',
          })
        }
        onGoogle={handleGoogleSignIn}
        isLoading={formLoading}
        googleLoading={googleLoading}
        error={error}
      />

      <p className="font-instrument-serif mt-10 text-[#8a8a8a]">
        <Link
          href={AUTH_PATHS.LOGIN}
          className="underline decoration-[#8a8a8a] underline-offset-4 transition-colors hover:text-[#4FA1AF] hover:decoration-[#4FA1AF]"
        >
          Already here? Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner className="h-10 w-10" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
