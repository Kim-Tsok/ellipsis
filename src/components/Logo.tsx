import FullLogo from '@/app/assets/full-logo.svg';
import LogoMark from '@/app/assets/logo.svg';

type LogoProps = {
  variant: 'full' | 'mark';
  size: 'sm' | 'md' | 'lg';
};

export default function Logo({ variant, size }: LogoProps) {
  const sizeMap: Record<string, string> = {
    sm: 'w-[20px] h-[20px]',
    md: 'w-[32px] h-[32px]',
    lg: 'w-[48px] h-[48px]',
  };

  const Svg = variant === 'full' ? FullLogo : LogoMark;

  return (
    <Svg
      className={`${sizeMap[size]} text-current`}
      aria-hidden="true"
    />
  );
}
