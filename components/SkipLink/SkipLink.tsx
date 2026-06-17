"use client";

interface SkipLinkProps {
  href: string;
  label: string;
}

export const SkipLink = ({ href, label }: SkipLinkProps) => {
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
    <a href={href} className="skip-link" onClick={handleClick}>
      {label}
    </a>
  );
};
