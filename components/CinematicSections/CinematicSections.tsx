"use client";

import { Children, isValidElement } from "react";
import type { PropsWithChildren, ReactElement } from "react";

import { useCinematicSections } from "components/CinematicSections/hooks/useCinematicSections";

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
