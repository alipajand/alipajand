import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import shell from "highlight.js/lib/languages/shell";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

/*
 * Server-side syntax highlighting for fenced code in posts. Only the languages the posts use are
 * registered, so nothing here reaches the client bundle: the article receives finished HTML with
 * `hljs-*` token classes that the article stylesheet colours.
 */
const LANGUAGES = { bash, javascript, json, markdown, plaintext, shell, typescript, xml, yaml };
for (const [name, language] of Object.entries(LANGUAGES)) {
  if (!hljs.getLanguage(name)) hljs.registerLanguage(name, language);
}

/** Fence names that highlight.js knows under another grammar. */
const ALIASES: Record<string, string> = { tsx: "typescript", jsx: "javascript" };

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The registered grammar for a fence's info string, or `plaintext`. */
export const resolveCodeLanguage = (lang: string | undefined): string => {
  const name = (lang ?? "").trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const mapped = ALIASES[name] ?? name;
  return mapped && hljs.getLanguage(mapped) ? mapped : "plaintext";
};

/**
 * A fenced code block as `<pre><code class="hljs language-…">`. Text is escaped by highlight.js;
 * the class names keep the authored fence name so the language stays visible in the markup.
 */
export const renderHighlightedCode = (code: string, lang: string | undefined): string => {
  const language = resolveCodeLanguage(lang);
  const authored = (lang ?? "").trim().split(/\s+/)[0] ?? "";
  const label = /^[a-z0-9+#-]+$/i.test(authored) ? authored.toLowerCase() : language;
  const highlighted = hljs.highlight(code, { language, ignoreIllegals: true }).value;
  return `<pre><code class="hljs language-${escapeHtml(label)}">${highlighted}</code></pre>\n`;
};
