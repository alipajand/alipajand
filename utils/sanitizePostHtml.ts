import sanitizeHtml from "sanitize-html";

import { DIAGRAM_SLOT_ATTR } from "utils/diagramBlocks";

/*
 * Build-time allowlist for post HTML. Posts are rendered on the server from Markdown in the repo
 * and shipped as finished HTML, so this runs during the build and nothing here reaches the client.
 * Anything not listed is removed: unknown tags are unwrapped (their text kept), and `script`,
 * `style` and similar tags are dropped with their contents. Heading ids are not accepted from the
 * Markdown; `addHeadingIds` generates them after this step.
 */

/** Schemes a link may use. Anything without a scheme is a relative URL or a `#` fragment. */
const LINK_SCHEMES = ["http", "https", "mailto"];
const IMAGE_SCHEMES = ["http", "https"];

const SCHEME_RE = /^([a-z][a-z0-9+.-]*):/i;

/**
 * The URL a browser would see, reduced to what decides its scheme: leading and trailing C0
 * controls and spaces are trimmed and tabs and newlines removed, as the URL parser does.
 */
const urlHead = (value: string): string =>
  value
    .replace(/^[\u0000- ]+|[\u0000- ]+$/g, "")
    .replace(/[\t\n\r]/g, "")
    .split(/[/?#]/, 1)[0];

/**
 * True when `value` is relative, a fragment, or uses one of `schemes`. Text entities are kept as
 * written (see `parser` below), so a character reference before the first `/`, `?` or `#` is
 * rejected outright: `javascript&colon;…` or `&#x6A;avascript:…` would otherwise reach the
 * browser, which decodes them into a scheme. Protocol-relative URLs (`//host`) are rejected too.
 */
export const isAllowedUrl = (value: string, schemes: readonly string[]): boolean => {
  const head = urlHead(value);
  if (head.includes("&")) return false;
  if (/^[\\/]{2}/.test(value.trim())) return false;
  const scheme = SCHEME_RE.exec(head)?.[1];
  if (scheme) return schemes.includes(scheme.toLowerCase());
  return !head.includes(":");
};

const withAllowedUrl =
  (attribute: "href" | "src", schemes: readonly string[]): sanitizeHtml.Transformer =>
  (tagName, attribs) => {
    const value = attribs[attribute];
    if (value === undefined || isAllowedUrl(value, schemes)) return { tagName, attribs };
    const { [attribute]: _dropped, ...rest } = attribs;
    void _dropped;
    return { tagName, attribs: rest };
  };

const DIAGRAM_SLOT_VALUE_RE = /^\d+$/;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "code",
    "span",
    "img",
    "figure",
    "figcaption",
    "strong",
    "em",
    "del",
    "hr",
    "br",
    "sup",
    "sub",
    // Diagram slots left by `extractDiagramBlocks`; only `data-diagram-slot` is kept.
    "div",
  ],
  allowedAttributes: {
    a: [
      "href",
      "title",
      {
        name: "rel",
        multiple: true,
        values: ["nofollow", "noopener", "noreferrer", "ugc", "sponsored"],
      },
    ],
    img: [
      "src",
      "alt",
      "title",
      "width",
      "height",
      { name: "loading", multiple: false, values: ["lazy", "eager"] },
      { name: "decoding", multiple: false, values: ["async", "sync", "auto"] },
    ],
    ol: ["start"],
    th: [{ name: "align", multiple: false, values: ["left", "center", "right"] }],
    td: [{ name: "align", multiple: false, values: ["left", "center", "right"] }],
    code: ["class"],
    span: ["class"],
    figure: ["class"],
    div: [DIAGRAM_SLOT_ATTR],
  },
  allowedClasses: {
    // `renderHighlightedCode`: `hljs language-<fence>` on the block; `hljs-<scope>` tokens (such
    // as `hljs-built_in`), sub-scope classes (`class_`, `function_`) and `language-<name>` spans
    // that wrap an embedded language (JSX in TSX).
    code: ["hljs", /^language-[a-z0-9+#-]+$/],
    span: [/^hljs-[a-z0-9_-]+$/, /^[a-z0-9]+_+$/, /^language-[a-z0-9+#-]+$/],
    figure: ["article-launch-poster"],
  },
  allowedSchemes: LINK_SCHEMES,
  allowedSchemesByTag: { img: IMAGE_SCHEMES },
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  transformTags: {
    a: withAllowedUrl("href", LINK_SCHEMES),
    img: withAllowedUrl("src", IMAGE_SCHEMES),
    div: (tagName, attribs) => {
      const slot = attribs[DIAGRAM_SLOT_ATTR];
      const kept: sanitizeHtml.Attributes = {};
      if (slot !== undefined && DIAGRAM_SLOT_VALUE_RE.test(slot)) kept[DIAGRAM_SLOT_ATTR] = slot;
      return { tagName, attribs: kept };
    },
  },
  disallowedTagsMode: "discard",
  // Keep character references as written so the output matches the Markdown pipeline byte for
  // byte (`&quot;`, `&#39;` in highlighted code). URLs are checked by `isAllowedUrl`, which does
  // not rely on decoding.
  parser: { decodeEntities: false },
};

export const sanitizePostHtml = (html: string): string => sanitizeHtml(html, SANITIZE_OPTIONS);
