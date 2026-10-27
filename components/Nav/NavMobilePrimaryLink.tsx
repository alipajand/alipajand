import Link from "next/link";
import { navLinkAriaCurrent } from "utils/navAriaCurrent";

interface NavMobilePrimaryLinkProps {
  pathname: string | null;
  href: string;
  label: string;
  onNavigate: () => void;
}

export const NavMobilePrimaryLink = ({
  pathname,
  href,
  label,
  onNavigate,
}: NavMobilePrimaryLinkProps) => {
  return (
    <Link href={href} aria-current={navLinkAriaCurrent(href, pathname)} onClick={onNavigate}>
      {label}
    </Link>
  );
};
