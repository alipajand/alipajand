"use client";

import { trackContactLinkClick } from "components/Contact/trackContactLinkClick";
import { LINKS } from "data/links";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { PORTFOLIO_PROFILE_LINK_LABELS, PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";

const PROFILE_LINKS = PORTFOLIO_PROFILE_LINK_LABELS.flatMap((label) => {
  const link = LINKS.find((item) => item.label === label);
  return link ? [{ ...link, label }] : [];
});

export const PortfolioProfileLinks = () => (
  <ul aria-label={PORTFOLIO_PROFILE_LINKS_ARIA_LABEL}>
    {PROFILE_LINKS.map((link) => (
      <li key={link.label}>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label}: ${link.value}${EXTERNAL_LINK_NEW_TAB_HINT}`}
          data-analytics-event={`portfolio_profile_link_${link.label.toLowerCase().replace(/\s+/g, "_")}`}
          onClick={() => trackContactLinkClick(link.label)}
        >
          <span>{link.label}</span> <span>{link.value}</span>
        </a>
      </li>
    ))}
  </ul>
);
