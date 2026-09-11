'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { APP_NAME } from '@/lib/constants/site';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { resetPasswordSchema } from '@/lib/auth/validation/reset-password';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/auth-client';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      toast.error('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (resetError) {
        throw new Error(resetError.message || 'Failed to reset password.');
      }

      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      console.error('Reset password error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error && !isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-destructive">{error}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/forgot-password">Request New Reset Link</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-green-600">
          Your password has been reset successfully.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login">Proceed to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || !token}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-background flex min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <Link href="/" className="mx-auto mb-6 inline-block">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center space-x-2 rounded-lg p-1.5">
              <Image
                className=""
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
          <h2 className="text-foreground mt-4 text-left text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
            Reset Your Password
          </h2>
          <p className="text-md text-muted-foreground mt-2 text-left leading-6">
            Enter your new password below.
          </p>
        </div>

        <div className="mt-10">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-4">
                <Spinner className="h-8 w-8" />
              </div>
            }
          >
            <ResetPasswordFormContent />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
