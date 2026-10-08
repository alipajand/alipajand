import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import { findActiveHeadingId } from "components/TableOfContents/hooks/useActiveHeading";
import { WRITING_TOC_HEADING } from "data/writing";
import type { PostHeading } from "utils/headings";
import { scrollToElement } from "utils/scrollToTop";

jest.mock("utils/scrollToTop", () => ({
  ...jest.requireActual("utils/scrollToTop"),
  scrollToElement: jest.fn(),
}));

const headings: PostHeading[] = [
  { id: "intro", text: "Intro", level: 2 },
  { id: "details", text: "Details", level: 3 },
  { id: "wrap-up", text: "Wrap up", level: 2 },
];

const mountHeadings = (tops: number[]) => {
  headings.forEach((heading, index) => {
    const el = document.createElement("h2");
    el.id = heading.id;
    el.getBoundingClientRect = () => ({ top: tops[index] }) as DOMRect;
    document.body.appendChild(el);
  });
};

describe("TableOfContents", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should render nothing for fewer than two headings", () => {
    const { container } = render(<TableOfContents headings={headings.slice(0, 1)} />);
    expect(container).toBeEmptyDOMElement();
    const { container: disclosure } = render(
      <TableOfContentsDisclosure headings={headings.slice(0, 1)} />
    );
    expect(disclosure).toBeEmptyDOMElement();
  });

  it("should list headings as in-page links and mark the scrolled-to heading", () => {
    mountHeadings([-400, 40, 900]);
    render(<TableOfContents headings={headings} />);

    expect(screen.getByText(WRITING_TOC_HEADING)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Intro" })).toHaveAttribute("href", "#intro");
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "aria-current",
      "location"
    );
  });

  it("should smooth-scroll to a heading, update the hash and focus it on click", () => {
    mountHeadings([500, 900, 1300]);
    const replaceState = jest.spyOn(window.history, "replaceState");
    render(<TableOfContents headings={headings} />);

    fireEvent.click(screen.getByRole("link", { name: "Wrap up" }));

    const target = document.getElementById("wrap-up") as HTMLElement;
    expect(scrollToElement).toHaveBeenCalledWith(target);
    expect(replaceState).toHaveBeenCalledWith(null, "", "#wrap-up");
    expect(target).toHaveFocus();
    expect(target).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("link", { name: "Wrap up" })).toHaveAttribute(
      "aria-current",
      "location"
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("link", { name: "Wrap up" })).toHaveAttribute(
      "aria-current",
      "location"
    );
    replaceState.mockRestore();
  });

  it("should ignore clicks for headings missing from the page", () => {
    render(<TableOfContents headings={headings} />);
    fireEvent.click(screen.getByRole("link", { name: "Intro" }));
    expect(scrollToElement).not.toHaveBeenCalled();
  });

  it("should close the mobile disclosure after navigating", () => {
    mountHeadings([500, 900, 1300]);
    const { container } = render(<TableOfContentsDisclosure headings={headings} />);
    const details = container.querySelector("details") as HTMLDetailsElement;
    details.open = true;

    fireEvent.click(screen.getByRole("link", { name: "Details" }));

    expect(details.open).toBe(false);
    expect(scrollToElement).toHaveBeenCalled();
  });
});

describe("findActiveHeadingId", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    window.scrollY = 0;
  });

  it("should return null before the first heading and skip missing ids", () => {
    mountHeadings([500, 900, 1300]);
    expect(findActiveHeadingId(["missing", "intro", "wrap-up"])).toBeNull();
  });

  it("should return the last heading when scrolled to the bottom", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    window.scrollY = 1000;
    expect(findActiveHeadingId(["intro", "wrap-up"])).toBe("wrap-up");
  });
});
