import {
  extractDiagramBlocks,
  parseDiagramSpec,
  splitContentAtDiagramSlots,
} from "utils/diagramBlocks";

describe("parseDiagramSpec", () => {
  it("should parse a flow diagram with an optional loop and caption", () => {
    const spec = parseDiagramSpec(
      [
        "type: flow",
        "title: Request path",
        "caption: Why it matters",
        "loop: Retries feed back in",
        "steps:",
        "  - label: Edit",
        "    detail: Change a file",
        "  - label: Check",
      ].join("\n")
    );
    expect(spec).toEqual({
      type: "flow",
      title: "Request path",
      caption: "Why it matters",
      loop: "Retries feed back in",
      steps: [{ label: "Edit", detail: "Change a file" }, { label: "Check" }],
    });
  });

  it("should parse layers and compare diagrams", () => {
    expect(
      parseDiagramSpec("type: layers\ntitle: Stack\nlayers:\n  - label: UI\n  - label: API")
    ).toEqual({ type: "layers", title: "Stack", layers: [{ label: "UI" }, { label: "API" }] });

    expect(
      parseDiagramSpec(
        "type: compare\ntitle: Before and after\ncolumns:\n  - label: Before\n    items: [a]\n  - label: After\n    items: [b]"
      )
    ).toEqual({
      type: "compare",
      title: "Before and after",
      columns: [
        { label: "Before", items: ["a"] },
        { label: "After", items: ["b"] },
      ],
    });
  });

  it("should parse the built-in MCP workflow diagram without a title", () => {
    expect(parseDiagramSpec("type: mcp-workflow")).toEqual({ type: "mcp-workflow" });
  });

  it.each([
    ["not an object", "just text"],
    ["missing title", "type: flow\nsteps:\n  - label: a\n  - label: b"],
    ["too few steps", "type: flow\ntitle: T\nsteps:\n  - label: a"],
    ["step without label", "type: flow\ntitle: T\nsteps:\n  - detail: a\n  - label: b"],
    ["non-object step", "type: flow\ntitle: T\nsteps:\n  - a\n  - b"],
    ["too few layers", "type: layers\ntitle: T\nlayers: []"],
    ["one column", "type: compare\ntitle: T\ncolumns:\n  - label: A\n    items: [a]"],
    [
      "empty items",
      "type: compare\ntitle: T\ncolumns:\n  - label: A\n    items: []\n  - label: B\n    items: [b]",
    ],
    [
      "non-string item",
      "type: compare\ntitle: T\ncolumns:\n  - label: A\n    items: [1]\n  - label: B\n    items: [b]",
    ],
    ["non-object column", "type: compare\ntitle: T\ncolumns: [a, b]"],
    ["unknown type", "type: pie\ntitle: T"],
  ])("should reject %s", (_, source) => {
    expect(() => parseDiagramSpec(source)).toThrow();
  });
});

describe("extractDiagramBlocks", () => {
  it("should replace diagram fences with numbered slots and leave other fences alone", () => {
    const markdown = [
      "Intro",
      "",
      "```diagram",
      "type: mcp-workflow",
      "```",
      "",
      "```ts",
      "const a = 1;",
      "```",
    ].join("\n");

    const { markdown: output, diagrams } = extractDiagramBlocks(markdown);

    expect(diagrams).toEqual([{ type: "mcp-workflow" }]);
    expect(output).toContain('<div data-diagram-slot="0"></div>');
    expect(output).toContain("```ts");
  });
});

describe("splitContentAtDiagramSlots", () => {
  it("should interleave html and diagram segments and drop empty html", () => {
    expect(
      splitContentAtDiagramSlots(
        '<p>a</p>\n<div data-diagram-slot="0"></div>\n<div data-diagram-slot="1"></div><p>b</p>'
      )
    ).toEqual([
      { kind: "html", html: "<p>a</p>\n" },
      { kind: "diagram", index: 0 },
      { kind: "diagram", index: 1 },
      { kind: "html", html: "<p>b</p>" },
    ]);
  });
});
