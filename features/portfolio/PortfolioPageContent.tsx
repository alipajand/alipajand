import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import { Ticker } from "components/hairline/Ticker/Ticker";
import { OperatingModelScene } from "features/portfolio/OperatingModelScene";
import { PortfolioBand } from "features/portfolio/PortfolioBand";
import { PortfolioContact } from "features/portfolio/PortfolioContact";
import { PortfolioHero } from "features/portfolio/PortfolioHero";
import { PortfolioWorks } from "features/portfolio/PortfolioWorks";
import { PORTFOLIO_ROLE_FIT_ARIA_LABEL, PORTFOLIO_ROLE_FIT_LABELS } from "data/portfolioFit";
import { PORTFOLIO_DISPLAY_WORDS, PORTFOLIO_PRINCIPLE_TICKER } from "data/portfolioIndex";

export const PortfolioPageContent = () => (
  <main id="main-content" tabIndex={-1}>
    <PortfolioHero />
    <Ticker
      items={PORTFOLIO_ROLE_FIT_LABELS}
      icon="ring"
      direction={1}
      label={PORTFOLIO_ROLE_FIT_ARIA_LABEL}
    />
    <DisplayWord
      words={PORTFOLIO_DISPLAY_WORDS}
      variant="index"
      motion="center"
      reach={0.4}
      pulse
    />
    <Ticker items={PORTFOLIO_PRINCIPLE_TICKER} icon="spark" direction={-1} />
    <PortfolioBand />
    <PortfolioWorks />
    <OperatingModelScene />
    <PortfolioContact />
  </main>
);
