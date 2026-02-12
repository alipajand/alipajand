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
      className="text-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded h-5"
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
