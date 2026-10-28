import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { WritingPostFilters } from "features/writing/WritingPostFilters";
import { tocNumbers, WritingPostToc } from "features/writing/WritingPostToc";
import type { WritingListPost } from "features/writing/writingModel";
import { resetMotionPreferenceForTests } from "utils/motion/motionPreference";
import {
  installManualFrames,
  installMatchMedia,
  installObservers,
} from "utils/motion/testEnvironment";
import type { PostHeading } from "utils/headings";

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const HEADINGS: PostHeading[] = [
  { id: "one", text: "One", level: 2 },
  { id: "one-detail", text: "Detail", level: 3 },
  { id: "two", text: "Two", level: 2 },
];

let frames: ReturnType<typeof installManualFrames>;

const Article = ({ tops }: { tops: number[] }) => (
  <div data-prose="">
    {HEADINGS.map((heading, index) => {
      const Tag = heading.level === 2 ? "h2" : "h3";
      return (
        <Tag
          key={heading.id}
          id={heading.id}
          ref={(node: HTMLHeadingElement | null) => {
            if (node)
              node.getBoundingClientRect = () =>
                ({ top: tops[index], bottom: tops[index] + 40 }) as DOMRect;
          }}
        >
          {heading.text}
        </Tag>
      );
    })}
  </div>
);

const renderToc = (tops: number[], variant: "reader" | "launch" = "reader") =>
  render(
    <>
      <Article tops={tops} />
      <WritingPostToc
        headings={HEADINGS}
        label="Table of contents"
        eyebrow="On this page"
        variant={variant}
      />
    </>
  );

beforeEach(() => {
  window.localStorage.clear();
  resetMotionPreferenceForTests();
  installObservers();
  frames = installManualFrames();
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
});

describe("WritingPostToc", () => {
  it("should number sections and leave subsections unnumbered", () => {
    expect(tocNumbers(HEADINGS)).toEqual(["01", "", "02"]);
  });

  it("should link every heading in order and move focus to the chosen heading", () => {
    installMatchMedia(false);
    renderToc([2000, 2400, 3000]);
    const toc = screen.getByRole("complementary", { name: "Table of contents" });
    const links = within(toc).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["#one", "#one-detail", "#two"]);

    links[2].focus();
    expect(links[2]).toHaveFocus();
    fireEvent.click(links[2]);
    act(() => {
      frames.flush();
    });
    const heading = screen.getByRole("heading", { name: "Two" });
    expect(heading).toHaveFocus();
    expect(heading).toHaveAttribute("tabindex", "-1");
  });

  it("should mark the section under the reading line and fill its progress", () => {
    installMatchMedia(false);
    renderToc([-400, 100, 900]);
    act(() => {
      frames.flush();
    });
    const links = within(screen.getByRole("complementary")).getAllByRole("link");
    expect(links[1]).toHaveAttribute("aria-current", "location");
    expect(links[0]).not.toHaveAttribute("aria-current");
    expect(links[0].style.getPropertyValue("--p")).toBe("1.000");
    expect(Number(links[1].style.getPropertyValue("--p"))).toBeGreaterThan(0);
  });

  it("should still mark the section but keep progress empty under reduced motion", () => {
    installMatchMedia(true);
    renderToc([-400, 100, 900]);
    act(() => {
      frames.flush();
    });
    const links = within(screen.getByRole("complementary")).getAllByRole("link");
    expect(links[1]).toHaveAttribute("aria-current", "location");
    links.forEach((link) => expect(link.style.getPropertyValue("--p")).toBe(""));
  });

  it("should fold into a disclosure in the launch layout and mark nothing before the first section", () => {
    installMatchMedia(true);
    renderToc([2000, 2400, 3000], "launch");
    const toc = screen.getByRole("complementary");
    expect(within(toc).getByText("On this page", { selector: "summary" })).toBeInTheDocument();
    act(() => {
      frames.flush();
    });
    expect(within(toc).queryAllByRole("link", { current: "location" })).toHaveLength(0);
  });
});

const POSTS: WritingListPost[] = [
  {
    slug: "soon",
    title: "Soon",
    date: "2026-10-28",
    excerpt: "Next",
    tags: ["AI"],
    featured: false,
  },
  {
    slug: "systems",
    title: "Systems",
    date: "2026-03-01",
    excerpt: "Tokens",
    tags: ["Design systems"],
    featured: true,
  },
  {
    slug: "agents",
    title: "Agents",
    date: "2026-02-01",
    excerpt: "Checks",
    tags: ["ai", "DX"],
    featured: false,
  },
];

const LANES = [
  { key: "ai", label: "AI", count: 2 },
  { key: "design systems", label: "Design systems", count: 1 },
];

describe("WritingPostFilters", () => {
  it("should list every post with the right call to action", () => {
    render(<WritingPostFilters posts={POSTS} lanes={LANES} />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Soon",
      "Systems",
      "Agents",
    ]);
    expect(screen.getByRole("link", { name: /Soon/ })).toHaveTextContent("Read article");
    expect(screen.getByRole("link", { name: /Systems/ })).toHaveTextContent("Featured");
    expect(screen.getByRole("link", { name: /Agents/ })).toHaveTextContent("Read article");
    expect(screen.getByRole("status")).toHaveTextContent("3 of 3 posts");
  });

  it("should filter with native toggle buttons and announce the count", () => {
    render(<WritingPostFilters posts={POSTS} lanes={LANES} />);
    const group = screen.getByRole("group", { name: "Filter by topic" });
    const all = within(group).getByRole("button", { name: /All/ });
    const ai = within(group).getByRole("button", { name: /AI/ });
    expect(all).toHaveAttribute("aria-pressed", "true");

    expect(ai.tagName).toBe("BUTTON");
    expect(ai).toHaveAttribute("type", "button");
    fireEvent.click(ai);
    expect(ai).toHaveAttribute("aria-pressed", "true");
    expect(all).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Soon",
      "Agents",
    ]);
    expect(screen.getByRole("status")).toHaveTextContent("2 of 3 posts");

    fireEvent.click(all);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });

  it("should say so when there is nothing to list", () => {
    render(<WritingPostFilters posts={[]} lanes={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("0 of 0 posts");
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  });
});
