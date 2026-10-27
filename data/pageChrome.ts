export const SKIP_TO_CONTENT_LABEL = "Skip to content";

export const EXTERNAL_LINK_NEW_TAB_HINT = " (opens in new tab)";

export const NOW_PAGE_HEADER_OVERLINE = "Snapshot";

/**
 * Footer control for automatic motion: the status-dot blink and any idle frame loop. Scroll- and
 * pointer-driven motion is not affected. The label names the action the button performs next.
 */
export const MOTION_PAUSE_LABEL = "Pause automatic motion";
export const MOTION_RESUME_LABEL = "Resume automatic motion";
/** Shown instead of the button while the operating system asks for reduced motion. */
export const MOTION_REDUCED_LABEL = "Automatic motion off (system setting)";

/** The "where to go next" row that closes the Now and Engineering Principles pages. */
export const PAGE_NEXT_LINKS_ARIA_LABEL = "More from the site";

export const PAGE_NEXT_LINKS = [
  { eyebrow: "[ Case studies ]", title: "Portfolio", href: "/portfolio" },
  { eyebrow: "[ Notes ]", title: "Writing", href: "/writing" },
  { eyebrow: "[ Contact ]", title: "Get in touch", href: "/#contact" },
] as const;
