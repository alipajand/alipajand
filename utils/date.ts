export const SITE_TIME_ZONE = "America/Toronto";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

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

export const isPostPublished = (date: string, now = new Date()): boolean => {
  if (DATE_ONLY_RE.test(date)) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: SITE_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const value = (type: string) => parts.find((part) => part.type === type)?.value;
    const today = `${value("year")}-${value("month")}-${value("day")}`;
    return !Number.isNaN(Date.parse(date)) && date <= today;
  }
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) && timestamp <= now.getTime();
};
