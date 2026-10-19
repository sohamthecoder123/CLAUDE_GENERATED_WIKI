import { useMemo } from "react";
import markup from "../assets/figures/mosquito-logo.svg?raw";

/*
 * The MOSKATEER mosquito.
 *
 * In the team logo the mosquito *is* the M of MOSKATEER — a musketeer, with a
 * plumed hat and a rapier — and the rule on this wiki is that every mosquito
 * anywhere is that same drawing, drawn large enough to be prominent. Never
 * another mosquito, never recoloured.
 *
 * The drawing is traced from the banner in
 * wiki/illustrations/_source/logo.py and exported to
 * src/assets/figures/mosquito-logo.svg. This component only sizes and places
 * it, so the mark on a page and the mark inside a generated figure are the
 * same file.
 */

export interface MosquitoProps {
  /** Rendered height: a number of px, or any CSS length. */
  size?: number | string;
  /** The logo faces right. "left" mirrors it, for a mosquito flying inward. */
  facing?: "left" | "right";
  /** Given to screen readers. Omit for a purely decorative mark. */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Mosquito({ size = 64, facing = "right", title, className, style }: MosquitoProps) {
  // Strip the exported file's own aria-label when this instance is decorative,
  // and let the caller's height drive the box.
  const html = useMemo(
    () =>
      markup
        .replace(/\swidth="\d+"/, "")
        .replace(/\sheight="\d+"/, "")
        .replace(/\saria-label="[^"]*"/, ""),
    [],
  );

  return (
    <span
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{
        display: "inline-block",
        lineHeight: 0,
        height: typeof size === "number" ? `${size}px` : size,
        transform: facing === "left" ? "scaleX(-1)" : undefined,
        ...style,
      }}
      // Our own exported asset, not user input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
