import { fireEvent, render, screen, within } from "@testing-library/react";

import { CaseItems, CaseSection } from "components/hairline/CaseSection/CaseSection";
import { ChapterRail } from "components/hairline/ChapterRail/ChapterRail";
import { CompareDiagram } from "components/hairline/CompareDiagram/CompareDiagram";
import { DecisionCard } from "components/hairline/DecisionCard/DecisionCard";
import { FactsPanel } from "components/hairline/FactsPanel/FactsPanel";
import { FlowBand } from "components/hairline/FlowBand/FlowBand";
import { LayersDiagram } from "components/hairline/LayersDiagram/LayersDiagram";
import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import { ScreenshotFrame } from "components/hairline/ScreenshotFrame/ScreenshotFrame";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...props} />
  ),
}));

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
});

const STEPS = [
  { label: "Scan", detail: "Read the repository." },
  { label: "Score", detail: "Weigh the findings." },
  { label: "Report" },
];

describe("case-study parts", () => {
  it("should label each section by its heading and number its items", () => {
    render(
      <CaseSection id="approach" index={1} title="Approach">
        <CaseItems items={["First", "Second"]} />
      </CaseSection>
    );
    const section = screen.getByRole("region", { name: "Approach" });
    expect(section).toHaveAttribute("id", "approach");
    expect(within(section).getAllByRole("listitem")).toHaveLength(2);
  });

  it("should render facts as a description list", () => {
    render(<FactsPanel facts={[{ term: "Role", detail: "Lead engineer" }]} />);
    expect(screen.getByRole("term")).toHaveTextContent("Role");
    expect(screen.getByRole("definition")).toHaveTextContent("Lead engineer");
  });

  it("should lay out a decision with its reasoning, trade-off and result", () => {
    render(
      <DecisionCard
        index={0}
        decision="Use server components"
        why="Less client code"
        tradeOff="Fewer client hooks"
        result="Smaller bundles"
        labels={{ decision: "Decision", why: "Why", tradeOff: "Trade-off", result: "Result" }}
      />
    );
    expect(screen.getByText("Use server components")).toBeInTheDocument();
    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual([
      "Why",
      "Trade-off",
      "Result",
    ]);
  });

  it("should link the next pages from a labelled navigation", () => {
    render(
      <NextLinks
        label="Keep reading"
        links={[{ href: "/portfolio", eyebrow: "Index", title: "Portfolio" }]}
      />
    );
    expect(
      within(screen.getByRole("navigation", { name: "Keep reading" })).getByRole("link")
    ).toHaveAttribute("href", "/portfolio");
  });

  it("should render chapter links that work without JavaScript", () => {
    render(
      <ChapterRail
        label="Chapters"
        chapters={[
          { id: "context", label: "Context" },
          { id: "approach", label: "Approach" },
        ]}
      />
    );
    const links = within(screen.getByRole("navigation", { name: "Chapters" })).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["#context", "#approach"]);
  });

  it("should open the screenshot in a modal dialog and close it from the button or backdrop", () => {
    const showModal = jest.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    const close = jest.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
    Object.assign(HTMLDialogElement.prototype, { showModal, close });

    render(
      <ScreenshotFrame
        src="/shot.png"
        alt="Dashboard with alerts"
        width={1728}
        height={1084}
        host="example.app"
        captionLead="Alert review."
        captionBody="Each alert links to its source."
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Enlarge: Alert review" }));
    expect(showModal).toHaveBeenCalledTimes(1);
    const dialog = screen.getByRole("dialog", { name: "Alert review" });

    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledTimes(1);

    fireEvent.click(dialog);
    expect(close).toHaveBeenCalledTimes(2);
  });

  it("should list layers in order with their details", () => {
    render(<LayersDiagram title="Stack" layers={STEPS} caption="Outer to inner." />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Outer to inner.")).toBeInTheDocument();
  });

  it("should mark the chosen comparison column in text, not only with symbols", () => {
    render(
      <CompareDiagram
        title="Approach"
        columns={[
          { label: "Before", items: ["Manual review"] },
          { label: "After", items: ["Automated checks"] },
        ]}
      />
    );
    expect(screen.getByText("Automated checks").textContent).toContain("Chosen");
    expect(screen.getByText("Manual review").textContent).toContain("Not chosen");
  });

  it("should show every flow step as passed under reduced motion", () => {
    installMatchMedia(true);
    render(
      <FlowBand chapterId="approach" label="Approach diagram" title="Pipeline" steps={STEPS} />
    );
    const band = screen.getByRole("region", { name: "Approach diagram" });
    expect(band).toHaveAttribute("data-chapter-for", "approach");
    for (const step of within(band).getAllByRole("listitem")) {
      expect(step).toHaveAttribute("data-done");
    }
  });
});
