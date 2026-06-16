import { trackGtagEvent } from "utils/analytics";

export const trackContactLinkClick = (label: string): void => {
  trackGtagEvent("contact_link_click", { link_label: label });
};
