import { render } from "@testing-library/react";

import { SkillIcon } from "components/Skills/SkillIcon";

jest.mock("data/skillIcons", () => ({
  SKILL_TO_ICON: {
    React: "code",
    PostgreSQL: "database",
    UnknownSkillXYZ: undefined,
    WeirdSkill: "nonexistent-icon",
  },
}));

describe("SkillIcon", () => {
  it("renders an icon for a known skill", () => {
    const { container } = render(<SkillIcon skill="React" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders CodeIcon for unknown skill (fallback mapping)", () => {
    const { container } = render(<SkillIcon skill="UnknownSkillXYZ" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders different icon for skill that maps to non-code", () => {
    const { container } = render(<SkillIcon skill="PostgreSQL" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("falls back to CodeIcon when mapping exists but icon is not in ICON_MAP", () => {
    const { container } = render(<SkillIcon skill="WeirdSkill" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
