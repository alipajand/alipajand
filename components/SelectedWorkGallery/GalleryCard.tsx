"use client";

import Image from "next/image";

import type { SelectedWorkItem } from "data/selectedWork";

export function GalleryCard({ item }: { item: SelectedWorkItem }) {
  const hasImage = Boolean(item.imageSrc && item.imageSrc.trim() !== "");
  const showBlur = item.blurData && hasImage;

  return (
    <article
      data-selected-work-card
      className="group rounded-xl border border-border bg-card/50 overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:bg-card hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] h-full"
    >
      <figure className="space-y-0">
        <div className="relative w-full aspect-400/260 bg-background border-b border-border overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={item.imageSrc!}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {showBlur && (
                <div
                  className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center"
                  aria-hidden
                >
                  <span className="text-muted text-sm font-medium">Data blurred</span>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <span className="text-muted text-sm font-medium">No image available</span>
            </div>
          )}
        </div>
        <figcaption className="p-5 sm:p-6">
          <h3 className="font-display font-semibold text-lg text-foreground">{item.title}</h3>
          <p className="mt-2 text-muted text-sm leading-relaxed">{item.caption}</p>
        </figcaption>
      </figure>
    </article>
  );
}
