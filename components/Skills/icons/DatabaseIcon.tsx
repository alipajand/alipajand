const SIZE = 16;
const PATH =
  "M21 5c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2s.9-2 2-2h14c1.1 0 2 .9 2 2zM21 12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2s.9-2 2-2h14c1.1 0 2 .9 2 2zM21 19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2s.9-2 2-2h14c1.1 0 2 .9 2 2z";

export function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATH} />
    </svg>
  );
}
