// Assembles the design pages in docs/design/pages from this kit and the site's own content
// (data/*.ts and content/posts). Usage: node docs/design/kit/build.mjs [--preview <dir>]
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import hljs from "highlight.js/lib/common";
import { load } from "js-yaml";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";

const KIT = dirname(fileURLToPath(import.meta.url));
const ROOT = join(KIT, "..", "..", "..");
const OUT = join(KIT, "..", "pages");
const previewAt = process.argv.indexOf("--preview");
const PREVIEW = previewAt > -1 ? process.argv[previewAt + 1] : null;

const kit = (name) => readFileSync(join(KIT, name), "utf-8");
const fromRoot = (path) => import(pathToFileURL(join(ROOT, path)).href);
const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const dataUri = (path, type) => `data:${type};base64,${readFileSync(path).toString("base64")}`;

const { PROJECTS, PORTFOLIO_CASE_STUDY_ORDER } = await fromRoot("data/projects.ts");
const { ENGINEERING_PRINCIPLES_SECTIONS } = await fromRoot("data/engineeringPrinciples.ts");
const { NOW_PAGE_TITLE, NOW_LEDE, NOW_SECTIONS } = await fromRoot("data/now.ts");
const { NOW_PAGE_HEADER_OVERLINE } = await fromRoot("data/pageChrome.ts");
const notFound = await fromRoot("data/notFound.ts");
const mcp = await fromRoot("data/diagrams.ts");
const { extractDiagramBlocks } = await fromRoot("utils/diagramBlocks.ts");
const { addHeadingIds } = await fromRoot("utils/headings.ts");

// ── Links ──
// urls.json maps site paths to published artifact pages. "/writing/*" is the article reader,
// which opens a post from its slug in the hash. Anything unmapped points at the live site.
const URLS = JSON.parse(kit("urls.json"));
const link = (path) => {
  if (!path.startsWith("/")) return path;
  if (URLS[path]) return URLS[path];
  const post = path.match(/^\/writing\/([a-z0-9-]+)$/);
  if (post && URLS["/writing/*"]) return `${URLS["/writing/*"]}#${post[1]}`;
  return `https://alipajand.com${path}`;
};
const LEGACY = { HOME: "/", WORK: "/portfolio", OS: "/open-source", WRITING: "/writing", POST: "/writing/agent-readiness-doctor", PRINCIPLES: "/engineering-principles" };
const resolveLinks = (html) =>
  html
    .replace(/@@U_([A-Z]+)@@/g, (_, k) => link(LEGACY[k]))
    .replace(/@@L:([^@]+)@@/g, (_, p) => link(p))
    .replace(/href="https:\/\/alipajand\.com(\/[^"#]*)"/g, (m, p) => `href="${link(p)}"`)
    .replace(/href="(\/[^"]*)"/g, (_, p) => `href="${link(p)}"`);
const linkRuntime = `  const LINKS = ${json(URLS)};
  const link = (p) => LINKS[p] || (/^\\/writing\\/[a-z0-9-]+$/.test(p) && LINKS["/writing/*"] ? LINKS["/writing/*"] + "#" + p.slice(9) : "https://alipajand.com" + p);
`;

// ── Page chrome ──
const HEAD = `<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Geist+Mono:wght@400;500&display=swap">`;
const nav = (current) => {
  const links = [["work", "Work", "/portfolio"], ["writing", "Writing", "/writing"], ["os", "Open source", "/open-source"], ["contact", "Contact", "/"]];
  const items = links
    .map(([k, label, path]) => `        <a href="${link(path)}${k === "contact" ? "#contact" : ""}"${k === current ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("\n");
  return `<header class="nav" aria-label="Site">
      <a class="nav__name" href="${link("/")}">Ali Pajand</a>
      <nav class="nav__links" aria-label="Primary">
${items}
      </nav>
      <div class="nav__cta">
        <span><span class="dot" aria-hidden="true"></span>Open to roles</span>
        <a href="https://calendly.com/alipajand/intro">Book a call</a>
      </div>
      <span class="progress" id="progress" aria-hidden="true"></span>
    </header>`;
};
const FOOT = `<footer class="foot mono">
      <span>Ali Pajand</span>
      <span>Montreal, Quebec, Canada</span>
      <span>alipajand.com · 2026</span>
    </footer>`;
const CHEVRONS = '<svg viewBox="0 0 40 60"><path d="M6 4 L32 30 L6 56"/></svg>'.repeat(12);
const STAR = '<svg class="star" viewBox="0 0 20 20" aria-hidden="true"><use href="#spark"/></svg>';

// The display word splits into two parts around the star: at the first space, else at the camel-case join.
const displayParts = (name) => {
  const space = name.indexOf(" ");
  if (space > 0) return [name.slice(0, space), name.slice(space + 1)];
  const camel = name.match(/^([A-Z][a-z]+)([A-Z].*)$/);
  return camel ? [camel[1], camel[2]] : [name, "Case study"];
};
const display = (name) => {
  const [a, b] = displayParts(name);
  return `<h1 class="name" data-part data-grow aria-label="${name}">
      <span>${a}</span>
      ${STAR}
      <span>${b}</span>
    </h1>`;
};

// ── Content ──
// Lines with 80% or 90% figures stay off these pages.
const HIDDEN_FIGURE = /\b[89]0%/;
const scrubCase = (project) => {
  const cs = structuredClone(project.caseStudy);
  for (const key of ["myRole", "whatIBuilt", "uxDecisions", "outcome", "nextImprovements"]) {
    cs[key] = (cs[key] ?? []).filter((line) => !HIDDEN_FIGURE.test(line));
  }
  for (const { spec } of cs.diagrams ?? []) {
    for (const node of [...(spec.steps ?? []), ...(spec.layers ?? [])]) {
      if (HIDDEN_FIGURE.test(node.detail ?? "")) delete node.detail;
    }
    for (const column of spec.columns ?? []) column.items = column.items.filter((x) => !HIDDEN_FIGURE.test(x));
  }
  return { ...project, caseStudy: cs };
};
const caseImages = (project) =>
  Object.fromEntries(
    (project.caseStudy.interfaceEvidence ?? []).map((f) => {
      const name = f.src.split("/").pop().replace(/\.png$/, "");
      return [name, dataUri(join(KIT, "img", `${name}.jpg`), "image/jpeg")];
    })
  );

marked.use(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight: (code, lang) => {
      const language = { tsx: "typescript", jsx: "javascript" }[lang] ?? lang;
      return hljs.highlight(code, { language: language && hljs.getLanguage(language) ? language : "plaintext" }).value;
    },
  })
);
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const POSTS_DIR = join(ROOT, "content", "posts");
const posts = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
  .map((file) => {
    const [, front, body] = readFileSync(join(POSTS_DIR, file), "utf-8").match(FRONTMATTER);
    const fm = load(front);
    return { slug: file.replace(/\.md$/, ""), title: fm.title, date: fm.date, excerpt: fm.excerpt, tags: fm.tags ?? [], featured: fm.featured === true, body };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const mcpFlow = (caption) => ({
  type: "flow",
  title: mcp.MCP_WORKFLOW_DIAGRAM_TITLE,
  steps: [
    { label: mcp.MCP_WORKFLOW_DIAGRAM_EDITOR_LABEL, detail: mcp.MCP_WORKFLOW_DIAGRAM_EDITOR_SUBLABEL },
    { label: mcp.MCP_WORKFLOW_DIAGRAM_SERVER_LABEL, detail: mcp.MCP_WORKFLOW_DIAGRAM_SERVER_SUBLABEL },
    { label: mcp.MCP_WORKFLOW_DIAGRAM_CHECKS_LABEL, detail: `${mcp.MCP_WORKFLOW_DIAGRAM_CHECKS_SUBLABEL_CI} · ${mcp.MCP_WORKFLOW_DIAGRAM_CHECKS_SUBLABEL_OUTPUT}` },
  ],
  loop: mcp.MCP_WORKFLOW_DIAGRAM_FEEDBACK_LABEL,
  ...(caption ? { caption } : {}),
});
const readerPost = (post) => {
  const { markdown, diagrams } = extractDiagramBlocks(post.body);
  const { html, headings } = addHeadingIds(marked.parse(markdown, { async: false }));
  const withImages = html.replace(/src="\/portfolio-media\/([\w-]+)\.png"/g, (_, name) => `src="${dataUri(join(KIT, "img", `${name}.jpg`), "image/jpeg")}"`);
  return {
    slug: post.slug, title: post.title, date: post.date, excerpt: post.excerpt, tags: post.tags,
    html: resolveLinks(withImages),
    headings: headings.filter((h) => h.level === 2),
    diagrams: diagrams.map((d) => (d.type === "mcp-workflow" ? mcpFlow(d.caption) : d)),
  };
};

// ── Assembly ──
const fill = (src, extra = {}) => {
  let s = kit(src)
    .replace("@@HEAD@@", HEAD)
    .replace("@@BASE_CSS@@", kit("base.css") + kit("diagrams.css"))
    .replace("@@BASE_JS@@", kit("base.js") + linkRuntime + kit("diagrams.js"))
    .replace("@@CHROME@@", kit("chrome.html"))
    .replace("@@FOOT@@", FOOT)
    .replaceAll("@@CHEVRONS@@", CHEVRONS)
    .replace(/@@NAV:(\w+)@@/g, (_, current) => nav(current));
  for (const [key, value] of Object.entries(extra)) s = s.replaceAll(`@@${key}@@`, value);
  s = resolveLinks(s);
  const left = s.match(/@@[A-Z_:]+@@/g);
  if (left) throw new Error(`${src}: unfilled ${left.join(", ")}`);
  return s;
};
// Every page, hand-built or generated, gets the shared title fitter (kit/fit.js) at the end.
const FIT = `\n<script>\n${kit("fit.js")}</script>\n`;
const write = (out, page) => {
  const html = page.trimEnd() + FIT;
  writeFileSync(join(OUT, out), html);
  if (PREVIEW) {
    const meta = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n';
    writeFileSync(join(PREVIEW, out.replace(/\.html$/, "-pv.html")), meta + html);
  }
  console.log(out.padEnd(34), `${Math.round(html.length / 1024)} KB`);
};

mkdirSync(OUT, { recursive: true });
for (const page of ["home", "portfolio", "open-source"]) write(`${page}.html`, resolveLinks(kit(`static/${page}.html`)));

write("writing.html", fill("writing.src.html", { POSTS_JSON: json(posts.map(({ body, ...summary }) => summary)) }));
write("agent-readiness-doctor.html", fill("post.src.html", { POSTER: dataUri(join(ROOT, "public/writing/agent-readiness-doctor-poster.png"), "image/png") }));
write("engineering-principles.html", fill("principles.src.html", { PRINCIPLES_JSON: json(ENGINEERING_PRINCIPLES_SECTIONS) }));

const cases = PORTFOLIO_CASE_STUDY_ORDER.map((slug) => PROJECTS.find((p) => p.slug === slug));
cases.forEach((project, i) => {
  const next = cases[i + 1];
  write(`case-${project.slug}.html`, fill("case.src.html", {
    CASE_NAME: project.name,
    CASE_DISPLAY: display(project.name),
    CASE_JSON: json(scrubCase(project)),
    CASE_IMG: json(caseImages(project)),
    NEXT_JSON: json(next ? { name: next.name, href: link(`/portfolio/${next.slug}`) } : null),
  }));
});

const readerPosts = posts.filter((p) => p.slug !== "agent-readiness-doctor").map(readerPost);
write("writing-reader.html", fill("reader.src.html", { READER_JSON: json(readerPosts) }));
write("now.html", fill("now.src.html", { NOW_JSON: json({ overline: NOW_PAGE_HEADER_OVERLINE, title: NOW_PAGE_TITLE, lede: NOW_LEDE, sections: NOW_SECTIONS }) }));
write("not-found.html", fill("not-found.src.html", { NOT_FOUND_JSON: json(notFound) }));

// The design system's component stylesheet is the kit's CSS with the colour tokens left to its tokens.css.
const caseCss = kit("case.src.html").split("@@BASE_CSS@@")[1].split("</style>")[0];
const bundleCss = `/* Pajand Hairline: component styles, generated by docs/design/kit/build.mjs from the page kit. */
${kit("base.css").replace(/:root \{[\s\S]*?\n  \}/, `:root {
    --display: var(--font-display);
    --sans: var(--font-sans);
    --mono: var(--font-mono);
    --gutter-l: max(16px, env(safe-area-inset-left, 0px));
    --gutter-r: max(16px, env(safe-area-inset-right, 0px));
    color-scheme: dark;
  }`)}${kit("diagrams.css")}${caseCss}`;
writeFileSync(join(KIT, "..", "system", "project", "components", "bundle.css"), bundleCss);
console.log("system/project/components/bundle.css".padEnd(34), `${Math.round(bundleCss.length / 1024)} KB`);
