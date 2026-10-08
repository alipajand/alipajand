/** Ali is based in Montreal, so post dates are shown in Eastern time (EST/EDT). */
export const SITE_TIME_ZONE = "America/Toronto";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Date-only values (`2026-09-17`) are anchored at noon UTC so the calendar day
 * stays the same once converted to Eastern time; full timestamps convert as-is.
 */
export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(DATE_ONLY_RE.test(dateStr) ? `${dateStr}T12:00:00Z` : dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: SITE_TIME_ZONE,
    });
  } catch {
    return dateStr;
  }
};
