import Link from "next/link";
import { navLinkAriaCurrent } from "utils/navAriaCurrent";
import { FOCUS_RING } from "utils/visual";

interface NavDesktopPrimaryLinkProps {
  pathname: string | null;
  href: string;
  label: string;
}

export const NavDesktopPrimaryLink = ({ pathname, href, label }: NavDesktopPrimaryLinkProps) => {
  return (
    <li>
      <Link
        href={href}
        aria-current={navLinkAriaCurrent(href, pathname)}
        className={`nav-link-hover inline-flex min-h-11 items-center text-sm text-muted hover:text-foreground transition-colors duration-200 relative rounded-sm ${FOCUS_RING}`}
      >
        {label}
      </Link>
    </li>
  );
};
