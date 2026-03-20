/**
 * Fires a GA4 event when `gtag` is present (see `components/Analytics/Analytics.tsx`).
 * Safe to call from client components; no-ops on the server or when analytics is disabled.
 */
export function trackGtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, params ?? {});
  }
}
