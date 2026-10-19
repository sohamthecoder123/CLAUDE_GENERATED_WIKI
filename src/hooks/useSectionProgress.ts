import { useEffect, useState } from "react";

export interface SectionProgress {
  /** Index of the section being read, or -1 before the first one. */
  active: number;
  /** 0 to 1 through the whole run of sections. Drives the ring and the rail. */
  progress: number;
}

/*
 * Which section is being read, and how far through the page the reader is.
 *
 * Reads geometry on scroll inside a rAF, never in the event itself, and only
 * re-renders when the active index or the rounded progress actually changes —
 * the sticky navigator is on screen the whole way down, so a re-render per
 * scroll event would be felt.
 */
export function useSectionProgress(ids: string[]): SectionProgress {
  const [state, setState] = useState<SectionProgress>({ active: -1, progress: 0 });

  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    let last = { active: -2, progress: -1 };

    const measure = () => {
      frame = 0;
      const nodes = ids.map((id) => document.getElementById(id));
      // The line the reader's eye is on: a third of the way down the viewport.
      const line = window.scrollY + window.innerHeight * 0.34;

      let active = -1;
      nodes.forEach((n, i) => {
        if (n && window.scrollY + n.getBoundingClientRect().top <= line) active = i;
      });

      const first = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      let progress = 0;
      if (first && lastNode) {
        const start = window.scrollY + first.getBoundingClientRect().top;
        const end = window.scrollY + lastNode.getBoundingClientRect().bottom;
        progress = Math.max(0, Math.min(1, (line - start) / Math.max(1, end - start)));
      }

      const rounded = Math.round(progress * 200) / 200;
      if (active !== last.active || rounded !== last.progress) {
        last = { active, progress: rounded };
        setState({ active, progress: rounded });
      }
    };

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return state;
}
