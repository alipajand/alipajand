export const SKIP_TO_CONTENT_LABEL = "Skip to content";

export const EXTERNAL_LINK_NEW_TAB_HINT = " (opens in new tab)";

export const NOW_PAGE_HEADER_OVERLINE = "Snapshot";

/** Footer control that stops idle motion site-wide; its pressed state says whether it is on. */
export const MOTION_TOGGLE_LABEL = "Pause motion";

/** The "where to go next" row that closes the Now and Engineering Principles pages. */
export const PAGE_NEXT_LINKS_ARIA_LABEL = "More from the site";

export const PAGE_NEXT_LINKS = [
  { eyebrow: "[ Case studies ]", title: "Portfolio", href: "/portfolio" },
  { eyebrow: "[ Notes ]", title: "Writing", href: "/writing" },
  { eyebrow: "[ Contact ]", title: "Get in touch", href: "/#contact" },
] as const;
