import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { LowPoly } from "../components/LowPoly";
import { COUNTRIES, MAP_H, MAP_W, PINS } from "./home-map";
import { FIGURES, MOSQUITO } from "./home-figures";
import BANNER from "../../assets/home-banner.png";
import LOGO_SLIDE from "../../assets/home-logo-slide.png";
import "./home.css";

/*
 * Home / landing page.
 * A scroll-driven story: the malaria challenge, the numbers, the reveal of
 * MOSKATEER, then three "scrollytelling" parts (molecule, sugar trap, spread)
 * where text panels scroll past a sticky illustration, a sideways "whole chain"
 * strip, and links into the rest of the wiki. No external libraries.
 */

/* ---------- one shared scroll loop ---------- */

type Sub = () => void;
const subs = new Set<Sub>();
let queued = false;
const runSubs = () => {
  queued = false;
  subs.forEach((f) => f());
};
const onScroll = () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(runSubs);
  }
};

/** Calls `fn` on every scroll/resize frame (and once on mount). */
function useFrame(fn: Sub) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    const f = () => ref.current();
    if (subs.size === 0) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    subs.add(f);
    f();
    return () => {
      subs.delete(f);
      if (subs.size === 0) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, []);
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
/** Maps p from [a, b] to [0, 1]. */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/**
 * Progress through a tall pinned section: 0 when its top is 35% down the
 * viewport, 1 when its sticky stage is about to scroll away. Written to --p.
 */
function usePin(ref: RefObject<HTMLElement | null>, onP?: (p: number, el: HTMLElement) => void, leadFrac = 0.35) {
  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const lead = vh * leadFrac;
    const span = r.height - vh;
    // a section that is not pinned (phones) reveals as it scrolls through the viewport instead
    const p = span > vh * 0.1 ? clamp01((lead - r.top) / (span + lead)) : clamp01((vh * 0.85 - r.top) / (r.height * 0.75));
    el.style.setProperty("--p", p.toFixed(4));
    onP?.(p, el);
  });
}

/**
 * Scrollytelling: the step whose top has passed 60% of the viewport is active.
 * Writes the step's own progress to --sp and returns the active index.
 */
function useSteps(ref: RefObject<HTMLElement | null>, onSp?: (step: number, sp: number, el: HTMLElement) => void) {
  const [step, setStep] = useState(0);
  const cur = useRef(0);
  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const steps = el.querySelectorAll<HTMLElement>("[data-step]");
    if (!steps.length) return;
    // on phones the stage fills the top half, so a step activates as it enters the lower half
    const line = window.innerHeight * (window.innerWidth <= 860 ? 0.8 : 0.6);
    let a = 0;
    steps.forEach((s, i) => {
      if (s.getBoundingClientRect().top < line) a = i;
    });
    const r = steps[a].getBoundingClientRect();
    const sp = clamp01((line - r.top) / r.height);
    el.style.setProperty("--sp", sp.toFixed(4));
    if (a !== cur.current) {
      cur.current = a;
      setStep(a);
    }
    onSp?.(a, sp, el);
  });
  return step;
}

/** Adds .in to [data-reveal] children once they scroll into view. */
function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -12% 0px" },
    );
    items.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

/** Moves `mover` to the point `t` (0–1) along `path`, and draws `trail` up to it. */
function placeOnPath(path: SVGPathElement | null, mover: SVGGraphicsElement | null, t: number, trail?: SVGPathElement | null) {
  if (!path || !mover) return;
  const len = path.getTotalLength();
  const at = path.getPointAtLength(len * clamp01(t));
  const ahead = path.getPointAtLength(Math.min(len, len * clamp01(t) + 2));
  const flip = ahead.x < at.x ? " scale(-1,1)" : "";
  mover.setAttribute("transform", `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})${flip}`);
  if (trail) {
    trail.style.strokeDasharray = `${len}`;
    trail.style.strokeDashoffset = `${len * (1 - clamp01(t))}`;
  }
}

/** Small seeded random generator so the illustrations are identical on every load. */
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const HERO_COLORS = ["#0f4a3f", "#1d715f", "#2b7f6d", "#3f8a6a", "#4f8f74"];

/* ---------- shared SVG symbols ---------- */

function Symbols() {
  return (
    <svg className="hm-defs" aria-hidden="true" focusable="false">
      <defs>
        {/* mosquito, head on the left; colour follows currentColor */}
        {/* the team's mosquito, from the shared illustration set; never redrawn, never recoloured */}
        <symbol id="hm-mosq" viewBox={MOSQUITO.viewBox} overflow="visible" dangerouslySetInnerHTML={{ __html: MOSQUITO.markup }} />
        {/* the bait station, traced from the team's own prototype */}
        <symbol id="hm-trap" viewBox={FIGURES.trap.viewBox} overflow="visible" dangerouslySetInnerHTML={{ __html: FIGURES.trap.markup }} />
        <marker id="hm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- hero ---------- */

/** The team banner, as supplied. */
function Hero() {
  return (
    <header className="hm-hero" id="top">
      <img className="hm-hero-img" src={BANNER} alt="MOSKATEER: engineered paratransgenic symbionts for sustainable malaria control. IISc Bengaluru, iGEM." />
    </header>
  );
}

/* ---------- Act 1, panel 1: the global malaria challenge ---------- */

const TIER_AT = [0, 0.62, 0.52, 0.42, 0.32];

function Challenge() {
  const ref = useRef<HTMLElement>(null);
  const map = useRef<SVGSVGElement>(null);
  usePin(ref, (p) => {
    const m = map.current;
    if (!m) return;
    let lvl = 0;
    for (let t = 4; t >= 1; t--) if (p >= TIER_AT[t]) lvl = 5 - t;
    m.dataset.lvl = String(lvl);
    m.classList.toggle("pins", p > 0.7);
  }, 1);
  // if the text is taller than the screen (short laptop screens, large text), stop pinning so nothing is cut off
  useEffect(() => {
    const el = ref.current;
    const text = el?.querySelector<HTMLElement>(".hm-ch-text");
    if (!el || !text) return;
    const check = () => {
      el.classList.remove("hm-loose");
      el.classList.toggle("hm-loose", text.scrollHeight + 64 > window.innerHeight);
      onScroll();
    };
    const ro = new ResizeObserver(check);
    ro.observe(text);
    window.addEventListener("resize", check);
    document.fonts?.ready.then(check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);
  const r = (a: number) => ({ "--a": a } as CSSProperties);
  return (
    <section ref={ref} className="hm-band hm-band--mist hm-band--first hm-pin hm-challenge" id="challenge" aria-labelledby="hm-ch-title">
      <div className="hm-sticky">
        <div className="hm-ch-grid">
          <div className="hm-ch-text">
            <h2 id="hm-ch-title" className="hm-big">
              <span className="hm-r" style={r(0)}>The Global</span>
              <span className="hm-r" style={r(0.04)}>Malaria</span>
              <span className="hm-r" style={r(0.08)}>Challenge</span>
            </h2>
            <p className="hm-r" style={r(0.14)}>
              Malaria is one of the world&rsquo;s oldest and among the most persistent public health crises across the globe.
            </p>
            <p className="hm-r" style={r(0.24)}>
              Malaria remains endemic across large parts of <mark className="hm-hl" style={r(0.36)}>Sub-Saharan Africa and South Asia</mark>, including
              India, placing millions of people, especially <mark className="hm-hl" style={r(0.44)}>infants, young children, and pregnant women</mark> at
              risk every year.
            </p>
            <p className="hm-r" style={r(0.54)}>
              Despite decades of medical intervention, the disease has never been eliminated, only pushed back and forth.
            </p>
          </div>
          <figure className="hm-map-wrap hm-r" style={r(0.02)}>
            <svg ref={map} className="hm-map" data-fit viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="World map of malaria burden, highest across Sub-Saharan Africa, with high burden in India and South-East Asia">
              {COUNTRIES.map((c) => (
                <path key={c.id + c.n} d={c.d} className={`t${c.t}`}>
                  <title>{c.n}</title>
                </path>
              ))}
              {PINS.map((p, i) => (
                <g key={p.n} className="hm-pin-mark" transform={`translate(${p.x} ${p.y})`} style={{ "--i": i } as CSSProperties}>
                  <circle r="16" className="hm-pulse" />
                  <circle r="5" />
                  <text x={i ? 12 : 0} y={i ? -14 : 134} textAnchor={i ? "start" : "middle"}>{p.n}</text>
                </g>
              ))}
            </svg>
            <figcaption className="hm-legend">
              <span>Low</span>
              <i aria-hidden="true" />
              <span>High</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- Act 1, panel 2: the disaster in numbers ---------- */

/** Ragged edges for a torn sheet of paper, as a clip-path polygon. */
function tornEdge(seed: number, amp = 1.6): string {
  const r = rng(seed);
  const n = 18;
  const pts: string[] = [];
  const x = (i: number) => ((i / n) * 100).toFixed(1);
  for (let i = 0; i <= n; i++) pts.push(`${x(i)}% ${(r() * amp).toFixed(2)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${x(i)}% ${(100 - r() * amp).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
}

/* The faceted green-and-blue mosaic the team's own numbers card is built on. */
const NUM_COLORS = ["#0f4a3f", "#14505e", "#1d715f", "#123a52", "#1f6a52", "#0b3029"];

/*
 * The disaster, in numbers. The team's numbers card, rebuilt as live text on
 * the page's own faceted backdrop: torn paper strips and a taped year label.
 * Scroll-driven: the card fills the screen, then draws back to a square on the
 * left while the write-up arrives beside it.
 */
function Numbers() {
  const ref = useRef<HTMLElement>(null);
  usePin(ref);
  return (
    <section ref={ref} className="hm-band hm-band--dark hm-pin hm-numbers" id="numbers" aria-labelledby="hm-num-title">
      <div className="hm-sticky">
        <div className="hm-num-stack">
          <figure className="hm-poster">
            <LowPoly className="hm-fill" colors={NUM_COLORS} cell={120} drift={4} seed={5} />
            <figcaption className="hm-poster-tape" style={{ clipPath: tornEdge(41, 6) }}>2024</figcaption>
            <div className="hm-poster-rows" aria-hidden="true">
              <p className="hm-strip" style={{ clipPath: tornEdge(3) }}>282 million</p>
              <p className="hm-strip-cap">malaria cases</p>
              <p className="hm-strip" style={{ clipPath: tornEdge(11) }}>610,000</p>
              <p className="hm-strip-cap">deaths</p>
            </div>
          </figure>
          <div className="hm-num-text">
            <h2 id="hm-num-title">The Disaster, in Numbers</h2>
            <p>In 2024 alone, the world recorded</p>
            <p className="hm-num-lede">282 million malaria cases and 610,000 deaths</p>
            <p>95% of them concentrated in the WHO African Region, where children under five accounted for roughly three out of every four deaths</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the team's logo slide, after the solution ---------- */

function LogoSlide() {
  return (
    <section className="hm-band hm-band--paper hm-logo-slide" id="solution" aria-label="MOSKATEER">
      <div className="hm-inner">
        <img className="hm-logo-slide-img" src={LOGO_SLIDE} alt="MOSKATEER logo: the musketeer mosquito and the lettering OSKATEER over a mosquito wing, with the IISc and iGEM marks" />
      </div>
    </section>
  );
}

/* ---------- scrollytelling frame ---------- */

interface Step {
  title: string;
  body: ReactNode;
}

function Scrolly({
  id, part, title, tone, band, steps, stage, onSp,
}: {
  id: string;
  part: string;
  title: string;
  tone: "paper" | "mist" | "night";
  band: "mist" | "paper" | "dark" | "teal";
  steps: Step[];
  stage: (step: number) => ReactNode;
  onSp?: (step: number, sp: number, el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const step = useSteps(ref, onSp);
  useReveal(ref);
  return (
    <section ref={ref} className={`hm-band hm-band--${band} hm-scrolly hm-${tone}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="hm-part-head" data-reveal>
        <p className="hm-kicker">{part}</p>
        <h2 id={`${id}-title`} className="hm-part-title">{title}</h2>
      </header>
      <div className="hm-sc-grid">
        <div className="hm-sc-stage" aria-hidden="true">
          <div className="hm-sc-frame">{stage(step)}</div>
          <ol className="hm-sc-ticks">
            {steps.map((s, i) => <li key={s.title} className={i === step ? "on" : i < step ? "done" : ""} />)}
          </ol>
        </div>
        <div className="hm-sc-steps">
          {steps.map((s, i) => (
            <article key={s.title} data-step={i} className={`hm-step${i === step ? " on" : ""}`}>
              <div className="hm-step-card">
                <h3>{s.title}</h3>
                {s.body}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const scene = (step: number, i: number) => `hm-scene${step === i ? " on" : ""}`;

/** One figure from the shared illustration set, filling its frame. */
function Fig({ name, className }: { name: keyof typeof FIGURES | string; className?: string }) {
  const f = FIGURES[name as string];
  if (!f) return null;
  return (
    <svg
      className={`hm-fig${className ? " " + className : ""}`}
      viewBox={f.viewBox}
      role="img"
      aria-label={f.label}
      dangerouslySetInnerHTML={{ __html: f.markup }}
    />
  );
}

/** One step's picture. Its parts are drawn in one after another when it arrives. */
function Slot({ on, children }: { on: boolean; children: ReactNode }) {
  return <div className={`hm-fig-slot${on ? " on" : ""}`}>{children}</div>;
}

/* ---------- Part 1: the molecule ---------- */

const MOL_STEPS: Step[] = [
  { title: "Turning off a single gene", body: <p>MOSKATEER uses RNAi to switch off a single gene the mosquito needs to reproduce.</p> },
  {
    title: "The target: mosGILT",
    body: <p>That gene is <i>mosGILT</i>. Silencing the gene affects the fertility of the <i>Anopheles</i> mosquito, thereby resulting in shrinkage in the mosquito population.</p>,
  },
  {
    title: "The delivery molecule",
    body: (
      <>
        <p>To address the problem of getting an RNAi molecule into a mosquito&rsquo;s cells intact, we engineered a custom fusion protein to do the job.</p>
        <p>One end is built from two tandem MS2 bacteriophage coat proteins, fused directly together, which clamp onto MS2 stem-loops engineered into the RNAi cargo, holding it in place like a molecular hand.</p>
        <p>The other end carries two repeats of a 14-amino-acid membrane-translocation peptide, joined to the RNA-binding end by a flexible (GGGGS)<sub>4</sub> linker, which lets both halves fold and function independently.</p>
      </>
    ),
  },
  {
    title: "From gene to gut",
    body: <p>Put together, the construct works as a shuttle: the RNA-binding end picks up the <i>mosGILT</i>-silencing cargo, the translocation peptide carries it across the mosquito&rsquo;s gut wall, and once inside, the mosquito&rsquo;s own RNAi pathway takes over, degrading the <i>mosGILT</i> transcript and effectively sterilising the mosquito population.</p>,
  },
];

/** A compact copy of the fusion protein with its cargo, used as the shuttle. */
function Construct({ small }: { small?: boolean }) {
  return (
    <g className={small ? "hm-construct sm" : "hm-construct"}>
      <path className="hm-rna" d="M-150 -78 H -118 V -118 a 10 10 0 0 1 20 0 V -78 H -50 V -118 a 10 10 0 0 1 20 0 V -78 H 10" />
      <circle className="hm-ms2" cx="-108" cy="-40" r="34" />
      <circle className="hm-ms2" cx="-40" cy="-40" r="34" />
      <path className="hm-linker" d="M -6 -40 q 9 -14 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0" />
      <rect className="hm-tp" x="102" y="-56" width="34" height="32" rx="9" />
      <rect className="hm-tp" x="140" y="-56" width="34" height="32" rx="9" />
    </g>
  );
}

function MoleculeStage({ step }: { step: number }) {
  return (
    <div className="hm-figs">
      {/* RNAi, silencing one gene */}
      <Slot on={step === 0}><Fig name="silencing" /></Slot>
      {/* what silencing mosGILT does, transcript to egg */}
      <Slot on={step === 1}><Fig name="mosgilt" /></Slot>
      {/* the fusion protein, domain by domain */}
      <Slot on={step === 2}><Fig name="construct" /></Slot>
      {/* the bacterium handing the RNA to a gut cell */}
      <Slot on={step === 3}><Fig name="delivery" /></Slot>
    </div>
  );
}

/* ---------- Part 2: the sugar trap ---------- */

const TRAP_STEPS: Step[] = [
  {
    title: "The delivery problem",
    body: <p>An engineered molecule is only useful if it can actually reach a wild mosquito population, and that meant we needed a delivery method that was cheap, field-deployable, and required no specialized equipment or genetic modification of the mosquito itself.</p>,
  },
  {
    title: "Exploiting a mosquito’s own habits",
    body: <p>Our sugar trap is baited with acetoin and sulcatone, naturally occurring compounds that act as strong mosquito attractants, drawing mosquitoes in.</p>,
  },
  {
    title: "From trap to bacterium",
    body: <p>The sugar solution carries our engineered strain of <i>Asaia bogorensis</i>, a bacterium that already colonizes the mosquito gut naturally. When a mosquito feeds at the trap, it ingests the bacteria along with the sugar meal.</p>,
  },
  {
    title: "A low-cost, scalable tool",
    body: <p>The whole system can be deployed with minimal infrastructure, which matters enormously for regions where cost and logistics have limited the reach of more complex vector-control tools.</p>,
  },
];

const NEEDS: [string, number, number][] = [
  ["Cheap", 60, 100],
  ["Field-deployable", 330, 100],
  ["No special equipment", 4, 380],
  ["No GM mosquitoes", 332, 380],
];

const TRAPS = (() => {
  const r = rng(5);
  return Array.from({ length: 12 }, (_, i) => ({
    x: 96 + (i % 4) * 136 + (r() - 0.5) * 26,
    y: 250 + Math.floor(i / 4) * 86 + (r() - 0.5) * 16,
  }));
})();

function TrapStage({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 600 500" className="hm-svg" data-fit>
      {/* 0: what the delivery had to be */}
      <g className={scene(step, 0)}>
        <use href="#hm-trap" x="230" y="150" width="140" height="180" className="hm-trap-big" />
        {NEEDS.map(([t, x, y], i) => (
          <g key={t} className="hm-need" transform={`translate(${x} ${y})`} style={{ "--i": i } as CSSProperties}>
            {/* sized to the text by fitSvgText */}
            <rect width={t.length * 12.5 + 64} height="52" rx="26" />
            <path d="M17 26 l7 7 l12 -14" />
            <text x="46" y="26" dominantBaseline="central">{t}</text>
          </g>
        ))}
      </g>

      {/* 1: the bait volatiles leaving the station */}
      <g className={scene(step, 1)}>
        <g transform="translate(60 20) scale(0.80)" dangerouslySetInnerHTML={{ __html: FIGURES.trapVolatiles.markup }} />
      </g>

      {/* 2: the meal carries the bacterium into the gut */}
      <g className={scene(step, 2)}>
        <use href="#hm-trap" x="30" y="300" width="110" height="142" />
        <g className="hm-feeder" transform="translate(236 244) scale(2.4)">
          <use href="#hm-mosq" x="-40" y="-40" width="80" height="80" />
        </g>
        <path className="hm-mag-line" d="M292 256 L 378 292" />
        <g className="hm-mag" transform="translate(456 330)">
          <circle r="100" className="hm-mag-ring" />
          {Array.from({ length: 14 }, (_, i) => {
            const a = i * 2.4;
            const rr = 22 + (i % 5) * 15;
            return (
              <g key={i} transform={`translate(${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}) rotate(${(i * 47) % 180})`}>
                <rect className="hm-bact" x="-13" y="-5" width="26" height="10" rx="5" style={{ "--i": i } as CSSProperties} />
              </g>
            );
          })}
        </g>
        <text className="hm-svg-label" x="300" y="484" textAnchor="middle"><tspan fontStyle="italic">Asaia bogorensis</tspan> in the gut</text>
      </g>

      {/* 3: many traps, little infrastructure */}
      <g className={scene(step, 3)}>
        <path className="hm-hill a" d="M0 230 L 90 170 L 180 210 L 290 140 L 400 200 L 500 150 L 600 190 L 600 500 L 0 500 Z" />
        <path className="hm-hill b" d="M0 300 L 120 250 L 240 290 L 360 240 L 480 280 L 600 250 L 600 500 L 0 500 Z" />
        {TRAPS.map((t, i) => (
          <use key={i} className="hm-mini-trap" href="#hm-trap" x={t.x - 36} y={t.y - 38} width="72" height="76" />
        ))}
        <text className="hm-svg-label" x="300" y="70" textAnchor="middle">Minimal infrastructure</text>
        <text className="hm-svg-label soft" x="300" y="96" textAnchor="middle">bait, bacteria, a station</text>
      </g>
    </svg>
  );
}

function trapSp(step: number, sp: number, el: HTMLElement) {
  if (step !== 3) return;
  const n = Math.round(TRAPS.length * ease(seg(sp, 0.05, 0.8)));
  el.querySelectorAll(".hm-mini-trap").forEach((t, i) => t.classList.toggle("on", i < n));
}

/* ---------- Part 3: the bigger picture ---------- */

const SPREAD_STEPS: Step[] = [
  {
    title: "Two routes of spread",
    body: <p>MOSKATEER engineers the carrier (<i>Asaia bogorensis</i>) to spread through the population by two separate routes at once: horizontally, mosquito to mosquito, and vertically, from parent to offspring.</p>,
  },
  {
    title: "Horizontal transmission",
    body: <p>Once a male mosquito is colonized by <i>Asaia bogorensis</i> at the sugar trap, the bacteria can be passed on to other mosquitoes it contacts, venereally, during mating.</p>,
  },
  {
    title: "Vertical transmission",
    body: <p>It is also passed from parent to offspring, implying that the colonized mosquitoes can seed the bacterium and the <i>mosGILT</i>-silencing effect it carries into the next generation, without requiring every new mosquito to individually encounter a sugar trap.</p>,
  },
  {
    title: "Why this matters at scale",
    body: <p>It can propagate outward through a wild population on its own, offering a path toward a self-sustaining, low-maintenance tool for population suppression.</p>,
  },
];

function SpreadStage({ step }: { step: number }) {
  return (
    <div className="hm-figs">
      {/* both routes at once */}
      <Slot on={step === 0}><Fig name="spread" /></Slot>
      {/* male to female, at mating */}
      <Slot on={step === 1}><Fig name="horizontal" /></Slot>
      {/* parent to offspring */}
      <Slot on={step === 2}><Fig name="toOffspring" /></Slot>
      {/* what that adds up to over generations */}
      <Slot on={step === 3}><Fig name="scale" /></Slot>
    </div>
  );
}

/* ---------- the whole chain, end to end (sideways strip) ---------- */

const CHAIN: { title: string; icon: string }[] = [
  { title: "One trap", icon: "icTrap" },
  { title: "One gene silenced", icon: "icGene" },
  { title: "Outward", icon: "icOutward" },
  { title: "Downward", icon: "icDownward" },
];

function Chain() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  usePin(ref, (p, el) => {
    const t = track.current;
    if (!t) return;
    const travel = Math.max(0, t.scrollWidth - el.clientWidth);
    const q = ease(seg(p, 0.08, 0.92));
    t.style.transform = `translate3d(${(-travel * q).toFixed(1)}px,0,0)`;
    el.style.setProperty("--q", q.toFixed(4));
    t.querySelectorAll<HTMLElement>(".hm-link").forEach((c, i, all) => c.classList.toggle("on", q >= i / (all.length + 1) - 0.02));
  });
  return (
    <section ref={ref} className="hm-band hm-band--teal hm-pin hm-chain" id="chain" aria-labelledby="hm-chain-title">
      <div className="hm-sticky">
        <div className="hm-chain-bar" aria-hidden="true"><i /></div>
        <div ref={track} className="hm-track">
          <div className="hm-chain-intro">
            <h2 id="hm-chain-title" className="hm-part-title">The whole chain</h2>
          </div>
          {CHAIN.map((c) => (
            <article key={c.title} className="hm-link">
              <Fig name={c.icon} className="hm-link-fig" />
              <h3>{c.title}</h3>
            </article>
          ))}
          <article className="hm-link hm-link-final">
            <p>A single, field-deployable intervention that keeps working even after the trap is gone.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- explore the wiki ---------- */

const EXPLORE: { title: string; href: string; icon: string }[] = [
  { title: "Project Description", href: "iisc-bengaluru/description", icon: "icProject" },
  { title: "Human Practices", href: "/human-practices", icon: "icPractices" },
  { title: "Team", href: "/team", icon: "icTeam" },
];

function Explore() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="hm-band hm-band--paper hm-explore" id="explore" aria-labelledby="hm-ex-title">
      <header className="hm-part-head" data-reveal>
        <h2 id="hm-ex-title" className="hm-part-title">Dive deeper</h2>
      </header>
      <div className="hm-cards">
        {EXPLORE.map((c, i) => (
          <a key={c.title} href={c.href} className="hm-card" data-reveal style={{ "--i": i } as CSSProperties}>
            <Fig name={c.icon} className="hm-card-fig" />
            <h3>{c.title}</h3>
            <svg className="hm-card-go" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- page chrome: reading progress ---------- */

function Chrome() {
  const bar = useRef<HTMLDivElement>(null);
  useFrame(() => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    bar.current?.style.setProperty("transform", `scaleX(${clamp01(window.scrollY / max).toFixed(4)})`);
  });
  return <div className="hm-progress" aria-hidden="true"><div ref={bar} /></div>;
}

/* ---------- svg text at a fixed on-screen size ---------- */

/**
 * Drawings scale with their box, which would scale their labels too. For every
 * svg[data-fit], write --k = 1 / (drawing scale) so CSS can render its text at
 * exactly --fs-small, then size the requirement chips around their text.
 */
function fitSvgText(svg: SVGSVGElement) {
  const vb = svg.viewBox.baseVal;
  const w = svg.clientWidth;
  const h = svg.clientHeight;
  if (!vb || !vb.width || !w || !h) return;
  const k = 1 / Math.min(w / vb.width, h / vb.height);
  svg.style.setProperty("--k", k.toFixed(4));
  // the label size in drawing units, as CSS resolved it (--fs-small × k)
  const sample = svg.querySelector("text");
  const fs = sample ? parseFloat(getComputedStyle(sample).fontSize) : 14 * k;
  svg.querySelectorAll<SVGGElement>(".hm-need").forEach((g) => {
    const text = g.querySelector("text");
    const rect = g.querySelector("rect");
    const tick = g.querySelector("path");
    if (!text || !rect || !tick) return;
    const ch = fs * 2.5;
    rect.setAttribute("width", (text.getComputedTextLength() + fs * 3.3).toFixed(1));
    rect.setAttribute("height", ch.toFixed(1));
    rect.setAttribute("rx", (ch / 2).toFixed(1));
    text.setAttribute("x", (fs * 2.3).toFixed(1));
    text.setAttribute("y", (ch / 2).toFixed(1));
    tick.setAttribute("d", `M${fs * 0.8} ${ch / 2} l${fs * 0.32} ${fs * 0.32} l${fs * 0.6} ${-fs * 0.7}`);
  });
  // chips sit in centred rows around the trap: two above it, one each below
  const chips = Array.from(svg.querySelectorAll<SVGGElement>(".hm-need"));
  if (chips.length === 4) {
    const width = (g: SVGGElement) => Number(g.querySelector("rect")?.getAttribute("width") || 0);
    const rows: [number[], number][] = [[[0, 1], 96], [[2], 360], [[3], 360 + fs * 3.2]];
    rows.forEach(([idx, y]) => {
      const gap = fs * 1.2;
      const total = idx.reduce((a, i) => a + width(chips[i]), 0) + gap * (idx.length - 1);
      let x = (vb.width - total) / 2;
      idx.forEach((i) => {
        chips[i].setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        x += width(chips[i]) + gap;
      });
    });
  }
}

function useFitSvgText(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const svgs = Array.from(el.querySelectorAll<SVGSVGElement>("svg[data-fit]"));
    const ro = new ResizeObserver((es) => es.forEach((e) => fitSvgText(e.target as SVGSVGElement)));
    svgs.forEach((s) => ro.observe(s));
    document.fonts?.ready.then(() => svgs.forEach(fitSvgText));
    return () => ro.disconnect();
  }, []);
}

/* ---------- page ---------- */

export function Home() {
  const root = useRef<HTMLDivElement>(null);
  useFitSvgText(root);
  useEffect(() => {
    root.current?.classList.toggle("hm-reduce", reducedMotion());
  }, []);
  return (
    <div ref={root} className="hm-page">
      <Symbols />
      <Hero />
      <main className="hm-main">
        <Challenge />
        <Numbers />
        <LogoSlide />
        <Scrolly
          id="molecule"
          part="Part 1"
          title="The Molecule: Switching It Off"
          tone="mist"
          band="mist"
          steps={MOL_STEPS}
          stage={(s) => <MoleculeStage step={s} />}
        />
        <Scrolly
          id="sugar-trap"
          part="Part 2"
          title="The Sugar Trap: Getting It There"
          tone="paper"
          band="paper"
          steps={TRAP_STEPS}
          stage={(s) => <TrapStage step={s} />}
          onSp={trapSp}
        />
        <Scrolly
          id="bigger-picture"
          part="Part 3"
          title="Beyond One Mosquito: The Bigger Picture"
          tone="mist"
          band="mist"
          steps={SPREAD_STEPS}
          stage={(s) => <SpreadStage step={s} />}
        />
        <Chain />
        <Explore />
      </main>
    </div>
  );
}

export default Home;
