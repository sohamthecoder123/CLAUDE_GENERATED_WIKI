import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { LowPoly } from "../components/LowPoly";
import { TitleArt } from "../components/TitleArt";
import "./sustainability.css";

/*
 * Sustainability page.
 * Left: a sticky sidebar whose path between goal waypoints fills in
 * step with the reader's scroll. Right: a faceted hero and alternating bands,
 * one per Sustainable Development Goal.
 */

interface Goal {
  id: string;
  num: number;
  /** Official UN SDG colour. */
  color: string;
  /** Lighter tint of the goal colour, used on the dark bands. */
  light: string;
  title: string;
  paras: ReactNode[];
  band: "dark" | "paper" | "teal" | "mist";
}

const GOALS: Goal[] = [
  {
    id: "sdg-3", num: 3, color: "#4C9F38", light: "#8fd474", band: "dark",
    title: "Good Health and Well-Being",
    paras: [
      <>SDG 3 commits to ensuring healthy lives and promoting well-being for all at all ages, with Target 3.3 specifically calling to end the epidemics of AIDS, tuberculosis, malaria, and neglected tropical diseases by 2030. Malaria alone accounts for hundreds of thousands of deaths annually and remains endemic across large parts of India and Sub-Saharan Africa.</>,
      <>MOSKATEER addresses this target directly at its source: rather than treating malaria after transmission, which is done by most of the existing and prevalent vector control strategies, the project engineers <i>Asaia bogorensis</i> to silence the <i>mosGILT</i> gene via RNAi, reducing fertility and suppressing the vector population responsible for transmitting the parasite. By pairing this with a sugar-trap delivery system, the project also works toward a scalable, field-deployable tool that could be integrated into existing vector-control programs, supporting the broader push toward malaria elimination.</>,
    ],
  },
  {
    id: "sdg-9", num: 9, color: "#FD6925", light: "#FD6925", band: "paper",
    title: "Industry, Innovation, and Infrastructure",
    paras: [
      <>SDG 9 calls for fostering innovation and building resilient, sustainable infrastructure, including scientific research capacity. MOSKATEER at its very core applies synthetic biology and paratransgenesis, engineers both horizontal and vertical transmission of an RNAi effect through a bacterial chassis in a way that has not been established in existing gene-drive literature.</>,
      <>Beyond the immediate application to malaria, the underlying delivery platform (the MS2-based RNA-binding and membrane-translocation fusion protein) is a generalizable tool that could inform future paratransgenic strategies for other vector-borne diseases, contributing to the broader research infrastructure available to the field.</>,
    ],
  },
  {
    id: "sdg-15", num: 15, color: "#56C02B", light: "#9be07a", band: "teal",
    title: "Life on Land",
    paras: [
      <>SDG 15 focuses on protecting, restoring, and promoting the sustainable use of terrestrial ecosystems, including halting biodiversity loss. Among the many other methods aimed at curbing the death toll due to malaria, conventional malaria vector control relies heavily on chemical insecticides, which are broad-spectrum by nature and cause harm to non-target insect populations, soil organisms, and the food chains.</>,
      <>MOSKATEER's paratransgenesis approach is species-targeted by design. The RNAi cargo is engineered against a mosquito-specific gene, and the delivery vehicle is a bacterium that already associates naturally with <i>Anopheles</i>. This limits off-target ecological impact relative to chemical larvicides and adulticides, offering a vector-control strategy that is more compatible with biodiversity conservation goals.</>,
    ],
  },
  {
    id: "sdg-17", num: 17, color: "#19486A", light: "#19486A", band: "mist",
    title: "Partnerships for the Goals",
    paras: [
      <>SDG 17 emphasizes strengthening the means of implementation through multi-stakeholder partnerships. MOSKATEER's Human Practices work puts this into practice by directly engaging the people the project is ultimately meant to serve: through structured questionnaires with medical professionals and clinicians and with the broader community.</>,
      <>The team gathers input on both project-specific design choices and broader perspectives on malaria outbreaks. This engagement is used to ground the project's technical direction in clinical and public-health realities.</>,
    ],
  },
];

const ALL_SDGS: [number, string, string][] = [
  [1, "No Poverty", "#E5243B"], [2, "Zero Hunger", "#DDA63A"], [3, "Good Health and Well-Being", "#4C9F38"],
  [4, "Quality Education", "#C5192D"], [5, "Gender Equality", "#FF3A21"], [6, "Clean Water and Sanitation", "#26BDE2"],
  [7, "Affordable and Clean Energy", "#FCC30B"], [8, "Decent Work and Economic Growth", "#A21942"],
  [9, "Industry, Innovation and Infrastructure", "#FD6925"], [10, "Reduced Inequalities", "#DD1367"],
  [11, "Sustainable Cities and Communities", "#FD9D24"], [12, "Responsible Consumption and Production", "#BF8B2E"],
  [13, "Climate Action", "#3F7E44"], [14, "Life Below Water", "#0A97D9"], [15, "Life on Land", "#56C02B"],
  [16, "Peace, Justice and Strong Institutions", "#00689D"], [17, "Partnerships for the Goals", "#19486A"],
];
const RELEVANT = new Set(GOALS.map((g) => g.num));

/** Waypoints shown in the sidebar, in page order (the sidebar starts at the SDG overview). */
const STOPS = GOALS.map((g) => ({ id: g.id, label: g.title, num: g.num, color: g.color }));

/** Facet colours shared by the header and the sidebar so the two read as one surface. */
const HERO_COLORS = ["#0f4a3f", "#1d715f", "#2b7f6d", "#3f8a6a", "#4f8f74"];

const SVG_NS = "http://www.w3.org/2000/svg";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts from 0 up to `to` the first time the element scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 900);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      setN(0);
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

export function Sustainability() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const guideRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(-1);

  // Hide below-the-fold content before first paint so it can animate in.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (root && !reducedMotion() && "IntersectionObserver" in window) root.classList.add("sus-motion");
  }, []);

  // Reveal on scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!root.classList.contains("sus-motion")) {
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

  // Sidebar path: build it from the waypoint positions, then fill it in
  // step with the reader's position in the page.
  useEffect(() => {
    const flight = flightRef.current, svg = svgRef.current, guide = guideRef.current,
      trail = trailRef.current;
    if (!flight || !svg || !guide || !trail) return;

    let stopLens: number[] = [];
    let total = 0;
    let lastActive = -2;
    let frame = 0;

    const layout = () => {
      const fb = flight.getBoundingClientRect();
      const gems = Array.from(flight.querySelectorAll<HTMLElement>(".sus-gem"));
      const pts = gems.map((g) => {
        const b = g.getBoundingClientRect();
        return [b.left - fb.left + b.width / 2, b.top - fb.top + b.height / 2];
      });
      if (!pts.length) return;
      const x0 = pts[0][0];
      const amp = Math.min(26, fb.width * 0.3);
      const all = [[x0, 12], ...pts, [x0, fb.height]];
      let d = `M${x0} 12`;
      const probe = document.createElementNS(SVG_NS, "path");
      stopLens = [];
      for (let i = 1; i < all.length; i++) {
        const [ax, ay] = all[i - 1], [bx, by] = all[i], dy = by - ay, s = i % 2 ? 1 : -1;
        d += ` C${ax + s * amp} ${ay + dy * 0.3} ${bx - s * amp} ${ay + dy * 0.7} ${bx} ${by}`;
        probe.setAttribute("d", d);
        if (i < all.length - 1) stopLens.push(probe.getTotalLength());
      }
      svg.setAttribute("viewBox", `0 0 ${fb.width} ${fb.height}`);
      guide.setAttribute("d", d);
      trail.setAttribute("d", d);
      total = trail.getTotalLength();
      trail.style.strokeDasharray = `${total}`;
      update();
    };

    const update = () => {
      frame = 0;
      const sections = STOPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
      if (!sections.length || !stopLens.length) return;
      const line = window.innerHeight * 0.35;
      const tops = sections.map((s) => s.getBoundingClientRect().top);
      let idx = -1;
      tops.forEach((t, i) => { if (t <= line) idx = i; });
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      // how far the path is filled: between the previous waypoint and the next one
      let L: number;
      if (idx < 0) {
        // reading the SDG overview: fill from the top of the path to the first waypoint
        const intro = document.getElementById("sdgs");
        const ib = intro?.getBoundingClientRect();
        const f = ib ? Math.min(1, Math.max(0, (line - ib.top) / Math.max(1, tops[0] - ib.top))) : 0;
        L = stopLens[0] * f;
      } else {
        const sec = sections[idx];
        const f = Math.min(1, Math.max(0, (line - tops[idx]) / sec.offsetHeight));
        const from = stopLens[idx];
        const to = idx + 1 < stopLens.length ? stopLens[idx + 1] : total;
        L = from + (to - from) * (atEnd ? 1 : f);
      }
      trail.style.strokeDashoffset = `${total - L}`;


      const a = atEnd ? sections.length - 1 : idx;
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(layout);
    ro.observe(flight);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout);
    layout();
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="sus-page" ref={rootRef}>
      <header className="sus-hero">
        <LowPoly className="sus-hero-canvas" colors={HERO_COLORS} cell={120} drift={6} glow />
        <div className="sus-hero-text title-art-row title-art-row--right">
          <h1 className="sus-title">Sustainability</h1>
          <TitleArt name="earth" />
        </div>
        <svg className="sus-wave" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C240 70 420 110 560 190 C690 262 820 268 960 244 C1110 218 1250 190 1440 238 V260 H0 Z" />
        </svg>
      </header>

      <div className="sus-body">
        <aside className="sus-side" aria-label="Goals on this page">
          <LowPoly className="sus-side-canvas" colors={HERO_COLORS} cell={110} drift={5} seed={11} />

          <div className="sus-flight" ref={flightRef}>
            <svg className="sus-flight-svg" ref={svgRef} aria-hidden="true">
              <path className="sus-guide" ref={guideRef} />
              <path className="sus-trail" ref={trailRef} />
            </svg>
            <ol className="sus-stops">
              {STOPS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={go(s.id)}
                    className={i === active ? "is-on" : i < active ? "is-past" : undefined}
                    aria-current={i === active ? "true" : undefined}
                    style={{ "--c": s.color } as CSSProperties}>
                    <span className="sus-gem"><b>{s.num}</b></span>
                    <span className="sus-stop-text">{s.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <main className="sus-main">
          <section id="sdgs" className="sus-band sus-band--mist sus-band--first">
            <div className="sus-inner">
              <div data-reveal>
                <h2>The UN Sustainable Development Goals</h2>
                <p>In 2015, the UNGA adopted the 2030 Agenda for Sustainable Development, built around 17 Sustainable Development Goals (SDGs). These goals form a shared global blueprint for ending poverty, protecting the planet, and ensuring peace and prosperity for all people by 2030, spanning economic, social, and environmental dimensions of development. As a synthetic biology project addressing a disease of major global public health significance, MOSKATEER is directly and indirectly relevant to several of these goals.</p>
              </div>
              <div className="sus-wall" data-reveal role="list"
                aria-label="The 17 Sustainable Development Goals, with goals 3, 9, 15 and 17 highlighted">
                {ALL_SDGS.map(([n, t, c]) => (
                  <div key={n} role="listitem" className={RELEVANT.has(n) ? "is-hi" : undefined}
                    style={{ "--c": c, "--i": n } as CSSProperties}>
                    <b>{n}</b><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {GOALS.map((g, k) => (
            <section key={g.id} id={g.id} className={`sus-band sus-band--${g.band}`}
              style={{ "--c": g.color, "--cl": g.light, zIndex: k + 2 } as CSSProperties}>
              <div className="sus-inner">
                <div className="sus-goal-head" data-reveal>
                  <p className="sus-big" aria-hidden="true"><CountUp to={g.num} /></p>
                  <h2><span className="sus-visually-hidden">SDG {g.num}: </span>{g.title}</h2>
                </div>
                <div className="sus-goal-body" data-reveal>
                  {g.paras.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
