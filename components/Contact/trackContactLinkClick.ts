import { trackGtagEvent } from "utils/analytics";

export function trackContactLinkClick(label: string): void {
  trackGtagEvent("contact_link_click", { link_label: label });
}
