import type { ReactNode } from "react";

const GLYPHS: Record<string, ReactNode> = {
  ledgerguard: (
    <>
      <rect x="22" y="4" width="44" height="58" />
      <rect x="16" y="8" width="44" height="58" />
      <rect x="10" y="12" width="44" height="58" />
      <path d="M18 26 H46 M18 34 H46 M18 42 H36" />
      <circle cx="66" cy="50" r="12" />
      <path d="M60 50 L64.5 54.5 L72 46" />
    </>
  ),
  alwaysgeeky: (
    <>
      <rect x="6" y="6" width="80" height="60" />
      <path d="M6 18 H86 M30 18 V66" />
      <rect x="38" y="26" width="18" height="14" />
      <rect x="62" y="26" width="18" height="14" />
      <rect x="38" y="46" width="18" height="14" />
      <rect x="62" y="46" width="18" height="14" />
      <circle cx="18" cy="30" r="4" />
      <circle cx="18" cy="42" r="4" />
      <circle cx="18" cy="54" r="4" />
    </>
  ),
  emplifi: (
    <>
      <path d="M6 6 V66 H86" />
      <path d="M14 54 L30 40 L44 46 L60 24 L78 30" />
      <circle cx="30" cy="40" r="3" />
      <circle cx="60" cy="24" r="3" />
      <rect x="18" y="58" width="6" height="8" />
      <rect x="34" y="52" width="6" height="14" />
      <rect x="50" y="56" width="6" height="10" />
      <rect x="66" y="48" width="6" height="18" />
    </>
  ),
};

export const CaseGlyph = ({ id, className }: { id: string; className?: string }) => {
  const glyph = GLYPHS[id];
  if (!glyph) return null;
  return (
    <svg className={className} viewBox="0 0 92 72" aria-hidden="true" focusable="false">
      {glyph}
    </svg>
  );
};
