import type { ReactNode } from "react";
import Link from "next/link";

interface IntroLink {
  text: string;
  href: string;
}

interface PortfolioIntroParagraphProps {
  text: string;
  links: readonly IntroLink[];
}

/** Renders a paragraph, linking the first occurrence of each phrase in `links`. */
export const PortfolioIntroParagraph = ({ text, links }: PortfolioIntroParagraphProps) => {
  const matches = links
    .map((link) => ({ ...link, index: text.indexOf(link.text) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index);

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.index < cursor) continue;
    parts.push(text.slice(cursor, match.index));
    parts.push(
      <Link key={`${match.href}-${match.index}`} href={match.href}>
        {match.text}
      </Link>
    );
    cursor = match.index + match.text.length;
  }
  parts.push(text.slice(cursor));

  return <p>{parts}</p>;
};
