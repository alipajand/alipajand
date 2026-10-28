import type { ReactNode } from "react";

import { Frame } from "components/hairline/Frame/Frame";
import { SiteFooter } from "components/hairline/SiteFooter/SiteFooter";
import { SiteNavigation } from "components/hairline/SiteNavigation/SiteNavigation";
import styles from "components/hairline/SiteShell/SiteShell.module.css";
import { SkipLink } from "components/SkipLink/SkipLink";
import { SKIP_TO_CONTENT_LABEL } from "data/pageChrome";

interface SiteShellProps {
  children: ReactNode;
}

export const SiteShell = ({ children }: SiteShellProps) => (
  <>
    <SkipLink className={styles.skip} href="#main-content" label={SKIP_TO_CONTENT_LABEL} />
    <Frame>
      <SiteNavigation />
      {children}
      <SiteFooter />
    </Frame>
  </>
);
