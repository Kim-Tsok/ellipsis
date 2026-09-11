'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/lib/auth/validation/forgot-password';
import { AUTH_PATHS } from '@/lib/constants/routes';
import { authClient } from '@/lib/auth/auth-client';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [pageError, setPageError] = React.useState<string | null>(null);
  const [isOAuthAccount, setIsOAuthAccount] = React.useState<boolean>(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setIsSuccess(false);
    setPageError(null);
    setIsOAuthAccount(false);

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/auth/reset-password',
      });

      if (resetError) {
        if (resetError.code === 'USER_IS_LINKED_TO_SOCIAL_ACCOUNT') {
          setIsOAuthAccount(true);
          setIsSuccess(true);
          toast.info('This account uses social sign-in.');
          return;
        }
        throw new Error(
          resetError.message || 'Failed to send password reset email.'
        );
      }

      setIsSuccess(true);
      toast.success('Password reset link sent. Please check your inbox.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';
      setPageError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen">
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
            {!isSuccess && (
              <>
                <h2 className="text-foreground mt-4 text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
                  Forgot Your Password?
                </h2>
                <p className="text-md text-muted-foreground mt-2 leading-6">
                  Enter your email below to receive a reset link.
                </p>
              </>
            )}
          </div>

          <div className="mt-10">
            {pageError && !isSuccess && (
              <div className="border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/20 mb-6 rounded-lg border p-4 text-center text-sm dark:text-red-400">
                <p>{pageError}</p>
              </div>
            )}

            {isSuccess ? (
              <div className="space-y-6 text-center">
                <h2 className="text-foreground text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
                  {isOAuthAccount ? 'Information' : 'Reset Link Sent'}
                </h2>
                <p className="text-muted-foreground">
                  {isOAuthAccount
                    ? 'This account uses Google or GitHub Sign-In. No password reset is needed.'
                    : 'Check your email for the reset link!'}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={AUTH_PATHS.LOGIN}>Back to Login</Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </Form>
            )}

            {!isSuccess && (
              <div className="mt-6 text-center text-sm">
                <Link
                  href={AUTH_PATHS.LOGIN}
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Remembered your password? Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/forgot-password.webp"
          alt="Person thinking about password reset"
          fill
          priority
        />
      </div>
    </div>
  );
}
