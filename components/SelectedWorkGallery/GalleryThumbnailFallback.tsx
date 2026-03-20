"use client";

import type { SelectedWorkType } from "data/selectedWork";

/**
 * When no screenshot is configured, show an intentional illustrative frame
 * (not an error state) so the gallery still reads as designed.
 */
export function GalleryThumbnailFallback({ type }: { type: SelectedWorkType }) {
  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden bg-[#0a0a0a]"
      data-gallery-fallback={type}
      aria-hidden
    >
      {type === "ui" && <UiFallback />}
      {type === "dashboard" && <DashboardFallback />}
      {type === "diagram" && <DiagramFallback />}
      <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-1rem)] text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-muted/55 font-medium leading-tight">
        Illustrative · not a live screenshot
      </span>
    </div>
  );
}

function UiFallback() {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="h-8 shrink-0 flex items-center gap-1.5 px-3 border-b border-border/80 bg-card/90">
        <span className="size-2 rounded-full bg-[#ff5f56]/90" />
        <span className="size-2 rounded-full bg-[#ffbd2e]/90" />
        <span className="size-2 rounded-full bg-[#27c93f]/90" />
        <span className="ml-2 text-[10px] text-muted/60 font-mono tabular-nums">
          storybook · component
        </span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3">
        <div className="w-[88%] rounded-md border border-border/60 bg-background/35 p-4 space-y-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="h-2 w-3/4 rounded bg-muted/25" />
          <div className="h-2 w-full rounded bg-muted/15" />
          <div className="h-2 w-5/6 rounded bg-muted/15" />
          <div className="h-16 rounded border border-border/40 bg-card/40 flex items-end justify-center gap-2 pb-2 px-2">
            <div className="h-8 w-1/4 rounded-sm bg-foreground/10" />
            <div className="h-12 w-1/4 rounded-sm bg-foreground/15" />
            <div className="h-6 w-1/4 rounded-sm bg-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="relative flex-1 min-h-0 bg-gradient-to-br from-[#0c0c0c] via-card to-[#101010]">
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
      <div className="absolute inset-x-0 top-0 h-1/3 border-b border-border/30 bg-gradient-to-b from-foreground/[0.03] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1.5 px-8 pb-12 pt-10">
        {[40, 72, 56, 88, 48].map((h, i) => (
          <div
            key={i}
            className="w-1/6 max-w-[48px] rounded-t-sm bg-foreground/10 border border-border/20"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
      <div className="absolute top-8 left-4 right-4 h-px bg-border/20" />
      <div className="absolute top-12 left-4 right-4 h-px bg-border/10" />
    </div>
  );
}

function DiagramFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-0 bg-gradient-to-b from-[#0a0a0a] to-card">
      <svg viewBox="0 0 400 200" className="w-full h-full max-h-[200px]" aria-hidden>
        <defs>
          <linearGradient id="diagram-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#171717" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <marker id="diagram-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#525252" />
          </marker>
        </defs>
        <rect width="400" height="200" fill="url(#diagram-bg)" rx="8" />
        <g stroke="#404040" strokeWidth="1.5" fill="#141414">
          <rect x="28" y="70" width="92" height="48" rx="8" />
          <path d="M 120 94 L 152 94" fill="none" markerEnd="url(#diagram-arrow)" />
          <rect x="152" y="70" width="92" height="48" rx="8" />
          <path d="M 244 94 L 276 94" fill="none" markerEnd="url(#diagram-arrow)" />
          <rect x="276" y="70" width="92" height="48" rx="8" />
        </g>
        <g fill="#737373" fontSize="11" fontFamily="ui-sans-serif, system-ui, sans-serif">
          <text x="74" y="100" textAnchor="middle">
            Trigger
          </text>
          <text x="198" y="100" textAnchor="middle">
            Pipeline
          </text>
          <text x="322" y="100" textAnchor="middle">
            Action
          </text>
        </g>
      </svg>
    </div>
  );
}
