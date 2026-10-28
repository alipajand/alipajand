import { render, screen, waitFor, within } from "@testing-library/react";

import NowPage, { metadata } from "../../../app/now/page";
import { NowPageContent } from "features/now/NowPageContent";
import {
  NOW_LEDE,
  NOW_META_DESCRIPTION,
  NOW_PAGE_TITLE,
  NOW_SECTIONS,
  NOW_STACK_SECTION_ID,
  nowStackCountLabel,
  NOW_RULER_LABEL,
  NOW_RULER_STEP,
} from "data/now";
import { PAGE_NEXT_LINKS, PAGE_NEXT_LINKS_ARIA_LABEL } from "data/pageChrome";
import { CANONICAL_URL } from "data/site";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

const RENDERED_AT = new Date(2026, 9, 27, 12);

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("NowPageContent", () => {
  it("should own the main landmark with the dated title as its only h1", () => {
    render(<NowPageContent />);

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      `${NOW_PAGE_TITLE} 2026`
    );
    expect(screen.getByText(NOW_LEDE)).toBeInTheDocument();
  });

  it("should keep the breadcrumb trail with the current page marked", () => {
    render(<NowPageContent />);

    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(crumbs).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(crumbs).getByText(NOW_PAGE_TITLE)).toHaveAttribute("aria-current", "page");
  });

  it("should render every section and item", () => {
    render(<NowPageContent />);

    NOW_SECTIONS.filter((section) => section.id !== NOW_STACK_SECTION_ID).forEach((section) => {
      const block = screen.getByRole("region", { name: section.title });
      section.items.forEach((item) => {
        expect(within(block).getByText(item)).toBeInTheDocument();
      });
      if (section.footer) {
        expect(within(block).getByRole("link", { name: section.footer.label })).toHaveAttribute(
          "href",
          section.footer.href
        );
      }
    });
  });

  it("should list every tool in the current stack band", () => {
    render(<NowPageContent />);

    const stack = NOW_SECTIONS.find((section) => section.id === NOW_STACK_SECTION_ID);
    const tools = stack?.items.join(" · ").split(" · ") ?? [];
    const band = screen.getByRole("region", { name: stack?.title });
    expect(band).toHaveAttribute("id", NOW_STACK_SECTION_ID);
    expect(within(band).getByText(nowStackCountLabel(5, tools.length))).toBeInTheDocument();
    tools.forEach((tool) => {
      expect(within(band).getAllByText(tool).length).toBeGreaterThan(0);
    });
  });

  it.each([new Date(2026, 0, 1), RENDERED_AT, new Date(2031, 6, 1)])(
    "should mark the as-of date on the ruler whatever the clock (%s)",
    (now) => {
      jest.useFakeTimers({ now });
      const { container } = render(<NowPageContent />);

      expect(screen.getByText(NOW_RULER_LABEL)).toBeInTheDocument();
      expect(screen.queryByText(/today/i)).toBeNull();
      const ruler = container.querySelector("[data-static-ruler]")?.parentElement;
      expect(ruler?.getAttribute("style")).toContain(`--week: ${NOW_RULER_STEP}`);
    }
  );

  it("should draw the week ruler on the server so it shows without the canvas", () => {
    const { container } = render(<NowPageContent />);

    const ruler = container.querySelector("[data-static-ruler]");
    expect(ruler?.closest("[aria-hidden='true']")).not.toBeNull();
    // 53 tick lines bound the 52 steps, plus the baseline.
    const lines = Array.from(ruler?.querySelectorAll("line") ?? []);
    expect(lines).toHaveLength(54);
    const ticks = lines.slice(0, 53);
    expect(ticks.filter((line) => line.getAttribute("stroke-opacity") === "0.9")).toHaveLength(
      NOW_RULER_STEP
    );
    expect(ticks.map((line) => Number(line.getAttribute("x1")))).toEqual(
      Array.from({ length: 53 }, (_, i) => i)
    );
    expect(ruler?.textContent).toBe("Q1Q2Q3Q4");
    // No 2D context in jsdom, so the canvas never draws and the server ruler stays in view.
    expect(ruler?.parentElement).not.toHaveAttribute("data-drawn");
  });

  it("should hand the ruler to the canvas once it draws", async () => {
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      setTransform: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      fillText: jest.fn(),
    } as unknown as CanvasRenderingContext2D);
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
    const { container } = render(<NowPageContent />);

    const ruler = container.querySelector("[data-static-ruler]")?.parentElement;
    await waitFor(() => expect(ruler).toHaveAttribute("data-drawn"));
    // The server copy is hidden in CSS, not removed, so the swap cannot move anything.
    expect(container.querySelector("[data-static-ruler]")).toBeInTheDocument();
    delete (document as { fonts?: unknown }).fonts;
  });

  it("should close with the next links", () => {
    render(<NowPageContent />);

    const next = screen.getByRole("navigation", { name: PAGE_NEXT_LINKS_ARIA_LABEL });
    expect(within(next).getAllByRole("link")).toHaveLength(PAGE_NEXT_LINKS.length);
  });

  it("should leave nothing lit with reduced motion", () => {
    installMatchMedia(true);
    const { container } = render(<NowPageContent />);

    expect(container.querySelectorAll("[data-lit]")).toHaveLength(0);
  });
});

describe("app/now/page", () => {
  it("should keep the canonical metadata", () => {
    expect(metadata.alternates?.canonical).toBe(`${CANONICAL_URL}/now`);
    expect(metadata.description).toBe(NOW_META_DESCRIPTION);
    expect(metadata.openGraph).toEqual(expect.objectContaining({ url: `${CANONICAL_URL}/now` }));
  });

  it("should keep the breadcrumb structured data", () => {
    const { container } = render(<NowPage />);

    const block = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}"
    );
    expect(block["@type"]).toBe("BreadcrumbList");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
