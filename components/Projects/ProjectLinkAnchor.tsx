import type { ReactNode } from "react";
import Link from "next/link";

import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

interface ProjectLinkAnchorProps {
  href: string;
  className?: string;
  children: ReactNode;
  label: string;
}

const isExternalHref = (href: string): boolean => /^https?:\/\//.test(href);

const hostOf = (href: string): string => new URL(href).host.replace(/^www\./, "");

/** Internal links route client-side; external links open in a new tab and show their host. */
export const ProjectLinkAnchor = ({ href, className, children, label }: ProjectLinkAnchorProps) => {
  if (!isExternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (${hostOf(href)})${EXTERNAL_LINK_NEW_TAB_HINT}`}
      className={className}
    >
      {children}
      <span className="text-muted"> ({hostOf(href)}) ↗</span>
    </a>
  );
};
