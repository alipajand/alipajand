import type { SVGProps } from "react";

import styles from "components/hairline/Icons/Icons.module.css";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "viewBox">;

export const Spark = (props: IconProps) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...props}>
    <path
      d="M10 0 C10.6 7 13 9.4 20 10 C13 10.6 10.6 13 10 20 C9.4 13 7 10.6 0 10 C7 9.4 9.4 7 10 0Z"
      fill="currentColor"
    />
  </svg>
);

export const Ring = (props: IconProps) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...props}>
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="10" cy="10" r="4.5" />
      <ellipse cx="10" cy="10" rx="9" ry="3" transform="rotate(-20 10 10)" />
    </g>
  </svg>
);

export const Chev = ({ className }: { className?: string }) => (
  <span className={className ? `${styles.chev} ${className}` : styles.chev} aria-hidden="true">
    <svg viewBox="0 0 40 16" focusable="false">
      <path d="M2 2 L8 8 L2 14 M13 2 L19 8 L13 14 M24 2 L30 8 L24 14" />
    </svg>
  </span>
);

export const BandChevron = (props: IconProps) => (
  <svg viewBox="0 0 40 60" aria-hidden="true" focusable="false" {...props}>
    <path d="M6 4 L32 30 L6 56" />
  </svg>
);
