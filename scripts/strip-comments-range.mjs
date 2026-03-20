/**
 * Removes // and /* *\/ comments from .ts/.tsx/.mts/.cts sources using TypeScript
 * trivia ranges only — does NOT reprint the file (preserves blank lines & formatting).
 * Preserves /// <reference … /> and // @ts-* pragmas.
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = path.resolve(import.meta.dirname, "..");

function shouldPreserveCommentSlice(text, start, end) {
  const slice = text.slice(start, end);
  const trimmed = slice.trim();
  if (/^\/\/\/\s*</.test(trimmed)) return true;
  if (/^\/\/\s*@ts-(expect-error|ignore|nocheck|check)\b/.test(trimmed)) return true;
  if (/^\/\*\*[\s\S]*@jest-environment\b/.test(trimmed)) return true;
  return false;
}

function collectCommentRanges(sourceFile) {
  const text = sourceFile.getFullText();
  const ranges = [];

  function pushRange(start, end) {
    if (start >= end) return;
    if (shouldPreserveCommentSlice(text, start, end)) return;
    ranges.push([start, end]);
  }

  function visit(node) {
    ts.forEachLeadingCommentRange(text, node.pos, (pos, end) => {
      pushRange(pos, end);
    });
    ts.forEachChild(node, visit);
    ts.forEachTrailingCommentRange(text, node.end, (pos, end) => {
      pushRange(pos, end);
    });
  }

  visit(sourceFile);

  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [];
  for (const [s, e] of ranges) {
    const prev = merged[merged.length - 1];
    if (prev && s <= prev[1]) {
      prev[1] = Math.max(prev[1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

function stripTsComments(content, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const ranges = collectCommentRanges(sourceFile);
  let out = content;
  for (let i = ranges.length - 1; i >= 0; i--) {
    const [s, e] = ranges[i];
    out = out.slice(0, s) + out.slice(e);
  }
  return out;
}

function stripCssCommentsPreserveStrings(content) {
  let out = "";
  let i = 0;
  const n = content.length;
  while (i < n) {
    const c = content[i];
    const next = content[i + 1];

    if (c === '"' || c === "'") {
      const quote = c;
      out += c;
      i++;
      while (i < n) {
        const ch = content[i];
        out += ch;
        if (ch === "\\" && i + 1 < n) {
          out += content[i + 1];
          i += 2;
          continue;
        }
        if (ch === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    if (c === "/" && next === "*") {
      let j = i + 2;
      while (j + 1 < n && !(content[j] === "*" && content[j + 1] === "/")) {
        j++;
      }
      if (j + 1 < n) {
        j += 2;
      } else {
        j = n;
      }
      i = j;
      continue;
    }

    out += c;
    i++;
  }
  return out;
}

function walk(dir, exts, acc) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name === "dist") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(p, exts, acc);
    } else if (exts.some((ext) => ent.name.endsWith(ext))) {
      acc.push(p);
    }
  }
}

function main() {
  const tsFiles = [];
  walk(ROOT, [".ts", ".tsx", ".mts", ".cts"], tsFiles);
  for (const file of tsFiles) {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith("scripts" + path.sep) && rel.endsWith("strip-comments-range.mjs")) continue;
    const before = fs.readFileSync(file, "utf8");
    const after = stripTsComments(before, path.basename(file));
    if (after !== before) {
      fs.writeFileSync(file, after, "utf8");
    }
  }

  const cssPath = path.join(ROOT, "app", "globals.css");
  if (fs.existsSync(cssPath)) {
    const before = fs.readFileSync(cssPath, "utf8");
    const after = stripCssCommentsPreserveStrings(before);
    if (after !== before) {
      fs.writeFileSync(cssPath, after, "utf8");
    }
  }
}

main();
