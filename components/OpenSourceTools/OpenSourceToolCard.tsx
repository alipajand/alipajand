import Link from "next/link";

import type { OpenSourceTool } from "data/openSourceTools";
import { CARD_SURFACE_HOVER, FOCUS_RING } from "utils/visual";

interface OpenSourceToolCardProps {
  tool: OpenSourceTool;
}

export function OpenSourceToolCard({ tool }: OpenSourceToolCardProps) {
  return (
    <article className={`${CARD_SURFACE_HOVER} flex h-full flex-col gap-4 p-5 sm:p-6`}>
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-xl text-foreground leading-tight">
          {tool.name}
        </h3>
        <p className="text-muted text-[15px] leading-relaxed">{tool.problem}</p>
      </div>

      <ul
        className="flex flex-col gap-2 list-none p-0 m-0"
        aria-label={`${tool.name} capabilities`}
      >
        {tool.capabilities.map((capability) => (
          <li
            key={capability}
            className="relative pl-4 text-sm leading-relaxed text-foreground/85 before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-foreground/40"
          >
            {capability}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-4 pt-1">
        <Link
          href={tool.repositoryUrl}
          aria-label={`Open ${tool.name} repository on GitHub`}
          className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground ${FOCUS_RING} rounded-sm`}
        >
          <span>Repository</span>
          <span aria-hidden className="text-muted">
            ↗
          </span>
        </Link>
        <Link
          href="/open-source"
          className={`inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground ${FOCUS_RING} rounded-sm`}
        >
          Open source page
        </Link>
      </div>
    </article>
  );
}
