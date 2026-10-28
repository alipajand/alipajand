/** @jest-environment node */

jest.mock("marked", () =>
  jest.requireActual(
    jest
      .requireActual<typeof import("path")>("path")
      .join(process.cwd(), "node_modules/marked/lib/marked.umd.js")
  )
);

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { marked } from "marked";

import { proseSegments } from "features/writing/proseHtml";
import { extractDiagramBlocks } from "utils/diagramBlocks";
import { addHeadingIds } from "utils/headings";
import { renderPostHtml } from "utils/posts";
import { IMAGE_SCHEMES, isAllowedUrl, sanitizePostHtml } from "utils/sanitizePostHtml";

const html = (markdown: string): string => renderPostHtml(markdown).html.trim();

const LABELS = { table: "Table", code: "Code" };

const unsanitised = (markdown: string): string => {
  const { markdown: withSlots } = extractDiagramBlocks(markdown);
  return addHeadingIds(marked.parse(withSlots, { async: false }) as string).html;
};

const POSTS_DIR = join(process.cwd(), "content", "posts");
const postBodies = readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = readFileSync(join(POSTS_DIR, file), "utf8");
    return [file, raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")] as const;
  });

describe("sanitizePostHtml", () => {
  describe("approved content", () => {
    it.each(postBodies)("should leave %s byte for byte unchanged", (_file, body) => {
      expect(renderPostHtml(body).html).toBe(unsanitised(body));
    });

    it("should keep headings with the existing stable ids", () => {
      const { html: out, headings } = renderPostHtml(
        "## Why it’s here\n\n### Step & detail\n\n## Why it’s here\n"
      );
      expect(out).toBe(
        '<h2 id="why-its-here">Why it’s here</h2>\n' +
          '<h3 id="step-detail">Step &amp; detail</h3>\n' +
          '<h2 id="why-its-here-2">Why it’s here</h2>\n'
      );
      expect(headings).toEqual([
        { id: "why-its-here", text: "Why it’s here", level: 2 },
        { id: "step-detail", text: "Step & detail", level: 3 },
        { id: "why-its-here-2", text: "Why it’s here", level: 2 },
      ]);
    });

    it("should keep links with http, https, mailto, relative and fragment targets", () => {
      expect(
        html(
          "[a](https://example.com/x?y=1&z=2) [b](http://example.com) [c](mailto:me@example.com) " +
            '[d](/writing/x "Title") [e](./x) [f](../x) [g](#section) <https://example.com>'
        )
      ).toBe(
        '<p><a href="https://example.com/x?y=1&amp;z=2">a</a> <a href="http://example.com">b</a> ' +
          '<a href="mailto:me@example.com">c</a> <a href="/writing/x" title="Title">d</a> ' +
          '<a href="./x">e</a> <a href="../x">f</a> <a href="#section">g</a> ' +
          '<a href="https://example.com">https://example.com</a></p>'
      );
    });

    it("should keep an authored rel but drop unknown rel tokens and target", () => {
      expect(html('<a href="https://example.com" rel="nofollow evil" target="_blank">x</a>')).toBe(
        '<p><a href="https://example.com" rel="nofollow">x</a></p>'
      );
    });

    it("should keep paragraphs, lists, blockquotes and inline formatting", () => {
      expect(
        html(
          "**b** _i_ ~~d~~ <sup>1</sup> <sub>2</sub> a  \nb\n\n- one\n- two\n\n3. three\n4. four\n\n> quote\n\n---\n"
        )
      ).toBe(
        "<p><strong>b</strong> <em>i</em> <del>d</del> <sup>1</sup> <sub>2</sub> a<br />b</p>\n" +
          "<ul>\n<li>one</li>\n<li>two</li>\n</ul>\n" +
          '<ol start="3">\n<li>three</li>\n<li>four</li>\n</ol>\n' +
          "<blockquote>\n<p>quote</p>\n</blockquote>\n<hr />"
      );
    });

    it("should keep tables with column alignment", () => {
      expect(html("| a | b | c |\n|:--|:-:|--:|\n| 1 | 2 | 3 |\n")).toBe(
        '<table>\n<thead>\n<tr>\n<th align="left">a</th>\n<th align="center">b</th>\n' +
          '<th align="right">c</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align="left">1</td>\n' +
          '<td align="center">2</td>\n<td align="right">3</td>\n</tr>\n</tbody></table>'
      );
    });

    it("should keep highlighted code with its highlight.js classes", () => {
      const out = html(
        '```tsx\nclass A extends B { f(x: string): void { return <div className="a" />; } }\n```\n'
      );
      expect(out).toMatch(/^<pre><code class="hljs language-tsx">/);
      for (const name of [
        "hljs-keyword",
        'hljs-title class_"',
        "hljs-title class_ inherited__",
        "hljs-built_in",
        "language-xml",
        "hljs-tag",
        "hljs-attr",
        "hljs-string",
      ]) {
        expect(out).toContain(`<span class="${name}`);
      }
      expect(out).toContain("&quot;a&quot;");
    });

    it("should keep images with their dimensions and loading hints", () => {
      expect(
        html(
          '![Alt](/a.png "T")\n\n<figure class="article-launch-poster"><img src="https://example.com/b.png" ' +
            'width="10" height="20" alt="B" loading="lazy" decoding="async" /><figcaption>Cap</figcaption></figure>\n'
        )
      ).toBe(
        '<p><img src="/a.png" alt="Alt" title="T" /></p>\n' +
          '<figure class="article-launch-poster"><img src="https://example.com/b.png" width="10" height="20" ' +
          'alt="B" loading="lazy" decoding="async" /><figcaption>Cap</figcaption></figure>'
      );
    });

    it("should drop an http image source and keep https and relative ones", () => {
      expect(
        html(
          '<img src="http://example.com/a.png" alt="A" />\n\n' +
            '<img src="HTTP://example.com/b.png" alt="B" />\n\n' +
            '<img src="https://example.com/c.png" alt="C" />\n\n' +
            '<img src="/d.png" alt="D" />\n'
        )
      ).toBe(
        '<img alt="A" /><img alt="B" />' +
          '<img src="https://example.com/c.png" alt="C" /><img src="/d.png" alt="D" />'
      );
    });

    it("should keep diagram slots so the article still renders its diagrams", () => {
      const markdown = [
        "## First",
        "",
        "```diagram",
        "type: flow",
        "title: One",
        "steps:",
        "  - label: A",
        "  - label: B",
        "```",
        "",
        "Between.",
        "",
        "```diagram",
        "type: mcp-workflow",
        "```",
        "",
      ].join("\n");
      const { html: out, diagrams } = renderPostHtml(markdown);
      expect(out).toContain('<div data-diagram-slot="0"></div>');
      expect(out).toContain('<div data-diagram-slot="1"></div>');
      expect(diagrams.map((diagram) => diagram.type)).toEqual(["flow", "mcp-workflow"]);
      expect(proseSegments(out, LABELS).map((segment) => segment.kind)).toEqual([
        "html",
        "diagram",
        "html",
        "diagram",
      ]);
      expect(proseSegments(out, LABELS)[1]).toEqual({
        kind: "diagram",
        index: 0,
        sectionId: "first",
      });
    });
  });

  describe("unsafe input", () => {
    it.each([
      ["raw HTML block", '<div class="x" style="color:red">block</div>\n', "<div>block</div>"],
      [
        "inline HTML",
        'text <span class="x" style="color:red">inline</span> <b>bold</b> <u>u</u>\n',
        "<p>text <span>inline</span> bold u</p>",
      ],
      ["script block", "<script>alert(1)</script>\n", ""],
      ["inline script", "a <script>alert(1)</script> b\n", "<p>a  b</p>"],
      ["iframe", '<iframe src="https://evil.example"></iframe>\n', ""],
      ["iframe srcdoc", '<iframe srcdoc="<script>alert(1)</script>"></iframe>\n', ""],
      ["style", "<style>body{display:none}</style>\n", ""],
      ["object and embed", '<object data="x.swf"></object><embed src="x.swf">\n', "<p></p>"],
      ["img onerror", '<img src="x" onerror="alert(1)">\n', '<img src="x" />'],
      [
        "a onclick",
        '<a href="https://example.com" onclick="alert(1)" onmouseover="alert(2)">x</a>\n',
        '<p><a href="https://example.com">x</a></p>',
      ],
      ["p onclick", '<p onclick="alert(1)">x</p>\n', "<p>x</p>"],
      ["Markdown javascript: link", "[x](javascript:alert(1))\n", "<p><a>x</a></p>"],
      ["Markdown mixed-case scheme", "[x](JaVaScRiPt:alert(1))\n", "<p><a>x</a></p>"],
      ["Markdown vbscript: link", "[x](vbscript:msgbox(1))\n", "<p><a>x</a></p>"],
      ["Markdown data: link", "[x](data:text/html;base64,PHNjcmlwdD4=)\n", "<p><a>x</a></p>"],
      ["Markdown javascript: image", "![x](javascript:alert(1))\n", '<p><img alt="x" /></p>'],
      [
        "Markdown data: image",
        "![x](data:image/svg+xml;base64,PHN2Zy8+)\n",
        '<p><img alt="x" /></p>',
      ],
      ["javascript: autolink", "<javascript:alert(1)>\n", "<p><a>javascript:alert(1)</a></p>"],
      ["raw javascript: link", '<a href="javascript:alert(1)">x</a>\n', "<p><a>x</a></p>"],
      ["raw link with whitespace", '<a href=" java\tscript:alert(1)">x</a>\n', "<p><a>x</a></p>"],
      ["raw vbscript: link", '<a href="vbscript:msgbox(1)">x</a>\n', "<p><a>x</a></p>"],
      ["raw data: link", '<a href="data:text/html,<b>x</b>">x</a>\n', "<p><a>x</a></p>"],
      ["raw javascript: image", '<img src="javascript:alert(1)">\n', "<img />"],
      ["raw data: image", '<img src="data:image/svg+xml,<svg onload=alert(1)>">\n', "<img />"],
      ["protocol-relative image", '<img src="//evil.example/x.png">\n', "<img />"],
      ["Markdown &colon; link", "[x](javascript&colon;alert(1))\n", "<p><a>x</a></p>"],
      ["raw &colon; link", '<a href="javascript&colon;alert(1)">x</a>\n', "<p><a>x</a></p>"],
      ["raw &#58; link", '<a href="javascript&#58;alert(1)">x</a>\n', "<p><a>x</a></p>"],
      ["raw &#x6A; link", '<a href="&#x6A;avascript:alert(1)">x</a>\n', "<p><a>x</a></p>"],
      ["formaction", '<form><button formaction="javascript:alert(1)">x</button></form>\n', "x"],
      ["input formaction", '<input type="submit" formaction="https://evil.example">\n', ""],
      ["SVG script", "<svg><script>alert(1)</script></svg>\n", "<p></p>"],
      ["SVG onload", '<svg onload="alert(1)"><circle r="1"/></svg>\n', "<p></p>"],
      [
        "MathML xlink",
        '<math><a xlink:href="javascript:alert(1)">x</a></math>\n',
        "<p><a>x</a></p>",
      ],
      ["HTML comment", "<!-- comment --> after\n", "after"],
      ["meta refresh", '<meta http-equiv="refresh" content="0;url=https://evil.example">\n', ""],
      ["base", '<base href="https://evil.example/">\n', ""],
      ["stylesheet link", '<link rel="stylesheet" href="https://evil.example/x.css">\n', ""],
      [
        "authored heading id and handler",
        '<h2 id="spoof" onclick="alert(1)">Spoof</h2>\n',
        '<h2 id="spoof">Spoof</h2>',
      ],
      [
        "code class outside the allowlist",
        '<code class="evil hljs">x</code>\n',
        '<p><code class="hljs">x</code></p>',
      ],
    ])("should neutralise %s", (_name, markdown, expected) => {
      expect(html(markdown)).toBe(expected);
    });

    it.each([
      [
        "pre",
        '<pre tabindex="0" role="region" aria-label="x"><code>a</code></pre>\n',
        "<pre><code>a</code></pre>",
      ],
      [
        "pre with another value",
        '<pre tabindex="-1"><code>a</code></pre>\n',
        "<pre><code>a</code></pre>",
      ],
      ["div", '<div tabindex="0" role="region" aria-label="x">a</div>\n', "<div>a</div>"],
      [
        "table",
        '<table tabindex="0" role="presentation"><tr><td>a</td></tr></table>\n',
        "<table><tr><td>a</td></tr></table>",
      ],
      ["link", '<a href="/x" tabindex="5" aria-hidden="true">x</a>\n', '<p><a href="/x">x</a></p>'],
      ["code", '<code tabindex="0" class="hljs">x</code>\n', '<p><code class="hljs">x</code></p>'],
      ["span", '<span tabindex="0" role="button">x</span>\n', "<p><span>x</span></p>"],
    ])(
      "should drop authored tabindex, role and aria attributes on %s",
      (_name, markdown, expected) => {
        expect(html(markdown)).toBe(expected);
      }
    );

    it("should leave focus only on the scroll regions it adds itself, with tabindex 0", () => {
      const probe = [
        '<pre tabindex="1"><code>a</code></pre>',
        '<p tabindex="0">b</p>',
        '<div tabindex="0" role="region">c</div>',
        "```diagram\ntype: mcp-workflow\n```",
        "```ts\nconst a = 1;\n```",
        "| a |\n| - |\n| 1 |",
      ].join("\n\n");
      const render = (markdown: string) =>
        proseSegments(renderPostHtml(markdown).html, LABELS)
          .map((segment) => (segment.kind === "html" ? segment.html : ""))
          .join("");
      const probed = render(probe);
      expect(probed.match(/<pre role="region" tabindex="0" aria-label="Code">/g)).toHaveLength(2);
      expect(probed.match(/<div data-table="" role="region" tabindex="0"/g)).toHaveLength(1);
      for (const markdown of [probe, ...postBodies.map(([, body]) => body)]) {
        const out = render(markdown);
        const focusable = [...out.matchAll(/<([a-z0-9]+)([^>]*)\stabindex="([^"]*)"/g)];
        for (const [, tag, before, value] of focusable) {
          expect(value).toBe("0");
          expect(tag === "pre" || (tag === "div" && before.includes("data-table"))).toBe(true);
        }
        expect(out.match(/tabindex/g)?.length ?? 0).toBe(focusable.length);
        expect(out.match(/<pre[\s>]/g)?.length ?? 0).toBe(
          out.match(/<pre role="region" tabindex="0" aria-label="Code">/g)?.length ?? 0
        );
      }
    });

    it("should fail the build on a diagram slot written by hand", () => {
      expect(() => renderPostHtml('<div data-diagram-slot="99"></div>\n')).toThrow(
        "Diagram slots out of order: found [99], expected []"
      );
    });

    it("should drop a diagram slot attribute that is not a number", () => {
      expect(sanitizePostHtml('<div data-diagram-slot="x" id="y"></div>')).toBe("<div></div>");
    });
  });

  describe("isAllowedUrl", () => {
    const LINK = ["http", "https", "mailto"];

    it.each([
      "https://example.com",
      "HTTPS://example.com",
      "mailto:me@example.com",
      "/writing/x",
      "./x",
      "x/y",
      "#top",
      "?q=1&amp;r=2",
      "/a?b=c&amp;d=e",
    ])("should allow %s", (url) => {
      expect(isAllowedUrl(url, LINK)).toBe(true);
    });

    it.each([
      "javascript:alert(1)",
      " javascript:alert(1)",
      "java\nscript:alert(1)",
      "\u0001javascript:alert(1)",
      "javascript&colon;alert(1)",
      "&#106;avascript:alert(1)",
      "data:text/html,x",
      "vbscript:x",
      "ftp://example.com",
      "//evil.example",
      "\\\\evil.example",
      "1:x",
    ])("should reject %j", (url) => {
      expect(isAllowedUrl(url, LINK)).toBe(false);
    });

    it("should limit images to https", () => {
      expect(isAllowedUrl("mailto:me@example.com", IMAGE_SCHEMES)).toBe(false);
      expect(isAllowedUrl("http://example.com/a.png", IMAGE_SCHEMES)).toBe(false);
      expect(isAllowedUrl("https://example.com/a.png", IMAGE_SCHEMES)).toBe(true);
    });
  });
});
