"use client";

import Image from "next/image";
import { useRef } from "react";

import styles from "components/hairline/ScreenshotFrame/ScreenshotFrame.module.css";
import { clamp } from "utils/motion/canvas";
import { createEasedPointer } from "utils/motion/easedPointer";
import { useMotion } from "utils/motion/useMotion";

export interface ScreenshotFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Bold lead of the caption; also the window title and the dialog title. */
  captionLead: string;
  captionBody?: string;
  /** Host shown in the window bar, such as "ledgerguard.app". */
  host: string;
  /** `side` puts the caption in a column beside the image on wide screens. */
  layout?: "stacked" | "side";
  /** The hero shot starts tipped back and flattens as the page scrolls. */
  tilt?: boolean;
  priority?: boolean;
  sizes?: string;
  enlargeLabel?: string;
  closeLabel?: string;
}

const trimStop = (text: string) => text.replace(/\.$/, "");

/**
 * A product screenshot in a hairline browser window. Clicking it opens the full-size image in a
 * native modal `<dialog>`, which handles focus, Escape and the backdrop.
 */
export const ScreenshotFrame = ({
  src,
  alt,
  width,
  height,
  captionLead,
  captionBody,
  host,
  layout = "stacked",
  tilt = false,
  priority = false,
  sizes = "(max-width: 760px) 100vw, 60vw",
  enlargeLabel = "Enlarge",
  closeLabel = "Close",
}: ScreenshotFrameProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const title = trimStop(captionLead);

  useMotion(
    windowRef,
    ({ element, reducedMotion }) => {
      if (reducedMotion) return;
      let flatness = 0;
      const apply = () => {
        element.style.transform = `rotateX(${((1 - flatness) * 14 - pointer.y * 4).toFixed(2)}deg) rotateY(${(pointer.x * 5).toFixed(2)}deg) scale(${(0.94 + flatness * 0.06).toFixed(3)})`;
      };
      const pointer = createEasedPointer(apply, { smoothing: 0.08 });
      const onMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        pointer.follow(
          (event.clientX - box.left) / box.width - 0.5,
          (event.clientY - box.top) / box.height - 0.5
        );
      };
      const onLeave = () => pointer.follow(0, 0);
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      return {
        onScroll: ({ y, vh }) => {
          flatness = clamp(y / (vh * 0.55), 0, 1);
          apply();
        },
        destroy: () => {
          pointer.stop();
          element.removeEventListener("pointermove", onMove);
          element.removeEventListener("pointerleave", onLeave);
          element.style.transform = "";
        },
      };
    },
    { enabled: tilt }
  );

  const close = () => dialogRef.current?.close();

  return (
    <figure className={layout === "side" ? `${styles.shot} ${styles.side}` : styles.shot}>
      <div ref={windowRef} className={tilt ? `${styles.window} ${styles.tilted}` : styles.window}>
        <div className={styles.bar} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{host}</span>
          <b>{title}</b>
        </div>
        <button
          type="button"
          className={styles.open}
          aria-label={`${enlargeLabel}: ${title}`}
          aria-haspopup="dialog"
          onClick={() => dialogRef.current?.showModal()}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
          />
        </button>
      </div>
      <figcaption>
        <b>{captionLead}</b>
        {captionBody ? ` ${captionBody}` : null}
      </figcaption>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={title}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={styles.dialogBar}>
          <span>{title}</span>
          <button type="button" onClick={close}>
            {closeLabel}
          </button>
        </div>
        <div className={styles.dialogImage}>
          <Image src={src} alt={alt} width={width} height={height} sizes="96vw" loading="lazy" />
        </div>
      </dialog>
    </figure>
  );
};
