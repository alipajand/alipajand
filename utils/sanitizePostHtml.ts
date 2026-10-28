import sanitizeHtml from "sanitize-html";

import { DIAGRAM_SLOT_ATTR } from "utils/diagramBlocks";

const LINK_SCHEMES = ["http", "https", "mailto"];
export const IMAGE_SCHEMES = ["https"];

const SCHEME_RE = /^([a-z][a-z0-9+.-]*):/i;

const urlHead = (value: string): string =>
  value
    .replace(/^[\u0000- ]+|[\u0000- ]+$/g, "")
    .replace(/[\t\n\r]/g, "")
    .split(/[/?#]/, 1)[0];

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
  parser: { decodeEntities: false },
};

export const sanitizePostHtml = (html: string): string => sanitizeHtml(html, SANITIZE_OPTIONS);
