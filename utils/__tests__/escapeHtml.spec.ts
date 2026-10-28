import { escapeHtml } from "utils/escapeHtml";

describe("escapeHtml", () => {
  it("should escape the five characters that can open markup or end an attribute", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#039;y&#039;&gt;&amp;&lt;/a&gt;"
    );
  });

  it("should escape an ampersand first so existing entities are not decoded", () => {
    expect(escapeHtml("&lt;script&gt;")).toBe("&amp;lt;script&amp;gt;");
  });

  it("should leave plain text unchanged", () => {
    expect(escapeHtml("Ada Lovelace, ada@example.com")).toBe("Ada Lovelace, ada@example.com");
  });
});
