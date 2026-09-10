import topographicBgSrc from '@/app/assets/topographic-background.png';

type BackgroundTextureProps = {
  className?: string;
};

export default function BackgroundTexture({ className = '' }: BackgroundTextureProps) {
  return (
    <div
      className={`${className} bg-[url('${topographicBgSrc}')] bg-cover bg-center`}
      aria-hidden="true"
    />
  );
}
