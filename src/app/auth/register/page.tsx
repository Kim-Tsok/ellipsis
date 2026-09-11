'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { GithubButton } from '@/components/auth/GithubButton';
import { DiscordButton } from '@/components/auth/DiscordButton';
import { TwitterButton } from '@/components/auth/TwitterButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { AuthForm } from '@/components/auth/AuthForm';
import type { AuthFormData } from '@/components/auth/AuthForm/types';
import { useAuthForm } from '@/lib/auth/hooks/useAuthForm';
import { useGoogleAuth } from '@/lib/auth/hooks/useGoogleAuth';
import { useGithubAuth } from '@/lib/auth/hooks/useGithubAuth';
import { useDiscordAuth } from '@/lib/auth/hooks/useDiscordAuth';
import { useTwitterAuth } from '@/lib/auth/hooks/useTwitterAuth';
import { Spinner } from '@/components/ui/spinner';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/constants/auth';
import { authClient } from '@/lib/auth/auth-client';
import { APP_NAME } from '@/lib/constants/site';

function RegisterContent() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const authenticated = !!session;

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

  const { loading: githubLoading, handleGithubSignIn } = useGithubAuth({
    onError: (err: Error) => setError(err.message),
  });

  const { loading: discordLoading, handleDiscordSignIn } = useDiscordAuth({
    onError: (err: Error) => setError(err.message),
  });

  const { loading: twitterLoading, handleTwitterSignIn } = useTwitterAuth({
    onError: (err: Error) => setError(err.message),
  });

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.push(DEFAULT_LOGIN_REDIRECT);
    }
  }, [authenticated, authLoading, router]);

  const isLoading =
    formLoading ||
    googleLoading ||
    githubLoading ||
    discordLoading ||
    twitterLoading ||
    authLoading;

  if (authLoading || (!authLoading && authenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const handleFormSubmit = handleSubmit as (
    data: AuthFormData
  ) => Promise<void>;

  return (
    <div className="bg-background flex min-h-screen">
      <div className="relative hidden lg:block lg:w-[577px]">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/register.webp"
          alt="Sign up illustration"
          fill
          sizes="(min-width: 1024px) 577px, 0vw"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="mb-6 inline-block">
              <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center space-x-2 rounded-lg p-1.5">
                <Image
                  className="h-10 w-auto"
                  src="/logo.svg"
                  alt={`${APP_NAME} Logo`}
                  width={40}
                  height={40}
                />
                <span className="p-2 text-2xl font-bold tracking-tight whitespace-nowrap">
                  {APP_NAME}
                </span>
              </div>
            </Link>
            <h2 className="text-foreground mt-4 text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
              Create your account
            </h2>
            <p className="text-md text-muted-foreground mt-2 leading-6">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/90 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <GoogleButton
                mode="register"
                onSuccess={handleGoogleSignIn}
                isLoading={isLoading}
              />
              <GithubButton
                mode="register"
                onSuccess={handleGithubSignIn}
                isLoading={isLoading}
              />
              <DiscordButton
                mode="register"
                onSuccess={handleDiscordSignIn}
                isLoading={isLoading}
              />
              <TwitterButton
                mode="register"
                onSuccess={handleTwitterSignIn}
                isLoading={isLoading}
              />
            </div>
            <AuthDivider text="Or sign up with email and password" />
            <AuthForm
              mode="register"
              onSubmit={handleFormSubmit}
              isLoading={formLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
