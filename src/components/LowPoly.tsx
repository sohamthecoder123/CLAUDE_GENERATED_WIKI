import { useEffect, useRef } from "react";

/*
 * Animated low-poly backdrop that echoes the faceted green background of the
 * landing banner. Draws on a <canvas> that fills its parent, so give the parent
 * `position: relative` and a size. No external libraries.
 */

type RGB = [number, number, number];

export interface LowPolyProps {
  /** Colour ramp, left to right across the canvas. */
  colors?: string[];
  /** Approximate facet size in px. */
  cell?: number;
  /** How far facet corners drift, in px. 0 freezes the pattern. */
  drift?: number;
  /** Brighten facets under the pointer. */
  glow?: boolean;
  seed?: number;
  className?: string;
}

const hexToRgb = (h: string): RGB => {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const ramp = (stops: RGB[], t: number): RGB => {
  const c = Math.max(0, Math.min(1, t));
  const s = c * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(s));
  return mix(stops[i], stops[i + 1], s - i);
};

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

interface Pt { bx: number; by: number; x: number; y: number; ph: number; mv: boolean }
interface Tri { v: [number, number, number]; n: number }

export function LowPoly({
  colors = ["#11574a", "#1d715f", "#2b7f6d", "#427964", "#4f8a5c"],
  cell = 100,
  drift = 6,
  glow = false,
  seed = 7,
  className,
}: LowPolyProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stops = colors.map(hexToRgb);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pts: Pt[] = [];
    let tris: Tri[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const r = rng(seed);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      const sx = w / (cols - 1);
      const sy = h / (rows - 1);
      pts = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const edgeX = x === 0 || x === cols - 1;
          const edgeY = y === 0 || y === rows - 1;
          const bx = x * sx + (edgeX ? 0 : (r() - 0.5) * sx * 0.8);
          const by = y * sy + (edgeY ? 0 : (r() - 0.5) * sy * 0.8);
          pts.push({ bx, by, x: bx, y: by, ph: r() * Math.PI * 2, mv: !(edgeX || edgeY) });
        }
      }
      tris = [];
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const a = y * cols + x, b = a + 1, c = a + cols, d = c + 1;
          const quad: [number, number, number][] = r() > 0.5 ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]];
          quad.forEach((v) => tris.push({ v, n: (r() - 0.5) * 0.22 }));
        }
      }
    };

    const draw = (time = 0) => {
      const t = time / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const p of pts) {
        p.x = p.bx + (p.mv && !reduce ? Math.sin(t * 0.35 + p.ph) * drift : 0);
        p.y = p.by + (p.mv && !reduce ? Math.cos(t * 0.3 + p.ph) * drift : 0);
      }
      for (const tr of tris) {
        const A = pts[tr.v[0]], B = pts[tr.v[1]], C = pts[tr.v[2]];
        const cx = (A.x + B.x + C.x) / 3;
        const cy = (A.y + B.y + C.y) / 3;
        const col = ramp(stops, (cx / w) * 0.75 + (cy / h) * 0.25);
        // facet shading: fixed light plus per-facet noise, like the banner
        const nx = (B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y);
        let shade = tr.n + (nx > 0 ? 0.04 : -0.04);
        if (glow) shade += Math.max(0, 1 - Math.hypot(cx - mouse.x, cy - mouse.y) / 220) * 0.22;
        const k = 1 + shade;
        const fill = `rgb(${(col[0] * k) | 0},${(col[1] * k) | 0},${(col[2] * k) | 0})`;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = fill;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    build();
    draw(0);

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    if (glow && host) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (glow && host) {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [colors.join(), cell, drift, glow, seed]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
