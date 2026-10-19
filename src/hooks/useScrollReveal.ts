import { useEffect } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/*
 * Reveal-on-scroll, done once for the whole wiki.
 *
 * Any element inside `root` carrying [data-reveal] starts hidden (the CSS in
 * wiki-page.css does that, so there is no flash before this effect runs) and gets
 * .is-in the first time it crosses into view. Elements sharing a
 * [data-reveal-group] stagger by `stagger` ms in document order.
 *
 * One IntersectionObserver per page, not one per element, and each element is
 * unobserved once revealed: the page can carry a few hundred paragraphs without
 * the observer becoming the slow part of scrolling.
 */
export function useScrollReveal(
  root: React.RefObject<HTMLElement | null>,
  { threshold = 0.15, stagger = 70 }: { threshold?: number; stagger?: number } = {},
) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!targets.length) return;

    // No animation at all: show everything and leave.
    if (prefersReducedMotion()) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }

    // Position within its stagger group, so siblings come in one after another.
    const seen = new Map<string, number>();
    targets.forEach((t) => {
      const group = t.dataset.revealGroup;
      if (!group) return;
      const n = seen.get(group) ?? 0;
      seen.set(group, n + 1);
      t.style.setProperty("--reveal-delay", `${n * stagger}ms`);
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root, threshold, stagger]);
}
