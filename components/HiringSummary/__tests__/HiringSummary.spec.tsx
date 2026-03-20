import { render, screen } from "@testing-library/react";
import { HiringSummary } from "components/HiringSummary/HiringSummary";
import {
  HIRING_SUMMARY_HEADING,
  HIRING_SUMMARY_LEDE,
  HIRING_SUMMARY_ROWS,
} from "data/hiringSummary";
import { LOCATION } from "data/site";
import { LINKS } from "data/links";

jest.mock("utils/analytics", () => ({
  trackGtagEvent: jest.fn(),
}));

jest.mock("utils/hooks/useScrollReveal", () => ({
  useScrollReveal: () => ({
    selectors: { sectionRef: { current: null } },
  }),
}));

describe("HiringSummary", () => {
  it("renders heading, lede, and fact rows", () => {
    render(<HiringSummary />);
    expect(screen.getByRole("heading", { level: 2, name: HIRING_SUMMARY_HEADING })).toBeInTheDocument();
    expect(screen.getByText(HIRING_SUMMARY_LEDE)).toBeInTheDocument();
    HIRING_SUMMARY_ROWS.forEach((row) => {
      expect(screen.getByText(row.label)).toBeInTheDocument();
    });
    expect(screen.getByText(LOCATION)).toBeInTheDocument();
  });

  it("links Contact, email, LinkedIn, and GitHub", () => {
    render(<HiringSummary />);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
    LINKS.forEach((l) => {
      expect(screen.getByRole("link", { name: l.label })).toHaveAttribute("href", l.href);
    });
  });
});
