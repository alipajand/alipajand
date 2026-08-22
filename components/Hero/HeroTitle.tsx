"use client";

import { Fragment } from "react";
import type { RefObject } from "react";

interface HeroTitleProps {
  headingRef: RefObject<HTMLHeadingElement | null>;
  text: string;
  className?: string;
}

/**
 * Splits the headline into masked words so the intro can reveal them
 * from behind a clipped baseline, one beat after another.
 */
export const HeroTitle = ({ headingRef, text, className }: HeroTitleProps) => {
  const words = text.split(" ").filter(Boolean);

  return (
    <h1 ref={headingRef} data-hero-animate className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="cine-mask">
            <span className="cine-word" data-cine-word>
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
};
