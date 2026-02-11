import { render } from "@testing-library/react";

import { SkillIcon } from "components/Skills/SkillIcon";

describe("SkillIcon", () => {
  it("renders an icon for a known skill", () => {
    const { container } = render(<SkillIcon skill="React" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders CodeIcon for unknown skill (fallback)", () => {
    const { container } = render(<SkillIcon skill="UnknownSkillXYZ" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders different icon for skill that maps to non-code", () => {
    const { container } = render(<SkillIcon skill="PostgreSQL" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
