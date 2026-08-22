"use client";

import { Children, isValidElement } from "react";
import type { PropsWithChildren, ReactElement } from "react";

import { useCinematicSections } from "components/CinematicSections/hooks/useCinematicSections";

/**
 * Wraps the sections below the hero so each one is staged on scroll.
 * Children keep their own markup; only a motion wrapper is added.
 */
export const CinematicSections = ({ children }: PropsWithChildren) => {
  const {
    selectors: { containerRef },
  } = useCinematicSections();

  return (
    <div ref={containerRef}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return (
          <div data-cine-section key={(child as ReactElement).key ?? index}>
            {child}
          </div>
        );
      })}
    </div>
  );
};
