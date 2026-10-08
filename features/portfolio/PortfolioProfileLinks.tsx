import { trackContactLinkClick } from "components/Contact/trackContactLinkClick";
import { LINKS } from "data/links";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { PORTFOLIO_PROFILE_LINK_LABELS, PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";
import { CARD_SURFACE_HOVER, FOCUS_RING } from "utils/visual";

const ICON_SRC: Record<(typeof PORTFOLIO_PROFILE_LINK_LABELS)[number], string> = {
  GitHub: "/icons/github.svg",
  LinkedIn: "/icons/linkedin.svg",
  "Book a call": "/icons/calendar.svg",
};

const PROFILE_LINKS = PORTFOLIO_PROFILE_LINK_LABELS.flatMap((label) => {
  const link = LINKS.find((item) => item.label === label);
  return link ? [{ ...link, label, iconSrc: ICON_SRC[label] }] : [];
});

export const PortfolioProfileLinks = () => (
  <ul
    aria-label={PORTFOLIO_PROFILE_LINKS_ARIA_LABEL}
    className="mt-6 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3"
  >
    {PROFILE_LINKS.map((link) => (
      <li key={link.label}>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label}: ${link.value}${EXTERNAL_LINK_NEW_TAB_HINT}`}
          data-analytics-event={`portfolio_profile_link_${link.label.toLowerCase().replace(/\s+/g, "_")}`}
          onClick={() => trackContactLinkClick(link.label)}
          className={`hover-lift flex items-center gap-4 p-4 sm:p-5 ${CARD_SURFACE_HOVER} text-foreground ${FOCUS_RING}`}
        >
          <span
            aria-hidden
            className="inline-block size-9 shrink-0 bg-current"
            style={{
              maskImage: `url(${link.iconSrc})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url(${link.iconSrc})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
          <span className="min-w-0">
            <span className="block text-base font-semibold">{link.label}</span>
            <span className="mt-0.5 block truncate text-sm text-muted">{link.value}</span>
          </span>
        </a>
      </li>
    ))}
  </ul>
);
