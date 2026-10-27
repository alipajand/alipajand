"use client";

import { trackContactLinkClick } from "components/Contact/trackContactLinkClick";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

interface ContactChannelCardProps {
  channel: ContactChannel;
}

export const ContactChannelCard = ({ channel }: ContactChannelCardProps) => {
  return (
    <li>
      <a
        href={channel.href}
        target={channel.href.startsWith("http") ? "_blank" : undefined}
        rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
        data-analytics-event={`contact_link_${channel.label.toLowerCase().replace(/\s+/g, "_")}`}
        aria-label={
          channel.href.startsWith("http")
            ? `${channel.label}: ${channel.value}${EXTERNAL_LINK_NEW_TAB_HINT}`
            : `${channel.label}: ${channel.value}`
        }
        onClick={() => trackContactLinkClick(channel.label)}
      >
        <span>{channel.label}</span> <span>{channel.value}</span>
      </a>
    </li>
  );
};
