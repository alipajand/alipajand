import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { ProjectIndex } from "components/Projects/ProjectIndex";
import { PortfolioIntroParagraph } from "features/portfolio/PortfolioIntroParagraph";
import { PortfolioProfileLinks } from "features/portfolio/PortfolioProfileLinks";
import { PortfolioRoleFitStrip } from "features/portfolio/PortfolioRoleFitStrip";
import { PortfolioWhatToLookFor } from "features/portfolio/PortfolioWhatToLookFor";
import { portfolioIndexBreadcrumbs } from "data/breadcrumbs";
import {
  PORTFOLIO_PAGE_HEADER_TITLE,
  PORTFOLIO_PAGE_INTRO,
  PORTFOLIO_PAGE_INTRO_LINKS,
  PORTFOLIO_PROFILE_DETAILS,
} from "data/projects";

export const PortfolioPageContent = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <header>
        <div>
          <Breadcrumbs items={portfolioIndexBreadcrumbs()} />
          <h1>{PORTFOLIO_PAGE_HEADER_TITLE}</h1>
          <div>
            {PORTFOLIO_PAGE_INTRO.map((paragraph) => (
              <PortfolioIntroParagraph
                key={paragraph}
                text={paragraph}
                links={PORTFOLIO_PAGE_INTRO_LINKS}
              />
            ))}
            <p>{PORTFOLIO_PROFILE_DETAILS}</p>
          </div>
          <PortfolioProfileLinks />
          <PortfolioRoleFitStrip />
        </div>
      </header>
      <PortfolioWhatToLookFor />
      <ProjectIndex />
    </main>
  );
};
