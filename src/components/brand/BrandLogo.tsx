import Image from 'next/image';
import Link from 'next/link';
import { SITE_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
  href?: string | null;
  priority?: boolean;
};

export function BrandLogo({
  variant = 'full',
  className,
  href = SITE_PATHS.HOME,
  priority = false,
}: BrandLogoProps) {
  const image =
    variant === 'full' ? (
      <Image
        src="/full%20logo.svg"
        alt={APP_NAME}
        width={143}
        height={50}
        className={cn('h-10 w-auto', className)}
        priority={priority}
      />
    ) : (
      <Image
        src="/ellipsis%20logo.svg"
        alt={APP_NAME}
        width={304}
        height={304}
        className={cn('h-12 w-12', className)}
        priority={priority}
      />
    );

  if (href === null) {
    return image;
  }

  return (
    <Link href={href} aria-label={APP_NAME} className="inline-flex">
      {image}
    </Link>
  );
}
