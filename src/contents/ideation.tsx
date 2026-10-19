import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { LowPoly } from "../components/LowPoly";
import dbtlCycle1 from "../assets/ideation/dbtl-cycle-1.png";
import "./ideation.css";

/*
 * Ideation page.
 * Same layout as the Sustainability page: a sticky list of sections on the left and a
 * faceted hero over bands on the right. Content lives in CYCLES below. The animations follow the story:
 * ideas pile up on the board, pour through a funnel
 * (scrubbed by scroll) and leave two finalists.
 */

type Pt = [number, number];

/** Facet colours shared by the header and the navigator, as on Sustainability. */
const HERO_COLORS = ["#0f4a3f", "#1d715f", "#2b7f6d", "#3f8a6a", "#4f8f74"];


const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, t: number) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};

/* ---------- idea icons: white line drawings in a 48 x 48 box ---------- */

const ICONS: Record<string, ReactNode> = {
  onc: (
    <>
      <circle cx="24" cy="24" r="12" />
      <circle cx="21" cy="22" r="4.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="24" y1="9" x2="24" y2="4" transform={`rotate(${a} 24 24)`} />
      ))}
    </>
  ),
  heat: (
    <>
      <circle cx="24" cy="14" r="6" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="24" y1="4.5" x2="24" y2="2" transform={`rotate(${a} 24 14)`} />
      ))}
      <line x1="8" y1="27" x2="40" y2="27" />
      <path d="M24 27 V44 M24 33 L17 39 M24 36 L31 42 M17 39 L14 44" />
    </>
  ),
  lupus: (
    <>
      <path d="M24 16 V36" />
      <path d="M24 20 C16 8 5 11 8 20 C10 26 18 26 24 24" />
      <path d="M24 20 C32 8 43 11 40 20 C38 26 30 26 24 24" />
      <path d="M24 26 C18 28 12 34 16 38 C19 41 23 35 24 30" />
      <path d="M24 26 C30 28 36 34 32 38 C29 41 25 35 24 30" />
    </>
  ),
  drain: (
    <>
      <path d="M5 13 H26 A9 9 0 0 1 35 22 V30" strokeWidth="6" />
      <path d="M35 35 C31 40 31 44 35 44 C39 44 39 40 35 35 Z" />
      <circle cx="15" cy="13" r="1.2" />
    </>
  ),
  worm: (
    <>
      {([[10, 30], [16, 24], [23, 21], [30, 22], [36, 26], [40, 32]] as Pt[]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 4.5 : 4} />
      ))}
      <path d="M41 28 L44 24" />
    </>
  ),
  mosk: (
    <>
      <ellipse cx="25" cy="27" rx="4" ry="11" transform="rotate(-35 25 27)" />
      <circle cx="16" cy="15" r="3" />
      <path d="M14 13 L6 6" />
      <ellipse cx="33" cy="16" rx="9" ry="4" transform="rotate(-30 33 16)" />
      <ellipse cx="34" cy="25" rx="8" ry="3.5" transform="rotate(5 34 25)" />
      <path d="M22 31 L12 40 M25 33 L20 44 M28 33 L34 44" />
    </>
  ),
};

function IdeaIcon({ id }: { id: string }) {
  return <g className="ide-icon">{ICONS[id]}</g>;
}

/* ---------- the ideas, in the order the write-up brings them up ---------- */

interface Idea {
  id: string;
  /** Short label used on chips and the funnel. */
  label: string;
  /** Card heading. */
  name: string;
  color: string;
  text: ReactNode;
  /** Funnel path: where it starts, where it swirls at the rim, where it ends up. */
  start: Pt;
  rim: Pt;
  end: Pt;
  finalist: boolean;
}

const IDEAS: Idea[] = [
  {
    id: "onc", label: "Oncology", name: "Tumour microenvironment", color: "#b75d7a",
    text: <>We had someone exploring an engineered bacterium that could modify the tumor microenvironment in oncology, nudging the immune system's response to cancer from the outside in.</>,
    start: [90, 48], rim: [125, 262], end: [170, 82], finalist: false,
  },
  {
    id: "heat", label: "HeatShield", name: "HeatShield", color: "#d08a2c",
    text: <>We had HeatShield, an idea about using a rhizosphere bacterium to buffer plant roots against the ethylene surge that comes with heat stress.</>,
    start: [250, 48], rim: [270, 325], end: [240, 562], finalist: true,
  },
  {
    id: "lupus", label: "Lupus", name: "Lupus", color: "#8a64a8",
    text: <>We had a direction built around Lupus, thinking through whether a bacterial intervention could help modulate the autoimmune activity behind it.</>,
    start: [410, 48], rim: [215, 257], end: [270, 82], finalist: false,
  },
  {
    id: "drain", label: "Drain fats", name: "Drain-clearing bacteria", color: "#4f87a3",
    text: <>Someone brought forward the idea of a bacterium engineered to digest fatty acids sitting in drains, tackling clogged pipes at a microbial level.</>,
    start: [570, 48], rim: [425, 257], end: [370, 82], finalist: false,
  },
  {
    id: "worm", label: "Mealworm", name: "Mealworm plastic digester", color: "#9a7a45",
    text: <>Another idea involved engineering a bacterium and placing it inside a mealworm's gut, turning the insect into a living plastic-digestion system.</>,
    start: [170, 130], rim: [515, 262], end: [470, 82], finalist: false,
  },
  {
    id: "mosk", label: "MOSKATEER", name: "MOSKATEER", color: "#1d715f",
    text: <>And, of course, there was MOSKATEER, still at that point just one idea among many, not yet the project it would become at later stages.</>,
    start: [470, 130], rim: [370, 325], end: [400, 562], finalist: true,
  },
];

const NECK: Pt = [320, 444];

/* ---------- section 3: the funnel, scrubbed by scroll ---------- */

function Funnel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(SVGGElement | null)[]>([]);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const discRefs = useRef<(SVGCircleElement | null)[]>([]);
  const asideRef = useRef<SVGTextElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current, stage = stageRef.current;
    if (!track || !stage) return;
    let frame = 0;
    let last = -1;
    const dropped = IDEAS.filter((d) => !d.finalist);

    const render = (p: number) => {
      // keep labels readable when the drawing is shrunk on a phone
      const k = (stage.querySelector("svg")?.clientWidth || 640) / 640;
      const small = k < 0.6;
      let gone = 0;
      let asideOn = 0;
      IDEAS.forEach((idea, i) => {
        const a = ease(seg(p, 0.04 + i * 0.03, 0.34 + i * 0.03));
        let [x, y] = lerp(idea.start, idea.rim, a);
        let s = 1 - 0.2 * a;
        let grey = 0;
        let fade = 1;
        // labels hide while the chips crowd the rim, and come back where each one lands
        let show = 1 - a;
        if (!idea.finalist) {
          const j = dropped.indexOf(idea);
          const b = ease(seg(p, 0.44 + j * 0.05, 0.62 + j * 0.05));
          [x, y] = lerp([x, y], idea.end, b);
          y -= Math.sin(Math.PI * b) * 50;
          s -= 0.25 * b;
          grey = b;
          fade = 1 - 0.45 * b;
          if (b > 0.5) gone++;
          asideOn = Math.max(asideOn, b);
          show = Math.max(show, small ? 0 : b);
        } else {
          const n0 = idea.id === "heat" ? 0.54 : 0.7;
          const c = ease(seg(p, n0, n0 + 0.12));
          const d = ease(seg(p, n0 + 0.12, n0 + 0.24));
          [x, y] = d > 0 ? lerp(NECK, idea.end, d) : lerp([x, y], NECK, c);
          s = d > 0 ? 0.8 + 0.25 * d : s - 0.1 * c;
          show = Math.max(show, d);
        }
        chipRefs.current[i]?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`);
        chipRefs.current[i]?.setAttribute("opacity", fade.toFixed(2));
        discRefs.current[i]?.setAttribute("fill", grey ? mixHex(idea.color, "#9db0a8", grey) : idea.color);
        const lab = labelRefs.current[i];
        if (lab) {
          lab.setAttribute("x", x.toFixed(1));
          lab.setAttribute("y", (y + 34 * s + 19).toFixed(1));
          lab.style.fontSize = `${Math.max(13 + 4 * s, 11 / k).toFixed(1)}px`;
          lab.setAttribute("opacity", (fade * show).toFixed(2));
        }
      });
      asideRef.current?.setAttribute("opacity", asideOn.toFixed(2));
      const alive = IDEAS.length - gone;
      if (alive !== last) {
        last = alive;
        if (countRef.current) countRef.current.textContent = String(alive);
        if (wordRef.current) wordRef.current.textContent = alive === 2 ? "shortlisted" : "candidate projects";
      }
    };

    if (reducedMotion()) {
      render(1);
      return;
    }
    const update = () => {
      frame = 0;
      // the stage sticks inside a taller track; progress is how far the track has scrolled past it
      const t = track.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      render(clamp01((top - t.top) / Math.max(1, t.height - stage.offsetHeight)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ide-funnel-track" ref={trackRef}>
    <div className="ide-funnel" ref={stageRef}>
      <svg viewBox="0 0 640 636" role="img"
        aria-label="Six ideas pour into a funnel. Oncology, Lupus, Drain fats and Mealworm are not pursued; HeatShield and MOSKATEER come out the bottom.">
        <text ref={asideRef} className="ide-aside" x="320" y="34" opacity="0">not pursued</text>
        <path className="ide-funnel-body" d="M40 234 L272 434 V482 H368 V434 L600 234 Z" />
        <ellipse className="ide-funnel-rim" cx="320" cy="234" rx="280" ry="24" />
        <path className="ide-funnel-neck" d="M272 434 V482 M368 434 V482" />
        {IDEAS.map((idea, i) => (
          <g key={idea.id} ref={(el) => { chipRefs.current[i] = el; }}
            transform={`translate(${idea.start[0]} ${idea.start[1]})`}>
            <g className="ide-bob" style={{ "--d": `${i * -0.7}s` } as CSSProperties}>
              <circle ref={(el) => { discRefs.current[i] = el; }} r="34" fill={idea.color} className="ide-chip" />
              <g transform="translate(-24 -24)"><IdeaIcon id={idea.id} /></g>
            </g>
          </g>
        ))}
        {IDEAS.map((idea, i) => (
          <text key={idea.id} ref={(el) => { labelRefs.current[i] = el; }}
            className={`ide-chip-label${idea.finalist ? " is-final" : ""}`} x={idea.start[0]} y={idea.start[1] + 53}>
            {idea.label}
          </text>
        ))}
      </svg>
      <p className="ide-tally" aria-live="polite">
        <b ref={countRef}>6</b> <span ref={wordRef}>candidate projects</span>
      </p>
    </div>
    </div>
  );
}

/* ---------- page content: cycles, each holding its sections ---------- */
/*
 * To add a cycle, append another entry to CYCLES. Each section becomes one band
 * on the page and one link in the navigator, so nothing else needs to change.
 */

type Band = "mist" | "dark" | "paper" | "teal";

interface Section {
  id: string;
  title: string;
  /** Short time marker shown above the title. */
  kicker?: string;
  band: Band;
  /** Running text, shown beside `figure` on wide screens. */
  text?: ReactNode;
  figure?: ReactNode;
  /** Full-width content under the text and figure. */
  after?: ReactNode;
  /** "funnel" keeps the text and the funnel pinned while the funnel plays. */
  layout?: "split" | "funnel";
}

interface Cycle {
  id: string;
  title: string;
  lead?: string;
  /** Background used while the cycle has no sections yet. */
  band?: Band;
  sections: Section[];
}

const CYCLES: Cycle[] = [
  {
    id: "dbtl-1",
    title: "DBTL Cycle 1",
    lead: "The Ideation Cycle: How We Got to MOSKATEER",
    sections: [
      {
        id: "begin", title: "Where it began", band: "mist",
        text: <p>Our ideation officially began in November, when the previous iGEM cycle had ended. Every week, our team would grow a little, as new members kept joining, and each person would present, they'd spent the last week researching about.This provided a forum for discussion among ourselves before we present it to our mentors and PI. We based our discussions on the principles -</p>,
        after: <PullQuote>“No idea was too small to bring to the table at this stage”</PullQuote>,
      },
      {
        id: "ideas", title: "A room full of ideas", band: "dark",
        after: <IdeaBoard />,
      },
      {
        id: "narrow", title: "Boiling it down", band: "paper", layout: "funnel",
        text: <p>By the end of January, after two months of that same fortnightly grind, we'd boiled a room full of ideas down to two: HeatShield and MOSKATEER. Some ideas fell away because the literature simply wasn't there yet to support the mechanism we were proposing or the data supporting them were scarce. Others fell away as, however scientifically sound they were, we couldn't picture a realistic path to implementing them at the scale or timeline our project demanded.</p>,
        figure: <Funnel />,
      },
      {
        id: "finalists", title: "Consulting mentors", band: "teal",
        text: <p>Once we were down to HeatShield and MOSKATEER, we spent the following weeks talking to mentors across a wide range of disciplines, and we were genuinely fortunate in this: IISc is a research institution diverse enough that there's almost always someone, somewhere on campus, working in exactly the niche your idea touches.</p>,
        // Closes DBTL Cycle 1: full width of the text column, centred.
        after: <img className="ide-figure-full" src={dbtlCycle1} alt="The MOSKATEER design-build-test-learn cycle" />,
      },
    ],
  },
  // Content for cycles 2 and 3 is still to come; each shows its heading until sections are added.
  { id: "dbtl-2", title: "DBTL Cycle 2", band: "paper", sections: [] },
  { id: "dbtl-3", title: "DBTL Cycle 3", band: "dark", sections: [] },
];

/** Anchors the navigator tracks, in page order: each section, or the cycle itself while it is empty. */
const ANCHORS = CYCLES.flatMap((c) => (c.sections.length ? c.sections.map((s) => s.id) : [c.id]));
/** Section numbers shown on the phone rail. */
const SECTION_NO = new Map(CYCLES.flatMap((c) => c.sections).map((s, i) => [s.id, i + 1]));

/* ---------- small building blocks used in the content ---------- */

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="ide-quote" data-reveal>
      <svg className="ide-quote-bulb" viewBox="0 0 64 64" aria-hidden="true">
        <g className="ide-rays">
          {[-60, -30, 0, 30, 60].map((a) => <line key={a} x1="32" y1="8" x2="32" y2="2" transform={`rotate(${a} 32 30)`} />)}
        </g>
        <path d="M24 44 A16 16 0 1 1 40 44 L39 50 H25 Z" />
        <path d="M26 55 H38 M28 60 H36" />
      </svg>
      <p>{children}</p>
    </blockquote>
  );
}

function IdeaBoard() {
  return (
    <div className="ide-board">
      {IDEAS.map((idea, i) => (
        <article key={idea.id} className={`ide-card${idea.finalist ? " is-final" : ""}`} data-reveal
          style={{ "--c": idea.color, "--i": i, "--tilt": `${[-2.2, 1.6, -1.2, 2, -1.8, 1.2][i % 6]}deg` } as CSSProperties}>
          <span className="ide-pin" aria-hidden="true" />
          <svg className="ide-card-icon" viewBox="0 0 48 48" aria-hidden="true"><IdeaIcon id={idea.id} /></svg>
          <h4>{idea.name}</h4>
          <p>{idea.text}</p>
        </article>
      ))}
    </div>
  );
}

/** A cycle whose sections have not been written yet: just its heading on a band. */
function EmptyCycle({ cycle, z }: { cycle: Cycle; z: number }) {
  return (
    <section id={cycle.id} className={`ide-band ide-band--${cycle.band ?? "mist"} ide-band--cycle-only${z === 0 ? " ide-band--first" : ""}`}
      style={{ zIndex: z + 1 }}>
      <div className="ide-inner">
        <header className="ide-cycle-head" data-reveal>
          <h2>{cycle.title}</h2>
          {cycle.lead && <p className="ide-cycle-lead">{cycle.lead}</p>}
        </header>
      </div>
    </section>
  );
}

function SectionBand({ sec, z, cycle }: { sec: Section; z: number; cycle?: Cycle }) {
  const head = (
    <div className={sec.layout === "funnel" ? "ide-funnel-text" : undefined} data-reveal>
      {sec.kicker && <p className="ide-kicker">{sec.kicker}</p>}
      <h3>{sec.title}</h3>
      {sec.text}
    </div>
  );
  const split = sec.figure ? `ide-inner ide-split${sec.layout === "funnel" ? " ide-split--funnel" : ""}` : "ide-inner";
  return (
    <section id={sec.id} className={`ide-band ide-band--${sec.band}${z === 0 ? " ide-band--first" : ""}`}
      style={{ zIndex: z + 1 }}>
      {cycle && (
        <div className="ide-inner">
          <header className="ide-cycle-head" id={cycle.id} data-reveal>
            <h2>{cycle.title}</h2>
            {cycle.lead && <p className="ide-cycle-lead">{cycle.lead}</p>}
          </header>
        </div>
      )}
      <div className={split}>
        {head}
        {sec.figure}
      </div>
      {sec.after && <div className="ide-inner">{sec.after}</div>}
    </section>
  );
}

export function Ideation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  // Hide below-the-fold content before first paint so it can animate in.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (root && !reducedMotion() && "IntersectionObserver" in window) root.classList.add("ide-motion");
  }, []);

  // Reveal on scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!root.classList.contains("ide-motion")) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Navigator: highlight the section being read and fill the bar with overall progress.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const atEnd = window.scrollY >= max - 4;
      let idx = 0;
      ANCHORS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      if (atEnd) idx = ANCHORS.length - 1;
      bar.style.transform = `scaleY(${max > 0 ? clamp01(window.scrollY / max) : 0})`;
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const activeId = ANCHORS[active];
  let z = 0;

  return (
    <div className="ide-page" ref={rootRef}>
      <header className="ide-hero">
        <LowPoly className="ide-hero-canvas" colors={HERO_COLORS} cell={120} drift={6} glow seed={5} />
        <div className="ide-hero-text">
          <h1 className="ide-title">Ideation Cycles</h1>
        </div>
        <svg className="ide-wave" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C240 70 420 110 560 190 C690 262 820 268 960 244 C1110 218 1250 190 1440 238 V260 H0 Z" />
        </svg>
      </header>

      <div className="ide-body">
        <aside className="ide-side" aria-label="Sections on this page">
          <LowPoly className="ide-side-canvas" colors={HERO_COLORS} cell={110} drift={5} seed={13} />
          <nav className="ide-toc">
            <div className="ide-toc-list">
              {CYCLES.map((c, ci) => {
                const on = activeId === c.id || c.sections.some((x) => x.id === activeId);
                const target = c.sections[0]?.id ?? c.id;
                return (
                  <div key={c.id} className="ide-toc-group">
                    <a href={`#${target}`} onClick={go(target)}
                      className={`ide-toc-cycle${on ? " is-on" : ""}`}
                      aria-current={activeId === c.id ? "true" : undefined}>
                      <span>{c.title}</span><b aria-hidden="true">C{ci + 1}</b>
                    </a>
                    {c.sections.length > 0 && <ol>
                      {c.sections.map((st) => (
                        <li key={st.id}>
                          <a href={`#${st.id}`} onClick={go(st.id)} className={st.id === activeId ? "is-on" : undefined}
                            aria-current={st.id === activeId ? "true" : undefined}>
                            <b aria-hidden="true">{SECTION_NO.get(st.id)}</b><span>{st.title}</span>
                          </a>
                        </li>
                      ))}
                    </ol>}
                  </div>
                );
              })}
            </div>
            <div className="ide-toc-bar" aria-hidden="true"><span ref={barRef} /></div>
          </nav>
        </aside>

        <main className="ide-main">
          {CYCLES.map((c) => c.sections.length
            ? c.sections.map((sec, k) => (
              <SectionBand key={sec.id} sec={sec} z={z++} cycle={k === 0 ? c : undefined} />
            ))
            : <EmptyCycle key={c.id} cycle={c} z={z++} />)}
        </main>
      </div>
    </div>
  );
}
