export function ArgentinaFlag({ className = 'inline-block w-5 h-4 align-middle mx-1' }: { className?: string }) {
  return (
    <svg viewBox="0 0 27 18" className={className} aria-label="Bandera de Argentina" role="img">
      <rect width="27" height="6" fill="#74ACDF" />
      <rect y="6" width="27" height="6" fill="#FFFFFF" />
      <rect y="12" width="27" height="6" fill="#74ACDF" />
      <circle cx="13.5" cy="9" r="3.5" fill="#F6B40E" />
    </svg>
  );
}
