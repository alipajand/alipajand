import Link from "next/link";

import { OpenSourceToolGridItem } from "components/OpenSourceTools/OpenSourceToolGridItem";
import {
  HOME_OPEN_SOURCE_TOOLS,
  OPEN_SOURCE_TOOLS_CTA_HREF,
  OPEN_SOURCE_TOOLS_CTA_LABEL,
  OPEN_SOURCE_TOOLS_HEADING,
  OPEN_SOURCE_TOOLS_LEDE,
} from "data/openSourceTools";

export const OpenSourceTools = () => {
  return (
    <section id="open-source-tools" aria-labelledby="open-source-tools-heading">
      <div>
        <header>
          <h2 id="open-source-tools-heading">{OPEN_SOURCE_TOOLS_HEADING}</h2>
          <p>{OPEN_SOURCE_TOOLS_LEDE}</p>
        </header>

        <ul>
          {HOME_OPEN_SOURCE_TOOLS.map((tool) => (
            <OpenSourceToolGridItem key={tool.name} tool={tool} />
          ))}
        </ul>

        <div>
          <Link href={OPEN_SOURCE_TOOLS_CTA_HREF}>{OPEN_SOURCE_TOOLS_CTA_LABEL}</Link>
        </div>
      </div>
    </section>
  );
};
