import { FOCUS_RING } from "utils/visual";

interface ContactLinkProps {
  label: string;
  href: string;
  iconSrc?: string;
}

export function ContactLink({ label, href, iconSrc }: ContactLinkProps) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`text-muted hover:text-foreground transition-colors rounded h-5 min-h-11 min-w-11 inline-flex items-center justify-center ${FOCUS_RING}`}
      aria-label={label}
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
