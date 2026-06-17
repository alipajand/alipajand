import { splitHtmlAtFirstH2 } from "utils/splitHtmlAtFirstH2";

describe("splitHtmlAtFirstH2", () => {
  it("should split the html at the first h2 tag", () => {
    const html = '<p>Intro</p><h2 id="a">Heading</h2><p>Body</p>';
    const { before, fromH2 } = splitHtmlAtFirstH2(html);
    expect(before).toBe("<p>Intro</p>");
    expect(fromH2).toBe('<h2 id="a">Heading</h2><p>Body</p>');
  });

  it("should return the whole html as before when there is no h2", () => {
    const html = "<p>Just a paragraph</p>";
    const { before, fromH2 } = splitHtmlAtFirstH2(html);
    expect(before).toBe(html);
    expect(fromH2).toBe("");
  });

  it("should split at the first h2 only when multiple are present", () => {
    const html = "<h1>Title</h1><h2>First</h2><h2>Second</h2>";
    const { before, fromH2 } = splitHtmlAtFirstH2(html);
    expect(before).toBe("<h1>Title</h1>");
    expect(fromH2).toBe("<h2>First</h2><h2>Second</h2>");
  });
});
