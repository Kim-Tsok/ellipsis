import gradientBgAppSrc from '@/app/assets/gradient-bg-app.png';
import gradientBgPasswordSrc from '@/app/assets/gradient-password.png';

type GradientOrbProps = {
  variant: 'app' | 'password';
  className?: string;
};

export default function GradientOrb({ variant, className = '' }: GradientOrbProps) {
  const src = variant === 'app' ? gradientBgAppSrc : gradientBgPasswordSrc;
  return (
    <img
      src={src}
      alt=""
      className={className}
      aria-hidden="true"
    />
  );
}
