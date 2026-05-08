import { trackContactLinkClick } from "components/Contact/trackContactLinkClick";
import {
  CARD_SURFACE_HOVER,
} from "utils/visual";

const ICON_SRC = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
} as const;

type IconLabel = keyof typeof ICON_SRC;

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

interface ContactChannelCardProps {
  channel: ContactChannel;
}

export function ContactChannelCard({ channel }: ContactChannelCardProps) {
  const isEmail = channel.label === "Email";
  const iconSrc = ICON_SRC[channel.label as IconLabel];

  return (
    <li>
      <a
        href={channel.href}
        target={channel.href.startsWith("http") ? "_blank" : undefined}
        rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
        data-analytics-event={`contact_link_${channel.label.toLowerCase()}`}
        aria-label={
          channel.href.startsWith("http")
            ? `${channel.label}: ${channel.value} (opens in new tab)`
            : `${channel.label}: ${channel.value}`
        }
        onClick={() => trackContactLinkClick(channel.label)}
        className={
          isEmail
            ? "hover-lift flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 rounded-xl bg-foreground text-background border border-transparent transition-colors hover:bg-accent-muted hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            : `hover-lift flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 ${CARD_SURFACE_HOVER} text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background`
        }
      >
        <span
          className={
            isEmail
              ? "inline-block size-6 bg-background shrink-0"
              : "inline-block size-6 bg-current text-foreground shrink-0"
          }
          style={{
            maskImage: iconSrc ? `url(${iconSrc})` : undefined,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: iconSrc ? `url(${iconSrc})` : undefined,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
          }}
          aria-hidden
        />
        <span className="min-w-0 text-left">
          <span
            className={
              isEmail
                ? "block text-xs font-semibold uppercase tracking-wider text-background/80"
                : "block text-xs font-semibold uppercase tracking-wider text-muted"
            }
          >
            {channel.label}
          </span>
          <span
            className={`mt-0.5 block text-sm font-medium truncate ${
              isEmail ? "text-background" : "text-foreground"
            }`}
          >
            {channel.value}
          </span>
        </span>
      </a>
    </li>
  );
}
