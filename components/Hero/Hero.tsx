import Link from "next/link";
import { FooterDirectChannel } from "components/Footer/FooterDirectChannel";
import { LINKS } from "data/links";
import { HERO_PROOF_ROW, HERO_SECTION_ARIA_LABEL, HERO_SOCIAL_LINKS_ARIA_LABEL } from "data/site";
import {
  HOMEPAGE_HERO_BODY,
  HOMEPAGE_HERO_EYEBROW,
  HOMEPAGE_HERO_LOCATION,
  HOMEPAGE_HERO_NAME,
  HOMEPAGE_HERO_PRIMARY_CTA_HREF,
  HOMEPAGE_HERO_PRIMARY_CTA_LABEL,
  HOMEPAGE_HERO_SECONDARY_CTA_HREF,
  HOMEPAGE_HERO_SECONDARY_CTA_LABEL,
  HOMEPAGE_HERO_TITLE,
} from "data/homepage";

export const Hero = () => {
  return (
    <section id="hero" aria-label={HERO_SECTION_ARIA_LABEL}>
      <p>{HOMEPAGE_HERO_EYEBROW}</p>
      <p>{HOMEPAGE_HERO_NAME}</p>
      <h1>{HOMEPAGE_HERO_TITLE}</h1>
      <p>{HOMEPAGE_HERO_BODY}</p>
      <p>{HOMEPAGE_HERO_LOCATION}</p>

      <div>
        <Link href={HOMEPAGE_HERO_PRIMARY_CTA_HREF}>{HOMEPAGE_HERO_PRIMARY_CTA_LABEL}</Link>
        <Link href={HOMEPAGE_HERO_SECONDARY_CTA_HREF}>{HOMEPAGE_HERO_SECONDARY_CTA_LABEL}</Link>
      </div>
      <nav aria-label={HERO_SOCIAL_LINKS_ARIA_LABEL}>
        <ul>
          {LINKS.map((channel) => (
            <li key={channel.label}>
              <FooterDirectChannel label={channel.label} href={channel.href} />
            </li>
          ))}
        </ul>
      </nav>
      <dl>
        {HERO_PROOF_ROW.map((proof) => (
          <div key={proof.value}>
            <dt>{proof.value}</dt>
            <dd>{proof.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
