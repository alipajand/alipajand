import { serializeJsonLd } from "utils/jsonLd";

describe("serializeJsonLd", () => {
  it("should round-trip to an identical value", () => {
    const value = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Tips & tricks: <b>bold</b> -> done",
      keywords: ["a", "b"],
      nested: { count: 3, flag: true, empty: null, line: "x\u2028y\u2029z" },
    };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });

  it("should not emit a literal < for a script-breaking string", () => {
    const value = { headline: "</script><script>alert(1)</script>" };
    const output = serializeJsonLd(value);
    expect(output).not.toContain("<");
    expect(output).not.toContain(">");
    expect(output).toContain("\\u003c/script\\u003e");
    expect(JSON.parse(output)).toEqual(value);
  });

  it("should escape HTML comment openers and ampersands", () => {
    const output = serializeJsonLd({ text: "<!-- a & b -->" });
    expect(output).not.toContain("<!--");
    expect(output).not.toContain("&");
    expect(output).toContain("\\u0026");
  });

  it("should escape U+2028 and U+2029", () => {
    const output = serializeJsonLd({ text: "a\u2028b\u2029c" });
    expect(output).not.toContain("\u2028");
    expect(output).not.toContain("\u2029");
    expect(output).toContain("\\u2028");
    expect(output).toContain("\\u2029");
  });
});
