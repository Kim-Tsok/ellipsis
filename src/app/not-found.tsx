import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    "We couldn't find the page you were looking for. Please check the address or go back to the homepage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="bg-card flex h-screen w-full items-center justify-center">
      <div className="max-w-[600px] space-y-6 px-4 text-center">
        <div className="space-y-2">
          <CardTitle
            className="text-card-foreground text-4xl font-bold sm:text-6xl"
            aria-label="404"
          >
            404
          </CardTitle>
          <CardTitle className="text-muted-foreground text-xl font-semibold sm:text-2xl">
            Page not found
          </CardTitle>
        </div>
        <CardDescription className="text-foreground sm:text-lg">
          We couldn&apos;t find the page you were looking for. Please check the
          address or go back to the homepage.
        </CardDescription>
        <CardDescription className="flex justify-center gap-4">
          <Button
            variant="default"
            asChild
            className="bg-foreground text-background hover:bg-foreground/90"
            aria-label="Go back to homepage"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Go back to homepage
            </Link>
          </Button>
        </CardDescription>
        <CardContent className="pt-8">
          <div
            className="from-foreground/30 to-foreground mx-auto h-2 w-32 rounded-full bg-gradient-to-r"
            aria-hidden="true"
            role="presentation"
          />
        </CardContent>
      </div>
    </main>
  );
}
