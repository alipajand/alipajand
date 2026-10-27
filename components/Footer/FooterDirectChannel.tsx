import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

interface FooterDirectChannelProps {
  label: string;
  href: string;
}

export const FooterDirectChannel = ({ label, href }: FooterDirectChannelProps) => {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={isExternal ? `${label}${EXTERNAL_LINK_NEW_TAB_HINT}` : label}
    >
      {label}
    </a>
  );
};
