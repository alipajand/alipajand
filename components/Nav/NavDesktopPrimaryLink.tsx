import { navLinkAriaCurrent } from "utils/navAriaCurrent";
import { FOCUS_RING } from "utils/visual";

interface NavDesktopPrimaryLinkProps {
  pathname: string | null;
  href: string;
  label: string;
}

export function NavDesktopPrimaryLink({ pathname, href, label }: NavDesktopPrimaryLinkProps) {
  return (
    <li>
      <a
        href={href}
        aria-current={navLinkAriaCurrent(href, pathname)}
        className={`nav-link-hover text-sm text-muted hover:text-foreground transition-colors duration-200 relative rounded-sm ${FOCUS_RING}`}
      >
        {label}
      </a>
    </li>
  );
}
