import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AuthCardProps } from './types';

export const AuthCard = ({
  title,
  description,
  children,
  footer,
}: AuthCardProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">{children}</div>
        </CardContent>
        {footer && (
          <CardFooter className="flex justify-center">{footer}</CardFooter>
        )}
      </Card>
    </div>
  );
};
