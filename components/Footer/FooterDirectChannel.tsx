import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { FOCUS_RING } from "utils/visual";

const ICON_SRC = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
} as const;

type IconLabel = keyof typeof ICON_SRC;

interface FooterDirectChannelProps {
  label: string;
  href: string;
}

export const FooterDirectChannel = ({ label, href }: FooterDirectChannelProps) => {
  const iconSrc = ICON_SRC[label as IconLabel];
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`group inline-flex flex-col items-center gap-2 rounded-sm p-2 text-muted transition-colors hover:text-foreground ${FOCUS_RING}`}
      aria-label={isExternal ? `${label}${EXTERNAL_LINK_NEW_TAB_HINT}` : label}
    >
      <span
        className="inline-block size-5 shrink-0 bg-current transition-transform group-hover:scale-105"
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
    </a>
  );
};
