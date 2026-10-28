"use client";

import Image from "next/image";
import { type CSSProperties, useRef } from "react";

import styles from "components/hairline/ScreenshotFrame/ScreenshotFrame.module.css";
import { clamp } from "utils/motion/canvas";
import { createEasedPointer, type EasedPointer } from "utils/motion/easedPointer";
import { useMotion } from "utils/motion/useMotion";

export interface ScreenshotFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Bold lead of the caption; also the window title and the dialog title. */
  captionLead: string;
  captionBody?: string;
  /** Host shown in the window bar: the host the captured page was served from. */
  host: string;
  /** Short provenance note shown after the caption, such as "Sample data". */
  provenance?: string;
  /** Rows of empty browser chrome at the top of the source image, hidden inside the window. */
  trimTop?: number;
  /** `side` puts the caption in a column beside the image on wide screens. */
  layout?: "stacked" | "side";
  /** The hero shot starts tipped back and flattens as the page scrolls. */
  tilt?: boolean;
  /** Load eagerly with high priority; only for the first screenshot on the page. */
  priority?: boolean;
  sizes?: string;
  enlargeLabel?: string;
  closeLabel?: string;
}

const trimStop = (text: string) => text.replace(/\.$/, "");

/**
 * The enlarged image's rendered width: the dialog is 96vw up to 1600px, and the image inside never
 * drops below 900px (narrower screens pan it). Below 937px that floor is wider than 96vw, so a plain
 * `96vw` asked for a candidate two to three times too small and the enlargement was blurrier than
 * the inline shot.
 */
const DIALOG_IMAGE_SIZES = "(max-width: 937px) 900px, (min-width: 1667px) 1600px, 96vw";

/** Pointer easing per 60 Hz frame and the tilt formula from the design kit's case-study script. */
const POINTER_EASE = 0.08;
const tiltTransform = (flatness: number, x: number, y: number) =>
  `rotateX(${((1 - flatness) * 14 - y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) scale(${(0.94 + flatness * 0.06).toFixed(3)})`;

/**
 * A product screenshot in a hairline browser window. Clicking it opens the full-size image in a
 * native modal `<dialog>`, which handles focus and Escape; closing returns focus to the opener.
 */
export const ScreenshotFrame = ({
  src,
  alt,
  width,
  height,
  captionLead,
  captionBody,
  host,
  provenance,
  trimTop = 0,
  layout = "stacked",
  tilt = false,
  priority = false,
  sizes = "(max-width: 760px) 100vw, 60vw",
  enlargeLabel = "Enlarge",
  closeLabel = "Close",
}: ScreenshotFrameProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const title = trimStop(captionLead);

  useMotion(
    windowRef,
    ({ element, reducedMotion, idleMotion }) => {
      if (reducedMotion) return;
      let flatness = 0;
      let pointer: EasedPointer | null = null;
      const target = { x: 0, y: 0 };
      const onMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        target.x = (event.clientX - box.left) / box.width - 0.5;
        target.y = (event.clientY - box.top) / box.height - 0.5;
        pointer?.follow(target.x, target.y);
      };
      const onLeave = () => {
        target.x = 0;
        target.y = 0;
        pointer?.follow(0, 0);
      };
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      const listeners = () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
        element.style.transform = "";
      };

      if (idleMotion) {
        // The kit eases the pointer on every display frame while the shot is on screen.
        const eased = { x: 0, y: 0 };
        return {
          onFrame: ({ y, vh, step }) => {
            flatness = clamp(y / (vh * 0.55), 0, 1);
            const ease = Math.min(1, POINTER_EASE * step);
            eased.x += (target.x - eased.x) * ease;
            eased.y += (target.y - eased.y) * ease;
            element.style.transform = tiltTransform(flatness, eased.x, eased.y);
          },
          destroy: listeners,
        };
      }

      // Motion paused: scroll still flattens the shot and the pointer eases, then everything rests.
      const apply = () => {
        element.style.transform = tiltTransform(flatness, eased.x, eased.y);
      };
      const eased = createEasedPointer(apply, { smoothing: POINTER_EASE });
      pointer = eased;
      return {
        onScroll: ({ y, vh }) => {
          flatness = clamp(y / (vh * 0.55), 0, 1);
          apply();
        },
        destroy: () => {
          eased.stop();
          listeners();
        },
      };
    },
    { enabled: tilt }
  );

  const open = () => {
    // The page's scrollbar width, so the scroll lock can keep the page from widening behind it.
    const root = document.documentElement;
    root.style.setProperty("--scroll-lock-gap", `${window.innerWidth - root.clientWidth}px`);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const cropStyle = trimTop
    ? ({
        aspectRatio: `${width} / ${height - trimTop}`,
        "--trim": `${((-trimTop / width) * 100).toFixed(4)}%`,
      } as CSSProperties)
    : undefined;

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
          ref={openerRef}
          type="button"
          className={styles.open}
          aria-label={`${enlargeLabel}: ${title}`}
          aria-haspopup="dialog"
          onClick={open}
        >
          <span className={trimTop ? styles.crop : undefined} style={cropStyle}>
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />
          </span>
        </button>
      </div>
      <figcaption>
        <b>{captionLead}</b>
        {captionBody ? ` ${captionBody}` : null}
        {provenance ? (
          <>
            {" "}
            <span className={styles.provenance}>{provenance}</span>
          </>
        ) : null}
      </figcaption>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={title}
        onClose={() => openerRef.current?.focus()}
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
        {/* Focusable so the keyboard can pan an image wider than the dialog (arrow keys). */}
        <div className={styles.dialogImage} tabIndex={0}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={DIALOG_IMAGE_SIZES}
            loading="lazy"
          />
        </div>
      </dialog>
    </figure>
  );
};
