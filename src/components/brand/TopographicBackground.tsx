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
        }}
      />
    </div>
  );
}
