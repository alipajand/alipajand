import { render } from "@testing-library/react";

import { ProjectCaseStudyJsonLd } from "components/ProjectCaseStudyJsonLd/ProjectCaseStudyJsonLd";
import { getProjectBySlug } from "utils/projects";

describe("ProjectCaseStudyJsonLd", () => {
  it("should render article schema for a case study", () => {
    const project = getProjectBySlug("ledgerguard")!;
    const { container } = render(<ProjectCaseStudyJsonLd project={project} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const schema = JSON.parse(script!.textContent!);
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe(project.caseStudyTitle);
    expect(schema.description).toBe(project.caseStudyMetaDescription);
    expect(schema.url).toContain("/portfolio/ledgerguard");
  });
});
