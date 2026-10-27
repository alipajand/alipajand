import { focusableCode, proseSegments, wrapTables } from "features/writing/proseHtml";
import { longestWordEm, titleFitStyle } from "features/writing/titleFit";
import { renderHighlightedCode, resolveCodeLanguage } from "utils/highlightCode";

describe("proseHtml", () => {
  it("should wrap every table in a labelled, focusable scroll region", () => {
    const html = wrapTables(
      "<table><tr><td>1</td></tr></table><p>x</p><table></table>",
      'A "wide" table'
    );
    expect(html.match(/<div data-table="" role="region" tabindex="0"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="A &quot;wide&quot; table"');
    expect(html.match(/<\/table><\/div>/g)).toHaveLength(2);
  });

  it("should make every code block a labelled, focusable scroll region", () => {
    const html = focusableCode(
      renderHighlightedCode("a", "bash") + "<p>x</p>" + renderHighlightedCode("b", undefined),
      'Code "wide"'
    );
    expect(
      html.match(/<pre role="region" tabindex="0" aria-label="Code &quot;wide&quot;">/g)
    ).toHaveLength(2);
    expect(html).not.toContain("<pre>");
  });

  it("should give tables and code blocks their own labels in each segment", () => {
    const [segment] = proseSegments(renderHighlightedCode("a", "bash") + "<table></table>", {
      table: "Table",
      code: "Code",
    });
    expect(segment).toEqual({
      kind: "html",
      html: expect.stringContaining('<pre role="region" tabindex="0" aria-label="Code">'),
    });
    expect(segment).toEqual({
      kind: "html",
      html: expect.stringContaining(
        '<div data-table="" role="region" tabindex="0" aria-label="Table">'
      ),
    });
  });

  it("should split at diagram slots and tag each diagram with the section before it", () => {
    const segments = proseSegments(
      '<p>Intro</p><div data-diagram-slot="0"></div><h2 id="one">One</h2><p>a</p><div data-diagram-slot="1"></div><h2 id="two">Two</h2><table></table>',
      { table: "Table", code: "Code" }
    );
    expect(segments.map((segment) => segment.kind)).toEqual([
      "html",
      "diagram",
      "html",
      "diagram",
      "html",
    ]);
    expect(segments[1]).toEqual({ kind: "diagram", index: 0, sectionId: undefined });
    expect(segments[3]).toEqual({ kind: "diagram", index: 1, sectionId: "one" });
    expect(segments[4]).toEqual(
      expect.objectContaining({ html: expect.stringContaining("data-table") })
    );
  });
});

describe("highlightCode", () => {
  it("should highlight known languages and their aliases on the server", () => {
    const html = renderHighlightedCode("const a: number = 1;", "tsx");
    expect(html.startsWith('<pre><code class="hljs language-tsx">')).toBe(true);
    expect(html).toContain('<span class="hljs-keyword">const</span>');
  });

  it("should fall back to escaped plain text for unknown or missing languages", () => {
    expect(resolveCodeLanguage("cobol")).toBe("plaintext");
    expect(resolveCodeLanguage(undefined)).toBe("plaintext");
    const html = renderHighlightedCode("<script>alert(1)</script>", "cobol");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});

describe("titleFit", () => {
  it("should size a title by its widest unbreakable run", () => {
    const long = longestWordEm("Teaching MapBylaw to give honest AI recommendations", "reader");
    expect(long).toBeCloseTo(longestWordEm("RECOMMENDATIONS", "reader"), 5);
    expect(long).toBeGreaterThan(longestWordEm("Design systems that stick", "reader"));
  });

  it("should let lines break after dashes and widen for the launch face", () => {
    expect(longestWordEm("one-off", "reader")).toBeCloseTo(longestWordEm("one-", "reader"), 5);
    expect(longestWordEm("Readiness", "launch")).toBeGreaterThan(
      longestWordEm("Readiness", "reader")
    );
  });

  it("should expose the measure as a custom property", () => {
    expect(titleFitStyle("Agent", "reader")).toEqual({
      "--fit-em": longestWordEm("Agent", "reader").toFixed(3),
    });
  });
});
