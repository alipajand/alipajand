import Link from "next/link";

import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
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
        <p className="text-muted text-[15px] leading-relaxed">{tool.description}</p>
      </div>

      <ul className="flex flex-wrap gap-2 list-none p-0 m-0" aria-label={`${tool.name} tags`}>
        {tool.tags.map((tag) => (
          <ProjectCardBadge key={tag}>{tag}</ProjectCardBadge>
        ))}
      </ul>

      <div className="mt-auto pt-1">
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
      </div>
    </article>
  );
}
