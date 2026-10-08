"use client";

import classNames from "classnames";
import type { MouseEvent } from "react";
import { useRef } from "react";

import { useActiveHeading } from "components/TableOfContents/hooks/useActiveHeading";
import { WRITING_TOC_ARIA_LABEL, WRITING_TOC_HEADING } from "data/writing";
import type { PostHeading } from "utils/headings";
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

interface TableOfContentsProps {
  headings: PostHeading[];
  className?: string;
}

const TocLinks = ({
  headings,
  activeId,
  onNavigate,
}: {
  headings: PostHeading[];
  activeId: string | null;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) => (
  <ol className="flex flex-col border-l border-border">
    {headings.map((heading) => {
      const isActive = heading.id === activeId;
      return (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={isActive ? "location" : undefined}
            onClick={(event) => onNavigate(event, heading.id)}
            className={classNames(
              "-ml-px block border-l py-1.5 pr-2 text-[13px] leading-snug transition-colors duration-200",
              heading.level === 3 ? "pl-7" : "pl-4",
              FOCUS_RING,
              isActive
                ? "border-[var(--organic-orange)] text-foreground"
                : "border-transparent text-muted hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {heading.text}
          </a>
        </li>
      );
    })}
  </ol>
);

/** Sticky outline for wide screens. */
export const TableOfContents = ({ headings, className }: TableOfContentsProps) => {
  const {
    selectors: { activeId },
    actions: { handleNavigate },
  } = useActiveHeading(headings.map((h) => h.id));

  if (headings.length < 2) return null;

  return (
    <nav aria-label={WRITING_TOC_ARIA_LABEL} className={className}>
      <p className={`${LABEL_OVERLINE} mb-3`}>{WRITING_TOC_HEADING}</p>
      <TocLinks headings={headings} activeId={activeId} onNavigate={handleNavigate} />
    </nav>
  );
};

/** Collapsible outline for narrow screens. */
export const TableOfContentsDisclosure = ({ headings, className }: TableOfContentsProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const {
    selectors: { activeId },
    actions: { handleNavigate },
  } = useActiveHeading(headings.map((h) => h.id));

  if (headings.length < 2) return null;

  return (
    <nav aria-label={WRITING_TOC_ARIA_LABEL} className={className}>
      <details ref={detailsRef} className="group rounded-xl border border-border/70 bg-card">
        <summary
          className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
        >
          <span>
            {WRITING_TOC_HEADING}
            <span className="ml-2 text-muted tabular-nums">{headings.length}</span>
          </span>
          <span
            aria-hidden="true"
            className="text-xs text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          >
            ▾
          </span>
        </summary>
        <div className="px-4 pb-4">
          <TocLinks
            headings={headings}
            activeId={activeId}
            onNavigate={(event, id) => {
              // Collapse first so the scroll target is measured in the final layout.
              if (detailsRef.current) detailsRef.current.open = false;
              handleNavigate(event, id);
            }}
          />
        </div>
      </details>
    </nav>
  );
};
