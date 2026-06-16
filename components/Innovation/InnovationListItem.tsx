import { INNOVATION_VIDEO_LINK_DEFAULT, type InnovationItem } from "data/innovation";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { CARD_SURFACE_HOVER } from "utils/visual";

interface InnovationListItemProps {
  item: InnovationItem;
}

export function InnovationListItem({ item }: InnovationListItemProps) {
  return (
    <li>
      <article data-innovation-card className={`${CARD_SURFACE_HOVER} p-6 sm:p-8`}>
        <h3 className="font-display font-semibold text-xl text-foreground">{item.title}</h3>
        <p className="mt-3 text-muted text-[15px] sm:text-base leading-relaxed">
          {item.description}
        </p>
        {item.videoUrl ? (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted transition-colors"
          >
            {item.videoLabel ?? INNOVATION_VIDEO_LINK_DEFAULT}
            <span className="sr-only">{EXTERNAL_LINK_NEW_TAB_HINT}</span>
            <span aria-hidden>→</span>
          </a>
        ) : null}
        {item.videoLabel && !item.videoUrl ? (
          <p className="mt-4 text-sm text-muted">{item.videoLabel}</p>
        ) : null}
      </article>
    </li>
  );
}
