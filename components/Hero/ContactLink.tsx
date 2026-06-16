import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { FOCUS_RING } from "utils/visual";

interface ContactLinkProps {
  label: string;
  href: string;
  iconSrc?: string;
}

export function ContactLink({ label, href, iconSrc }: ContactLinkProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`text-muted hover:text-foreground transition-colors rounded h-5 min-h-11 min-w-11 inline-flex items-center justify-center ${FOCUS_RING}`}
      aria-label={isExternal ? `${label}${EXTERNAL_LINK_NEW_TAB_HINT}` : label}
    >
      <span
        className="inline-block size-5 bg-current shrink-0"
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
}
