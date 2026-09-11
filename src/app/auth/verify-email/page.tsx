'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { MailWarning, LogOut } from 'lucide-react';
import { APP_NAME } from '@/lib/constants/site';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/auth-client';
import { AUTH_PATHS } from '@/lib/constants/routes';

function VerifyEmailContent() {
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleResendClick = async () => {
    if (!session?.user?.email) {
      toast.error('Could not get user email. Please log out and log back in.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: window.location.origin + '/auth/login',
      });

      if (resendError) {
        throw new Error(
          resendError.message || 'Failed to resend verification email.'
        );
      }

      toast.success('Verification email sent successfully!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      console.error('Resend verification error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading state while session is checked
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // If somehow user lands here without being logged in (middleware should prevent this)
  if (!session) {
    return (
      <div className="space-y-4 text-center">
        <MailWarning
          className={`mx-auto h-12 w-12 text-yellow-600`}
          aria-hidden="true"
        />
        <h2 className={`text-2xl font-semibold`}>Authentication Required</h2>
        <p className="text-muted-foreground">
          You need to be logged in to manage email verification.
        </p>
        <Button asChild variant="outline">
          <Link href={AUTH_PATHS.LOGIN}>Back to Login</Link>
        </Button>
      </div>
    );
  }

  // Main content for logged-in, unverified user
  return (
    <div className="space-y-4 text-center">
      <MailWarning
        className={`mx-auto h-12 w-12 text-yellow-600`}
        aria-hidden="true"
      />
      <h2 className={`text-2xl font-semibold`}>Verify Your Email</h2>
      <p className="text-muted-foreground">
        A verification link has been sent to{' '}
        <strong>{session?.user?.email || 'your email'}</strong>. Please check
        your inbox (and spam folder) and click the link to activate your
        account.
      </p>
      <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
        <Button onClick={handleResendClick} disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Sending...' : 'Resend Verification Link'}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = '/auth/login';
                },
              },
            })
          }
        >
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md lg:w-[450px]">
        <Link href="/" className="mx-auto mb-8 inline-block">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center space-x-2 rounded-lg p-1.5">
            <Image
              className="h-10 w-auto"
              src="/logo.svg"
              alt={`${APP_NAME} Logo`}
              width={40}
              height={40}
            />
          </div>
        </Link>

        <VerifyEmailContent />
      </div>
    </div>
  );
}
