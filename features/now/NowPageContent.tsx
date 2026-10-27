import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { NowSectionBlock } from "features/now/NowSectionBlock";
import { nowBreadcrumbs } from "data/breadcrumbs";
import { NOW_LEDE, NOW_PAGE_TITLE, NOW_SECTIONS } from "data/now";
import { NOW_PAGE_HEADER_OVERLINE } from "data/pageChrome";

export const NowPageContent = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <header>
        <div>
          <Breadcrumbs items={nowBreadcrumbs()} />
          <p>{NOW_PAGE_HEADER_OVERLINE}</p>
          <h1>{NOW_PAGE_TITLE}</h1>
          <p>{NOW_LEDE}</p>
        </div>
      </header>

      <div>
        <div>
          <div>
            {NOW_SECTIONS.map((section) => (
              <NowSectionBlock key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
