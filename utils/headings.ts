export interface PostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const HEADING_RE = /<h([23])>([\s\S]*?)<\/h\1>/g;

const TAG_RE = /<[^<>]*>/g;

const stripTags = (html: string): string => {
  let previous: string;
  let current = html;
  do {
    previous = current;
    current = current.replace(TAG_RE, "");
  } while (current !== previous);
  return current;
};

/**
 * Plain-text label for a heading's inner HTML. `&amp;` is decoded last so an
 * escaped entity can't turn into markup, and any angle brackets left over are
 * dropped because the outline only needs readable text.
 */
export const headingText = (innerHtml: string): string =>
  stripTags(innerHtml)
    .replace(/&lt;|&gt;/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const slugifyHeading = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

/**
 * Adds stable ids to h2/h3 elements and returns the outline used by the
 * table of contents. Duplicate titles get a numeric suffix.
 */
export const addHeadingIds = (html: string): { html: string; headings: PostHeading[] } => {
  const headings: PostHeading[] = [];
  const seen = new Map<string, number>();

  const output = html.replace(HEADING_RE, (_, level: string, inner: string) => {
    const text = headingText(inner);
    const base = slugifyHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: output, headings };
};
