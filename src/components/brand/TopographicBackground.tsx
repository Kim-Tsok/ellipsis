export function TopographicBackground({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/topographic-background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'invert(1) grayscale(1) contrast(1.15)',
          opacity: 0.22,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
