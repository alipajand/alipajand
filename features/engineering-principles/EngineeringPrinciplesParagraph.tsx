import { SECTION_LEDE } from "utils/visual";

interface EngineeringPrinciplesParagraphProps {
  children: string;
}

export function EngineeringPrinciplesParagraph({ children }: EngineeringPrinciplesParagraphProps) {
  return <p className={`${SECTION_LEDE} max-w-2xl`}>{children}</p>;
}
