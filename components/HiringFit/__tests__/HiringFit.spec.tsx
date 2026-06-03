import { render, screen } from "@testing-library/react";

import { HiringFit } from "components/HiringFit/HiringFit";
import {
  HIRING_FIT_CARDS,
  HIRING_FIT_CTA_PRIMARY_HREF,
  HIRING_FIT_CTA_PRIMARY_LABEL,
  HIRING_FIT_CTA_SECONDARY_HREF,
  HIRING_FIT_CTA_SECONDARY_LABEL,
  HIRING_FIT_HEADING,
  HIRING_FIT_ROLE_STRIP,
} from "data/hiringFit";

describe("HiringFit", () => {
  it("renders section heading", () => {
    render(<HiringFit />);
    expect(screen.getByRole("heading", { name: HIRING_FIT_HEADING })).toBeInTheDocument();
  });

  it("renders all role strip items", () => {
    render(<HiringFit />);
    const roleList = screen.getByRole("list", { name: "Role fit" });
    for (const role of HIRING_FIT_ROLE_STRIP) {
      expect(roleList).toHaveTextContent(role);
    }
  });

  it("renders all four card titles", () => {
    render(<HiringFit />);
    for (const card of HIRING_FIT_CARDS) {
      expect(screen.getByRole("heading", { name: card.title, level: 3 })).toBeInTheDocument();
    }
  });

  it("links primary CTA to portfolio", () => {
    render(<HiringFit />);
    const link = screen.getByRole("link", { name: HIRING_FIT_CTA_PRIMARY_LABEL });
    expect(link).toHaveAttribute("href", HIRING_FIT_CTA_PRIMARY_HREF);
  });

  it("links secondary CTA to engineering principles", () => {
    render(<HiringFit />);
    const link = screen.getByRole("link", { name: HIRING_FIT_CTA_SECONDARY_LABEL });
    expect(link).toHaveAttribute("href", HIRING_FIT_CTA_SECONDARY_HREF);
  });
});
