"use client";

interface SkipLinkProps {
  href: string;
  label: string;
  className?: string;
}

export const SkipLink = ({ href, label, className }: SkipLinkProps) => {
  const handleClick = () => {
    const targetId = href.startsWith("#") ? href.slice(1) : href;
    const target = document.getElementById(targetId);
    if (!target) return;
    requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });
    });
  };
  return (
    <a className={className} href={href} onClick={handleClick}>
      {label}
    </a>
  );
};
