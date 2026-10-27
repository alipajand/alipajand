import { render, screen, within } from "@testing-library/react";

import NowPage, { metadata } from "../../../app/now/page";
import { NowPageContent } from "features/now/NowPageContent";
import {
  NOW_LEDE,
  NOW_META_DESCRIPTION,
  NOW_PAGE_TITLE,
  NOW_SECTIONS,
  NOW_STACK_SECTION_ID,
  nowStackCountLabel,
  nowWeekLabel,
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
    render(<NowPageContent now={RENDERED_AT} />);

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
    render(<NowPageContent now={RENDERED_AT} />);

    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(crumbs).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(crumbs).getByText(NOW_PAGE_TITLE)).toHaveAttribute("aria-current", "page");
  });

  it("should render every section and item", () => {
    render(<NowPageContent now={RENDERED_AT} />);

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
    render(<NowPageContent now={RENDERED_AT} />);

    const stack = NOW_SECTIONS.find((section) => section.id === NOW_STACK_SECTION_ID);
    const tools = stack?.items.join(" · ").split(" · ") ?? [];
    const band = screen.getByRole("region", { name: stack?.title });
    expect(band).toHaveAttribute("id", NOW_STACK_SECTION_ID);
    expect(within(band).getByText(nowStackCountLabel(5, tools.length))).toBeInTheDocument();
    tools.forEach((tool) => {
      expect(within(band).getAllByText(tool).length).toBeGreaterThan(0);
    });
  });

  it("should label the week ruler with the visitor's current week", () => {
    jest.useFakeTimers({ now: RENDERED_AT });
    render(<NowPageContent now={new Date(2026, 0, 1)} />);

    expect(screen.getByText(nowWeekLabel(43))).toBeInTheDocument();
  });

  it("should close with the next links", () => {
    render(<NowPageContent now={RENDERED_AT} />);

    const next = screen.getByRole("navigation", { name: PAGE_NEXT_LINKS_ARIA_LABEL });
    expect(within(next).getAllByRole("link")).toHaveLength(PAGE_NEXT_LINKS.length);
  });

  it("should leave nothing lit with reduced motion", () => {
    installMatchMedia(true);
    const { container } = render(<NowPageContent now={RENDERED_AT} />);

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
