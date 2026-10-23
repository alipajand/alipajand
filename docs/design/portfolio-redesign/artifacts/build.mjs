// Builds the three P1 concept prototypes from data/projects.ts.
//
//   node docs/design/portfolio-redesign/artifacts/build.mjs
//       Writes index.html and one page per case study into each concept folder.
//   node docs/design/portfolio-redesign/artifacts/build.mjs --publish <dir>
//       Also writes self-contained copies (shared files and media inside each concept) to <dir>,
//       ready to publish as standalone artifacts.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { projects } from "./shared/content.mjs";
import * as a from "./concept-a-editorial/template.mjs";
import * as b from "./concept-b-interface-atlas/template.mjs";
import * as c from "./concept-c-systems-in-motion/template.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const publishAt = process.argv.indexOf("--publish");
const publishDir = publishAt > -1 ? path.resolve(process.argv[publishAt + 1]) : null;

function stripSkeleton(html) {
  return html
    .replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, "")
    .replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/i, "")
    .replace(/<\/head>\s*<body[^>]*>\s*/i, "")
    .replace(/\s*<\/body>\s*<\/html>\s*$/i, "\n");
}

function pagesFor(concept) {
  const pages = { "index.html": concept.indexPage() };
  for (const p of projects) pages[`${p.slug}.html`] = concept.casePage(p);
  return pages;
}

for (const concept of [a, b, c]) {
  const pages = pagesFor(concept);
  const local = path.join(here, concept.dir);
  for (const [file, html] of Object.entries(pages)) {
    fs.writeFileSync(path.join(local, file), html.replaceAll("{{SHARED}}", "../shared/"));
  }
  if (!publishDir) continue;
  const out = path.join(publishDir, concept.dir);
  fs.mkdirSync(path.join(out, "shared", "media"), { recursive: true });
  for (const [file, html] of Object.entries(pages)) {
    let page = html.replaceAll("{{SHARED}}", "shared/");
    // The artifact host wraps the main page in its own document skeleton; the other pages are
    // served as they are and keep theirs.
    if (file === "index.html") page = stripSkeleton(page);
    fs.writeFileSync(path.join(out, file), page);
  }
  for (const f of ["styles.css", "concept.js"])
    fs.copyFileSync(path.join(local, f), path.join(out, f));
  fs.copyFileSync(
    path.join(here, "shared", "behaviour.js"),
    path.join(out, "shared", "behaviour.js")
  );
  for (const m of fs.readdirSync(path.join(here, "shared", "media"))) {
    fs.copyFileSync(path.join(here, "shared", "media", m), path.join(out, "shared", "media", m));
  }
}
console.log(
  `Built ${projects.length + 1} pages for each of 3 concepts${publishDir ? `; publish copies in ${publishDir}` : ""}.`
);
