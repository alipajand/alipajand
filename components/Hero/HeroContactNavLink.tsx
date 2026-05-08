import { ContactLink } from "components/Hero/ContactLink";

const ICON_SRC = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
} as const;

type IconLabel = keyof typeof ICON_SRC;

interface HeroContactNavLinkProps {
  label: string;
  href: string;
}

export function HeroContactNavLink({ label, href }: HeroContactNavLinkProps) {
  const iconSrc = ICON_SRC[label as IconLabel];
  return <ContactLink label={label} href={href} iconSrc={iconSrc} />;
}
