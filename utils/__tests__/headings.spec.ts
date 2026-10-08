import { addHeadingIds, headingText, slugifyHeading } from "utils/headings";

describe("headings", () => {
  it("should strip tags and decode entities in heading text", () => {
    expect(headingText("Why <code>AGENTS.md</code> &amp; CI&#39;s   role")).toBe(
      "Why AGENTS.md & CI's role"
    );
  });

  it("should slugify heading text and fall back for symbols-only titles", () => {
    expect(slugifyHeading("What’s next? Tests & CI")).toBe("whats-next-tests-ci");
    expect(slugifyHeading("!!!")).toBe("section");
  });

  it("should add ids to h2 and h3 and dedupe repeated titles", () => {
    const { html, headings } = addHeadingIds(
      "<h2>Setup</h2><p>x</p><h3>Notes</h3><h2>Setup</h2><h4>Skip</h4>"
    );
    expect(html).toBe(
      '<h2 id="setup">Setup</h2><p>x</p><h3 id="notes">Notes</h3><h2 id="setup-2">Setup</h2><h4>Skip</h4>'
    );
    expect(headings).toEqual([
      { id: "setup", text: "Setup", level: 2 },
      { id: "notes", text: "Notes", level: 3 },
      { id: "setup-2", text: "Setup", level: 2 },
    ]);
  });
});
