"use client";

import type { MouseEvent } from "react";
import { useRef } from "react";

import { useActiveHeading } from "components/TableOfContents/hooks/useActiveHeading";
import { WRITING_TOC_ARIA_LABEL, WRITING_TOC_HEADING } from "data/writing";
import type { PostHeading } from "utils/headings";

interface TableOfContentsProps {
  headings: PostHeading[];
  ariaLabel?: string;
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
  <ol>
    {headings.map((heading) => {
      const isActive = heading.id === activeId;
      return (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={isActive ? "location" : undefined}
            onClick={(event) => onNavigate(event, heading.id)}
          >
            {heading.text}
          </a>
        </li>
      );
    })}
  </ol>
);

/** Sticky outline for wide screens. */
export const TableOfContents = ({
  headings,
  ariaLabel = WRITING_TOC_ARIA_LABEL,
}: TableOfContentsProps) => {
  const {
    selectors: { activeId },
    actions: { handleNavigate },
  } = useActiveHeading(headings.map((h) => h.id));

  if (headings.length < 2) return null;

  return (
    <nav aria-label={ariaLabel}>
      <p>{WRITING_TOC_HEADING}</p>
      <TocLinks headings={headings} activeId={activeId} onNavigate={handleNavigate} />
    </nav>
  );
};

/** Collapsible outline for narrow screens. */
export const TableOfContentsDisclosure = ({
  headings,
  ariaLabel = WRITING_TOC_ARIA_LABEL,
}: TableOfContentsProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const {
    selectors: { activeId },
    actions: { handleNavigate },
  } = useActiveHeading(headings.map((h) => h.id));

  if (headings.length < 2) return null;

  return (
    <nav aria-label={ariaLabel}>
      <details ref={detailsRef}>
        <summary>
          <span>
            {WRITING_TOC_HEADING}
            <span>{headings.length}</span>
          </span>
          <span aria-hidden="true">▾</span>
        </summary>
        <div>
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
