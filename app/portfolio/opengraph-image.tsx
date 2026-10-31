import { PORTFOLIO_HERO_FOCUS, PORTFOLIO_HERO_STACK } from "data/portfolioIndex";
import { PORTFOLIO_PAGE_HEADING } from "data/projects";
import { PAGE_CARD_SIZE, renderPageCardImage } from "utils/pageCardImage";

export const size = PAGE_CARD_SIZE;

export const contentType = "image/png";

export const alt = PORTFOLIO_PAGE_HEADING;

export default function PortfolioOpenGraphImage() {
  return renderPageCardImage({
    eyebrow: "Engineering portfolio",
    title: PORTFOLIO_PAGE_HEADING,
    subtitle: PORTFOLIO_HERO_FOCUS,
    tags: PORTFOLIO_HERO_STACK.split(" · "),
  });
}
