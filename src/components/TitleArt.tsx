import { useEffect, useRef, type CSSProperties } from "react";
import "./TitleArt.css";

/*
 * Small low-poly illustrations that build themselves up when they come into view.
 * Each one is the team's own picture cut into layers; every layer flies, grows or
 * wipes into place in turn. Reduced motion shows the finished picture.
 *
 *   <div className="xyz-hero-text title-art-row title-art-row--left">
 *     <TitleArt name="grad-cap" />
 *     <h1 className="xyz-title">Education</h1>
 *   </div>
 */

/** Where the layer PNGs live. Upload assets/<name>/*.png here and replace TEAM_PATH. */
/*
 * In this site the layers are bundled from src/assets/<name>/ (so they ship with
 * the build). When a layer is not bundled the URL falls back to `base`, i.e. the
 * static.igem.wiki path below once TEAM_PATH is filled in.
 */
const BUNDLED = import.meta.glob("../assets/*/*.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export const TITLE_ART_BASE = "https://static.igem.wiki/teams/TEAM_PATH/animations/";

interface Layer {
  /** File name in assets/<name>/, without .png. */
  file: string;
  /** Seconds after the picture comes into view. */
  delay: number;
  /** Seconds the move takes. */
  dur?: number;
  /** Start offset (as % of the picture), rotation and scale; the layer moves from there to rest. */
  fx?: number;
  fy?: number;
  fr?: number;
  fs?: number;
  /** Reveal by uncovering instead of moving: "right" sweeps left to right, "down" top to bottom, "up" bottom to top. */
  wipe?: "right" | "down" | "up";
  /** Pivot for rotation and scale, as CSS transform-origin. */
  origin?: string;
  /** "bounce" overshoots slightly before settling. */
  ease?: "bounce" | "smooth";
}

interface Art {
  label: string;
  /** Pixel size of the layers, for the aspect ratio. */
  w: number;
  h: number;
  /** A picture on its own coloured background (the "panel" layer): drawn as a rounded card. */
  card?: boolean;
  layers: Layer[];
}

export const TITLE_ART = {
  earth: {
    label: "The Earth, with a young plant growing from it, held in two hands",
    w: 205, h: 268,
    layers: [
      { file: "earth", delay: 0.2, dur: 1, fs: 0.4, fr: -40, origin: "49% 49%" },
      { file: "plant", delay: 1.05, dur: 0.9, fs: 0, origin: "57.5% 23%", ease: "bounce" },
      { file: "hands", delay: 1.65, dur: 1, fy: 28 },
    ],
  },
  "grad-cap": {
    label: "A graduation cap settling on a stack of three books",
    w: 209, h: 244,
    layers: [
      { file: "book-blue", delay: 0.1, fy: -45, ease: "bounce" },
      { file: "book-orange", delay: 0.4, fy: -55, ease: "bounce" },
      { file: "book-pink", delay: 0.7, fy: -65, ease: "bounce" },
      { file: "cap", delay: 1.1, dur: 1.1, fy: -40, fr: -18, origin: "50% 45%", ease: "bounce" },
    ],
  },
  notebook: {
    label: "A spiral notebook filling with a molecule, a chart and notes, then a pen",
    w: 206, h: 240,
    layers: [
      { file: "notebook", delay: 0.1, fs: 0.6, fr: -10, origin: "50% 60%", ease: "bounce" },
      { file: "molecule", delay: 0.75, dur: 0.9, wipe: "right" },
      { file: "chart", delay: 1.15, dur: 0.7, wipe: "up" },
      { file: "notes", delay: 1.5, dur: 1.1, wipe: "down" },
      { file: "pen", delay: 2.0, dur: 0.9, fx: 30, fy: -30, fr: 20, origin: "80% 25%", ease: "bounce" },
    ],
  },
  presenting: {
    label: "A student presenting a flow chart and notes on a whiteboard",
    w: 268, h: 250,
    layers: [
      { file: "board", delay: 0.1, fs: 0.7, origin: "70% 30%", ease: "bounce" },
      { file: "person", delay: 0.35, fy: 25 },
      { file: "boxes", delay: 0.9, dur: 1.2, wipe: "right" },
      { file: "lines", delay: 1.4, dur: 1.2, wipe: "right" },
      { file: "marks", delay: 1.9, dur: 0.5, fs: 0, origin: "5% 15%", ease: "bounce" },
    ],
  },
  laptop: {
    label: "A student at a laptop beside a checklist being ticked off",
    w: 270, h: 210,
    layers: [
      { file: "person", delay: 0.1, fy: 20 },
      { file: "laptop", delay: 0.45, fx: 25, ease: "bounce" },
      { file: "checklist", delay: 0.85, fs: 0.5, origin: "77% 24%", ease: "bounce" },
      { file: "row-1", delay: 1.2, dur: 1.3, wipe: "right" },
      { file: "row-2", delay: 1.45, dur: 1.3, wipe: "right" },
      { file: "row-3", delay: 1.7, dur: 1.3, wipe: "right" },
      { file: "marks", delay: 2.1, dur: 0.5, fs: 0, origin: "98% 18%", ease: "bounce" },
    ],
  },
  reading: {
    label: "A student sitting with a laptop, books and a water bottle, thinking about a book",
    w: 275, h: 230,
    layers: [
      { file: "person", delay: 0.1, fy: 20 },
      { file: "books", delay: 0.5, fy: -50, ease: "bounce" },
      { file: "bottle", delay: 0.75, fy: -50, ease: "bounce" },
      { file: "bubble", delay: 1.1, fs: 0, origin: "30% 37%", ease: "bounce" },
      { file: "marks", delay: 1.5, dur: 0.5, fs: 0, origin: "80% 10%", ease: "bounce" },
    ],
  },
  stairs: {
    label: "A student looking at a staircase with a flag at the top",
    w: 311, h: 259,
    layers: [
      { file: "person", delay: 0.1, fx: -20 },
      { file: "stairs", delay: 0.5, dur: 1.1, wipe: "up" },
      { file: "arrow", delay: 1.0, dur: 1.2, wipe: "right" },
      { file: "flag", delay: 1.7, fs: 0, origin: "85% 26%", ease: "bounce" },
      { file: "marks", delay: 2.0, dur: 0.5, fs: 0, origin: "88% 5%", ease: "bounce" },
    ],
  },
  drawing: {
    label: "A student drawing a diagram in the air, with a gear and a chart",
    w: 269, h: 260,
    layers: [
      { file: "person", delay: 0.1, fy: 20 },
      { file: "sparks", delay: 0.7, dur: 0.5, fs: 0, origin: "62% 40%", ease: "bounce" },
      { file: "gear", delay: 0.9, dur: 1.1, fs: 0, fr: -180, origin: "46% 10%" },
      { file: "chart", delay: 1.2, fs: 0.3, origin: "75% 14%", ease: "bounce" },
      { file: "diagram", delay: 1.5, dur: 1.4, wipe: "right" },
    ],
  },
  clipboard: {
    label: "A clipboard filling with a flow chart and a ticked checklist, with a gear",
    w: 243, h: 264,
    layers: [
      { file: "clipboard", delay: 0.1, fs: 0.6, fr: -8, origin: "50% 55%", ease: "bounce" },
      { file: "flow", delay: 0.7, dur: 1.1, wipe: "right" },
      { file: "row-1", delay: 1.2, dur: 1.2, wipe: "right" },
      { file: "row-2", delay: 1.45, dur: 1.2, wipe: "right" },
      { file: "row-3", delay: 1.7, dur: 1.2, wipe: "right" },
      { file: "gear", delay: 2.0, dur: 1.1, fs: 0, fr: -200, origin: "84% 76%" },
    ],
  },
  scales: {
    label: "A pair of scales balancing a leaf and a person",
    w: 236, h: 215,
    layers: [
      { file: "stand", delay: 0.1, fy: 25 },
      { file: "pan-left", delay: 0.5, fy: -40, fr: 10, origin: "20% 25%", ease: "bounce" },
      { file: "pan-right", delay: 0.7, fy: -40, fr: -10, origin: "80% 25%", ease: "bounce" },
      { file: "leaf", delay: 1.1, fy: -60, fr: -20, ease: "bounce" },
      { file: "person", delay: 1.35, fy: -60, ease: "bounce" },
    ],
  },
  "mosquito-suppression": {
    label: "A mosquito with a cross over it, and an arrow down through ever smaller mosquitoes",
    w: 322, h: 432, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "mosquito", delay: 0.7, fy: -40, ease: "bounce" },
      { file: "cross", delay: 1.2, dur: 0.5, fs: 0, origin: "30% 50%", ease: "bounce" },
      { file: "arrow", delay: 1.6, dur: 1.0, wipe: "right" },
      { file: "small-1", delay: 2.1, dur: 0.5, fs: 0, origin: "50% 100%", ease: "bounce" },
      { file: "small-2", delay: 2.4, dur: 0.5, fs: 0, origin: "50% 100%", ease: "bounce" },
      { file: "small-3", delay: 2.7, dur: 0.5, fs: 0, origin: "50% 100%", ease: "bounce" },
      { file: "small-4", delay: 3.0, dur: 0.5, fs: 0, origin: "50% 100%", ease: "bounce" },
    ],
  },
  "risc": {
    label: "Proteins feeding into the RISC complex, which cuts mosGILT mRNA into fragments",
    w: 388, h: 472, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "proteins", delay: 0.7, fy: -40, ease: "bounce" },
      { file: "arrow-1", delay: 1.2, dur: 0.5, wipe: "down" },
      { file: "risc", delay: 1.6, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "label", delay: 2.1, dur: 0.6, wipe: "right" },
      { file: "arrow-2", delay: 2.5, dur: 0.5, wipe: "down" },
      { file: "fragments", delay: 2.9, fy: -20, ease: "bounce" },
    ],
  },
  "gene-silenced": {
    label: "mosGILT DNA, then an arrow to the same DNA crossed out: gene silenced",
    w: 193, h: 319, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "title", delay: 0.6, dur: 0.6, wipe: "right" },
      { file: "dna-top", delay: 1.0, dur: 0.9, wipe: "right" },
      { file: "arrow", delay: 1.8, dur: 0.6, wipe: "down" },
      { file: "dna-bottom", delay: 2.3, dur: 0.9, wipe: "right" },
      { file: "cross", delay: 3.0, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "caption", delay: 3.4, dur: 0.7, wipe: "right" },
    ],
  },
  "spread": {
    label: "A mosquito, a smaller one below it, and a tiny one, linked by arrows showing spread",
    w: 216, h: 304, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "mosquito-1", delay: 0.7, fy: -30, ease: "bounce" },
      { file: "arrow-curve", delay: 1.4, dur: 0.8, wipe: "down" },
      { file: "mosquito-3", delay: 2.0, dur: 0.5, fs: 0, origin: "50% 100%", ease: "bounce" },
      { file: "arrow-left", delay: 2.4, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "mosquito-2", delay: 2.7, fy: -30, ease: "bounce" },
    ],
  },
  "cargo-binding": {
    label: "RNAi cargo binding: MS2 coat proteins clamp onto stem-loops in the RNAi cargo",
    w: 322, h: 180, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "title", delay: 0.6, dur: 0.6, wipe: "right" },
      { file: "ms2", delay: 1.0, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "peptides", delay: 1.4, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "rna", delay: 1.8, dur: 0.9, wipe: "right" },
      { file: "callout-top", delay: 2.6, dur: 0.7, wipe: "right" },
      { file: "callout-right", delay: 3.0, dur: 0.7, wipe: "right" },
    ],
  },
  "fusion-protein": {
    label: "The fusion protein construct: MS2 coat proteins, a linker and membrane translocation peptides",
    w: 315, h: 160, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "title", delay: 0.6, dur: 0.6, wipe: "right" },
      { file: "ms2", delay: 1.0, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "linker", delay: 1.5, dur: 0.6, wipe: "right" },
      { file: "peptides", delay: 2.0, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "label-1", delay: 2.5, dur: 0.5, wipe: "right" },
      { file: "label-2", delay: 2.7, dur: 0.5, wipe: "right" },
      { file: "label-3", delay: 2.9, dur: 0.5, wipe: "right" },
    ],
  },
  "rnai-pathway": {
    label: "The RNAi pathway: dsRNA is cut by Dicer into siRNA, loaded into RISC, and the transcript is degraded",
    w: 300, h: 171, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "dsrna", delay: 0.6, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "arrow-1", delay: 1.0, dur: 0.4, wipe: "down" },
      { file: "dicer", delay: 1.4, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "arrow-2", delay: 1.9, dur: 0.4, wipe: "right" },
      { file: "sirna", delay: 2.2, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "arrow-3", delay: 2.7, dur: 0.4, wipe: "right" },
      { file: "risc", delay: 3.0, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "arrow-4", delay: 3.5, dur: 0.4, wipe: "right" },
      { file: "fragments", delay: 3.8, fy: -20, ease: "bounce" },
      { file: "caption", delay: 4.2, dur: 0.7, wipe: "right" },
    ],
  },
  "dbtl-cycle": {
    label: "The MOSKATEER design, build, test, learn cycle drawn as a ring around the project name",
    w: 654, h: 655,
    layers: [
      { file: "panel", delay: 0.05, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "centre", delay: 0.1, dur: 0.5, fs: 0.6, origin: "50% 50%", ease: "bounce" },
      { file: "design", delay: 0.6, dur: 0.9, wipe: "right" },
      { file: "arrow-c", delay: 1.5, dur: 0.5, wipe: "down" },
      { file: "build", delay: 1.9, dur: 0.9, wipe: "down" },
      { file: "arrow-d", delay: 2.8, dur: 0.5, wipe: "down" },
      { file: "test", delay: 3.2, dur: 0.9, wipe: "up" },
      { file: "arrow-b", delay: 4.1, dur: 0.5, wipe: "up" },
      { file: "learn", delay: 4.5, dur: 0.9, wipe: "up" },
      { file: "arrow-a", delay: 5.4, dur: 0.9, wipe: "up" },
    ],
  },
  "dbtl-steps": {
    label: "Four hexagons in a row for the steps Design, Build, Test and Learn, joined by dotted lines",
    w: 1681, h: 558, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "hex-1", delay: 0.6, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "text-1", delay: 1.0, dur: 0.6, wipe: "right" },
      { file: "dots-1", delay: 1.5, dur: 0.5, wipe: "right" },
      { file: "hex-2", delay: 1.8, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "text-2", delay: 2.2, dur: 0.6, wipe: "right" },
      { file: "dots-2", delay: 2.7, dur: 0.5, wipe: "right" },
      { file: "hex-3", delay: 3.0, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "text-3", delay: 3.4, dur: 0.6, wipe: "right" },
      { file: "dots-3", delay: 3.9, dur: 0.5, wipe: "right" },
      { file: "hex-4", delay: 4.2, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "text-4", delay: 4.6, dur: 0.6, wipe: "right" },
    ],
  },
  "delivery-construct": {
    label: "The RNA delivery construct built from MS2 coat proteins, a linker, membrane translocation peptides and the silencing RNA cargo",
    w: 769, h: 630, card: true,
    layers: [
      { file: "panel", delay: 0.1, dur: 0.7, fs: 0.8, ease: "bounce" },
      { file: "col-1", delay: 0.6, fy: -20, ease: "bounce" },
      { file: "col-2", delay: 0.9, fy: -20, ease: "bounce" },
      { file: "col-3", delay: 1.2, fy: -20, ease: "bounce" },
      { file: "col-4", delay: 1.5, fy: -20, ease: "bounce" },
      { file: "bracket", delay: 2.0, dur: 0.8, wipe: "right" },
      { file: "arrow", delay: 2.9, dur: 0.5, wipe: "down" },
      { file: "construct", delay: 3.3, dur: 0.5, fs: 0, origin: "50% 50%", ease: "bounce" },
      { file: "labels", delay: 3.9, dur: 0.8, wipe: "right" },
      { file: "bracket-bottom", delay: 4.5, dur: 0.8, wipe: "right" },
    ],
  },
  "vlogger": {
    label: "A person holding a laptop in one hand and a camera on a stick in the other",
    w: 110, h: 151,
    layers: [
      { file: "person", delay: 0.1, fy: 20, ease: "smooth" },
      { file: "laptop", delay: 0.6, fx: -25, ease: "bounce" },
      { file: "camera", delay: 1.0, fx: 25, ease: "bounce" },
    ],
  },
} satisfies Record<string, Art>;

export type TitleArtName = keyof typeof TITLE_ART;

const WIPES = { right: "inset(0 100% 0 0)", down: "inset(0 0 100% 0)", up: "inset(100% 0 0 0)" };

export function TitleArt({ name, base = TITLE_ART_BASE, className }: { name: TitleArtName; base?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const art: Art = TITLE_ART[name];

  // Start the build-up once the picture is on screen (straight away if it already is).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-playing");
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add("is-playing");
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`title-art${art.card ? " title-art--card" : ""}${className ? ` ${className}` : ""}`} role="img" aria-label={art.label}
      style={{ aspectRatio: `${art.w} / ${art.h}` }}>
      {art.layers.map((l) => (
        <img key={l.file} src={BUNDLED[`../assets/${name}/${l.file}.png`] ?? `${base}${name}/${l.file}.png`} alt="" draggable={false}
          className={`title-art-layer ${l.wipe ? "title-art-wipe" : "title-art-fly"}${l.ease === "bounce" ? " title-art-bounce" : ""}`}
          style={{
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.dur ?? 0.8}s`,
            transformOrigin: l.origin,
            "--fx": `${l.fx ?? 0}%`, "--fy": `${l.fy ?? 0}%`, "--fr": `${l.fr ?? 0}deg`, "--fs": l.fs ?? 1,
            "--clip": l.wipe ? WIPES[l.wipe] : undefined,
          } as CSSProperties} />
      ))}
    </div>
  );
}
