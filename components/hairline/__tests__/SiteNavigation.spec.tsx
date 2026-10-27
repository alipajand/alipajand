import { fireEvent, render, screen, within } from "@testing-library/react";

import { SiteNavigation } from "components/hairline/SiteNavigation/SiteNavigation";
import {
  NAV_BOOK_CALL_LABEL,
  NAV_MENU_CLOSE_LABEL,
  NAV_MENU_OPEN_LABEL,
  NAV_PRIMARY_LINKS,
} from "data/nav";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

let mockPathname = "/portfolio";
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));

beforeEach(() => {
  mockPathname = "/portfolio";
  installMatchMedia(false);
  installObservers();
});

const menuButton = () => screen.getByRole("button", { name: /menu/i });
const menuPanel = () => document.getElementById("site-menu") as HTMLElement;

describe("SiteNavigation", () => {
  it("should render every primary link and mark the current page", () => {
    render(<SiteNavigation />);

    const primary = screen.getByRole("navigation", { name: "Primary" });
    const links = within(primary).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      NAV_PRIMARY_LINKS.map((link) => link.href)
    );
    expect(within(primary).getByRole("link", { name: "Portfolio" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("should open the booking link in a new tab with an announced hint", () => {
    render(<SiteNavigation />);
    const book = screen.getByRole("link", { name: new RegExp(NAV_BOOK_CALL_LABEL) });
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should toggle the menu disclosure and keep it closed by default", () => {
    render(<SiteNavigation />);

    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(menuButton()).toHaveAccessibleName(NAV_MENU_OPEN_LABEL);
    expect(menuPanel()).not.toBeVisible();

    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    expect(menuButton()).toHaveAccessibleName(NAV_MENU_CLOSE_LABEL);
    expect(menuPanel()).toBeVisible();

    fireEvent.click(menuButton());
    expect(menuPanel()).not.toBeVisible();
  });

  it("should close on Escape and return focus to the menu button", () => {
    render(<SiteNavigation />);
    fireEvent.click(menuButton());
    within(menuPanel()).getAllByRole("link")[0].focus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuPanel()).not.toBeVisible();
    expect(document.activeElement).toBe(menuButton());
  });

  it("should close when a menu link is chosen", () => {
    render(<SiteNavigation />);
    fireEvent.click(menuButton());
    fireEvent.click(within(menuPanel()).getAllByRole("link")[0]);
    expect(menuPanel()).not.toBeVisible();
  });

  it("should close when the route changes", () => {
    const { rerender } = render(<SiteNavigation />);
    fireEvent.click(menuButton());
    expect(menuPanel()).toBeVisible();

    mockPathname = "/writing";
    rerender(<SiteNavigation />);
    expect(menuPanel()).not.toBeVisible();
  });
});
