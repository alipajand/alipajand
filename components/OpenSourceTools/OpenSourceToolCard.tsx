import Link from "next/link";

import type { OpenSourceTool } from "data/openSourceTools";
import {
  OPEN_SOURCE_TOOL_PAGE_LINK_LABEL,
  OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL,
  OPEN_SOURCE_TOOLS_CTA_HREF,
  openSourceToolRepositoryAriaLabel,
} from "data/openSourceTools";

interface OpenSourceToolCardProps {
  tool: OpenSourceTool;
}

export const OpenSourceToolCard = ({ tool }: OpenSourceToolCardProps) => {
  return (
    <article>
      <div>
        <h3>{tool.name}</h3>
        <p>{tool.problem}</p>
      </div>

      <ul aria-label={`${tool.name} capabilities`}>
        {tool.capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>

      <div>
        <Link href={tool.repositoryUrl} aria-label={openSourceToolRepositoryAriaLabel(tool.name)}>
          <span>{OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL}</span>
          <span aria-hidden>↗</span>
        </Link>
        <Link href={OPEN_SOURCE_TOOLS_CTA_HREF}>{OPEN_SOURCE_TOOL_PAGE_LINK_LABEL}</Link>
      </div>
    </article>
  );
};
