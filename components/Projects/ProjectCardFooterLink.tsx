import { PROJECT_CARD_EXTERNAL_NEW_TAB_HINT } from "data/projectsUi";
import { isHref } from "utils/isHttpOrHttpsHref";
import { FOCUS_RING } from "utils/visual";

interface ProjectCardFooterLinkProps {
  label: string;
  href: string;
}

export function ProjectCardFooterLink({ label, href }: ProjectCardFooterLinkProps) {
  const ext = isHref(href);

  return (
    <a
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground/30 hover:bg-card/80 transition-colors ${FOCUS_RING}`}
    >
      {label}
      {ext ? (
        <span aria-hidden className="text-muted">
          ↗
        </span>
      ) : null}
      {ext ? <span className="sr-only">{PROJECT_CARD_EXTERNAL_NEW_TAB_HINT}</span> : null}
    </a>
  );
}
