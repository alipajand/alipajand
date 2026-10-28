export const SITE_TIME_ZONE = "America/Toronto";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

const formatWith = (dateStr: string, month: "long" | "short"): string => {
  try {
    const d = new Date(DATE_ONLY_RE.test(dateStr) ? `${dateStr}T12:00:00Z` : dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month,
      day: "numeric",
      timeZone: SITE_TIME_ZONE,
    });
  } catch {
    return dateStr;
  }
};

export const formatDate = (dateStr: string): string => formatWith(dateStr, "long");

export const formatShortDate = (dateStr: string): string => formatWith(dateStr, "short");
