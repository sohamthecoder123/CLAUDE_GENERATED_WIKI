import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { TitleArt, type TitleArtName } from "./TitleArt";
import { LowPoly } from "./LowPoly";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import "./wiki-page.css";

/*
 * The shared page shell.
 *
 * This is the Ideation page's layout, which Aadya set as the one layout for the
 * whole wiki. The spec lives at wiki/ideation-page/LAYOUT-SPEC.md and the code
 * it points at is the source of truth; everything here — hero, navigator,
 * bands, tokens, type scale, reveal behaviour — is that layout, with the class
 * prefix `wk-` instead of `ide-`.
 *
 * The Ideation page itself, like Home, Education and Sustainability, still
 * carries its own copy, because each has choreography of its own. Every other
 * page renders through here, so the layout cannot drift between them: a change
 * to the spec is a change to this file and wiki-page.css, once.
 *
 * A page file is then nothing but its content: see src/contents/description.tsx.
 */

export type Band = "mist" | "paper" | "dark" | "teal";

export interface WikiSection {
  /** Anchor id. Also the fragment the navigator links to. */
  id: string;
  /** Heading printed at the top of the band. */
  title: string;
  /** Shorter label for the navigator, when the heading is long. */
  nav?: string;
  /** Background for the band. Alternate these down the page. */
  band: Band;
  /** Small line above the heading. */
  kicker?: string;
  /** One line under the heading, a size up from the body copy. */
  lead?: ReactNode;
  /** The section's prose. Direct children fade up one after another. */
  body?: ReactNode;
  /** Sits beside the prose on wide screens, under it on narrow ones. */
  figure?: ReactNode;
  /** Full-width block under both columns: a table, a strip of cards, a figure. */
  after?: ReactNode;
  /**
   * Sub-heading this section sits under, like "DBTL Cycle 1" on Ideation. The
   * first section of a run carrying the same group prints the group header and
   * the navigator nests the rest beneath it.
   */
  group?: string;
  /** The rust line under a group heading. Only read on the first of a group. */
  groupLead?: ReactNode;
}

export interface WikiPageProps {
  /** Page root class suffix, e.g. "description" gives .wk-page.is-description. */
  slug: string;
  /** Small line above the first section: which part of the wiki this is. */
  kicker?: string;
  title: string;
  /** One or two sentences introducing the page, printed above the first section. */
  standfirst?: ReactNode;
  /** Optional extra block under the standfirst. */
  heroExtra?: ReactNode;
  /** Facet ramp for the hero and the navigator. Defaults to the wiki greens. */
  heroColors?: string[];
  /** Accessible name for the navigator. Never "table of contents". */
  navTitle?: string;
  /** Drop the navigator and centre everything: for pages that are one run of content. */
  sideless?: boolean;
  /** A small animated picture beside the hero title, at the left (see TitleArt). */
  titleArt?: TitleArtName;
  sections: WikiSection[];
  /** Anything after the last band and before the site footer. */
  children?: ReactNode;
}

const DEFAULT_HERO = ["#0f4a3f", "#1d715f", "#2b7f6d", "#3f8a6a", "#4f8f74"];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** The navigator's rows: either groups of sections, or one unlabelled run. */
function groupSections(sections: WikiSection[]) {
  const rows: { group?: string; items: WikiSection[] }[] = [];
  sections.forEach((s) => {
    const last = rows[rows.length - 1];
    if (last && last.group === s.group) last.items.push(s);
    else rows.push({ group: s.group, items: [s] });
  });
  return rows;
}

export function WikiPage({
  slug,
  kicker,
  title,
  standfirst,
  heroExtra,
  heroColors = DEFAULT_HERO,
  navTitle = "Sections",
  sideless = false,
  titleArt,
  sections,
  children,
}: WikiPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  const rows = groupSections(sections);
  const anchors = sections.map((s) => s.id);

  // Hide below-the-fold content before first paint so it can animate in.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (root && !prefersReducedMotion() && "IntersectionObserver" in window) {
      root.classList.add("wk-motion");
    }
  }, []);

  // Reveal on scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!root.classList.contains("wk-motion")) {
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
  }, [sections]);

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
      anchors.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      if (atEnd) idx = anchors.length - 1;
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
  }, [anchors.join("|")]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const activeId = anchors[active];
  const numberOf = new Map(sections.map((s, i) => [s.id, i + 1]));

  return (
    <div className={`wk-page is-${slug}${sideless ? " is-sideless" : ""}`} ref={rootRef}>
      {/* ------------------------------- hero ------------------------------- */}
      <header className="wk-hero">
        <LowPoly className="wk-hero-canvas" colors={heroColors} cell={120} drift={6} glow seed={5} />
        <div className={`wk-hero-text${titleArt ? " title-art-row title-art-row--left" : ""}`}>
          {titleArt && <TitleArt name={titleArt} />}
          <h1 className="wk-title">{title}</h1>
        </div>
        <svg className="wk-wave" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C240 70 420 110 560 190 C690 262 820 268 960 244 C1110 218 1250 190 1440 238 V260 H0 Z" />
        </svg>
      </header>

      {/* --------------------- navigator + bands --------------------- */}
      <div className="wk-body">
        {!sideless && (
        <aside className="wk-side" aria-label={navTitle}>
          <LowPoly className="wk-side-canvas" colors={heroColors} cell={110} drift={5} seed={13} />
          <nav className="wk-toc">
            <div className="wk-toc-list">
              {rows.map((row, ri) => {
                const on = row.items.some((x) => x.id === activeId);
                return (
                  <div key={row.group ?? `row-${ri}`} className="wk-toc-group">
                    {row.group && (
                      <a
                        href={`#${row.items[0].id}`}
                        onClick={go(row.items[0].id)}
                        className={`wk-toc-head${on ? " is-on" : ""}`}
                      >
                        <span>{row.group}</span><b aria-hidden="true">{ri + 1}</b>
                      </a>
                    )}
                    <ol>
                      {row.items.map((s) => (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={go(s.id)}
                            className={s.id === activeId ? "is-on" : undefined}
                            aria-current={s.id === activeId ? "true" : undefined}
                          >
                            <b aria-hidden="true">{numberOf.get(s.id)}</b>
                            <span>{s.nav ?? s.title}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
            <div className="wk-toc-bar" aria-hidden="true"><span ref={barRef} /></div>
          </nav>
        </aside>
        )}

        <main className="wk-main">
          {sections.map((s, i) => {
            const startsGroup = !!s.group && (i === 0 || sections[i - 1].group !== s.group);
            const first = i === 0;
            return (
              <section
                key={s.id}
                id={s.id}
                className={`wk-band wk-band--${s.band}${first ? " wk-band--first" : ""}`}
                style={{ zIndex: i + 1 }}
              >
                {first && (standfirst || kicker) && (
                  <div className="wk-inner">
                    <header className="wk-page-head" data-reveal>
                      {kicker && <p className="wk-kicker">{kicker}</p>}
                      {standfirst && <p className="wk-standfirst">{standfirst}</p>}
                      {heroExtra}
                    </header>
                  </div>
                )}

                {startsGroup && (
                  <div className="wk-inner">
                    <header className="wk-group-head" data-reveal>
                      <h2>{s.group}</h2>
                      {s.groupLead && <p className="wk-group-lead">{s.groupLead}</p>}
                    </header>
                  </div>
                )}

                <div className={`wk-inner${s.figure ? " wk-split" : ""}`}>
                  <div data-reveal>
                    {s.kicker && <p className="wk-kicker">{s.kicker}</p>}
                    {s.title && <h3>{s.title}</h3>}
                    {s.lead && <p className="wk-lead">{s.lead}</p>}
                    {s.body}
                  </div>
                  {s.figure}
                </div>

                {s.after && <div className="wk-inner wk-after">{s.after}</div>}
              </section>
            );
          })}
          {children}
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Small content pieces that several pages want. Keeping them here means the
 * pages stay content-only and the look cannot drift between them.
 * ------------------------------------------------------------------------- */

/** A paragraph that fades up when it arrives. Use for all body copy. */
export function P({ children }: { children: ReactNode }) {
  return <p data-reveal>{children}</p>;
}

/** A sub-heading inside a band. */
export function H3({ children }: { children: ReactNode }) {
  return <h4 className="wk-h4" data-reveal>{children}</h4>;
}

/** A bulleted list whose items come in one by one. */
export function List({ items, ordered = false }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="wk-list">
      {items.map((it, i) => (
        <li key={i} data-reveal>{it}</li>
      ))}
    </Tag>
  );
}

/** A pulled-out statement, in the page's cream quote block with its bulb. */
export function Pull({ children, by }: { children: ReactNode; by?: string }) {
  return (
    <blockquote className="wk-quote" data-reveal>
      <svg className="wk-quote-bulb" viewBox="0 0 64 64" aria-hidden="true">
        <g className="wk-rays">
          {[-60, -30, 0, 30, 60].map((a) => (
            <line key={a} x1="32" y1="8" x2="32" y2="2" transform={`rotate(${a} 32 30)`} />
          ))}
        </g>
        <path d="M24 44 A16 16 0 1 1 40 44 L39 50 H25 Z" />
        <path d="M26 55 H38 M28 60 H36" />
      </svg>
      <div>
        <p>{children}</p>
        {by && <cite>{by}</cite>}
      </div>
    </blockquote>
  );
}

/** A labelled aside: a caveat, a note on method, a thing still open. */
export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="wk-note" data-reveal>
      <p className="wk-note-label">{label}</p>
      <div className="wk-note-body">{children}</div>
    </aside>
  );
}

/** A board of pinned cards, as on the Ideation page. */
export function Cards({
  items,
  columns = 3,
}: {
  items: { title: ReactNode; body: ReactNode; meta?: ReactNode }[];
  columns?: 2 | 3 | 4;
}) {
  const tilts = [-2.2, 1.6, -1.2, 2, -1.8, 1.2];
  const colours = ["#1d715f", "#8b4a36", "#0f4a3f", "#d08a2c", "#2b7f6d", "#4f8f74"];
  return (
    <div className={`wk-board cols-${columns}`}>
      {items.map((c, i) => (
        <article
          className="wk-card"
          key={i}
          data-reveal
          style={{
            "--c": colours[i % colours.length],
            "--i": i,
            "--tilt": `${tilts[i % tilts.length]}deg`,
          } as React.CSSProperties}
        >
          <span className="wk-pin" aria-hidden="true" />
          {c.meta && <p className="wk-card-meta">{c.meta}</p>}
          <h4>{c.title}</h4>
          <div className="wk-card-body">{c.body}</div>
        </article>
      ))}
    </div>
  );
}

/** A numbered run of steps: a protocol, a pipeline, a regulatory route. */
export function Steps({ steps }: { steps: { title: ReactNode; body?: ReactNode }[] }) {
  return (
    <ol className="wk-steps">
      {steps.map((s, i) => (
        <li key={i} data-reveal>
          <span className="wk-step-n" aria-hidden="true">{i + 1}</span>
          <div>
            <p className="wk-step-t">{s.title}</p>
            {s.body && <div className="wk-step-b">{s.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A simple data table that scrolls sideways on a phone rather than squashing. */
export function Table({
  head,
  rows,
  caption,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  caption?: ReactNode;
}) {
  return (
    <figure className="wk-table" data-reveal>
      <div className="wk-table-scroll">
        <table>
          <thead>
            <tr>{head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
