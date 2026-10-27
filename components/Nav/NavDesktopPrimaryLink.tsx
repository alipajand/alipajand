import Link from "next/link";
import { navLinkAriaCurrent } from "utils/navAriaCurrent";

interface NavDesktopPrimaryLinkProps {
  pathname: string | null;
  href: string;
  label: string;
}

export const NavDesktopPrimaryLink = ({ pathname, href, label }: NavDesktopPrimaryLinkProps) => {
  return (
    <li>
      <Link href={href} aria-current={navLinkAriaCurrent(href, pathname)}>
        {label}
      </Link>
    </li>
  );
};
