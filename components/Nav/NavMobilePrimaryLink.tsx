import { navLinkAriaCurrent } from "utils/navAriaCurrent";
import { FOCUS_RING } from "utils/visual";

interface NavMobilePrimaryLinkProps {
  pathname: string | null;
  href: string;
  label: string;
  onNavigate: () => void;
}

export function NavMobilePrimaryLink({
  pathname,
  href,
  label,
  onNavigate,
}: NavMobilePrimaryLinkProps) {
  return (
    <a
      href={href}
      aria-current={navLinkAriaCurrent(href, pathname)}
      className={`font-medium text-foreground hover:text-muted transition-colors py-3 min-h-11 inline-flex items-center rounded-sm ${FOCUS_RING}`}
      onClick={onNavigate}
    >
      {label}
    </a>
  );
}
