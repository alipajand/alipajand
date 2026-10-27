import Link from "next/link";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { NotFoundMainFocus } from "components/NotFoundMainFocus/NotFoundMainFocus";
import { notFoundBreadcrumbs } from "data/breadcrumbs";
import {
  NOT_FOUND_CODE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_KEYBOARD_TIP,
  NOT_FOUND_LINK_HOME,
  NOT_FOUND_LINK_PORTFOLIO,
  NOT_FOUND_TITLE,
} from "data/notFound";

export const NotFoundPageContent = () => {
  return (
    <>
      <NotFoundMainFocus />
      <Breadcrumbs items={notFoundBreadcrumbs()} />
      <main id="main-content" tabIndex={-1}>
        <p>{NOT_FOUND_CODE}</p>
        <h1>{NOT_FOUND_TITLE}</h1>
        <p>{NOT_FOUND_DESCRIPTION}</p>
        <p>{NOT_FOUND_KEYBOARD_TIP}</p>
        <div>
          <Link href="/">{NOT_FOUND_LINK_HOME}</Link>
          <Link href="/portfolio">{NOT_FOUND_LINK_PORTFOLIO}</Link>
        </div>
      </main>
    </>
  );
};
