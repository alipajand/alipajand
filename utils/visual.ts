export const SECTION_X = "px-6 sm:px-10 lg:px-20";

export const SECTION_Y = "py-20 sm:py-24 lg:py-28";

export const SECTION_Y_BRIDGE = "py-14 sm:py-16 lg:py-20";

export const SECTION_RULE = "border-t border-border";

export const SECTION_SHELL = `${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`;
export const SECTION_SHELL_BRIDGE = `${SECTION_X} ${SECTION_Y_BRIDGE} ${SECTION_RULE}`;

export const SECTION_INNER = "max-w-5xl mx-auto w-full";
export const SECTION_INNER_WIDE = "max-w-5xl mx-auto w-full";

export const SECTION_TITLE =
  "font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground";

export const SECTION_TITLE_COMPACT =
  "font-display font-bold tracking-tight text-2xl sm:text-3xl text-foreground";

export const SECTION_LEDE = "text-muted text-[15px] sm:text-base leading-relaxed";

export const SECTION_LEDE_LG = "text-muted text-base sm:text-lg leading-relaxed";

export const CARD_SURFACE =
  "rounded-xl border border-border/70 bg-card/50 transition-colors duration-200";

export const CARD_SURFACE_HOVER = `${CARD_SURFACE} hover:border-foreground/25 hover:bg-card/70`;

export const CARD_ACCENT_RAIL =
  "border border-border/70 bg-card/50 border-l-[3px] border-l-[var(--organic-orange)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors duration-200 hover:border-foreground/25 hover:bg-card/70";

export const CARD_ACCENT = `rounded-xl ${CARD_ACCENT_RAIL}`;

export const LABEL_OVERLINE = "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const CTA_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background text-sm font-semibold tracking-tight hover:bg-accent-muted hover:text-background transition-colors ${FOCUS_RING}`;

export const CTA_SECONDARY = `inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:border-foreground/35 hover:bg-card/50 transition-colors ${FOCUS_RING}`;

export const CTA_TERTIARY = `inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors ${FOCUS_RING}`;
