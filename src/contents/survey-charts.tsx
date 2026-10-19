import type { ReactNode } from "react";

/*
 * Charts for the community survey, redrawn in the wiki's palette.
 *
 * Every number is typed in from the Google Forms screenshots, with the label
 * exactly as the form printed it. Nothing is computed here: a bar's length comes
 * from its count (or, where the form showed only a percentage, from that
 * percentage), and the text beside it is the form's own.
 */

interface Frame {
  question: string;
  /** "61" or "93": the two surveys are never merged, so each chart says which it is. */
  n: number;
  wide?: boolean;
  children: ReactNode;
}

function Chart({ question, n, wide, children }: Frame) {
  return (
    <figure className={`sv-chart${wide ? " is-wide" : ""}`} data-reveal>
      <figcaption>
        <span className={`sv-n sv-n--${n}`}>{n} responses</span>
        <span className="sv-q">{question}</span>
      </figcaption>
      {children}
    </figure>
  );
}

export interface Bar {
  label: string;
  /** The value the form printed beside the bar, e.g. "17 (27.9%)". */
  text: string;
  /** What the bar's length is drawn from. */
  value: number;
}

/** Vertical bars: a 1 to 5 scale. */
export function Columns({ question, n, bars, max }: { question: string; n: number; bars: Bar[]; max: number }) {
  return (
    <Chart question={question} n={n}>
      <div className="sv-cols" role="img" aria-label={bars.map((b) => `${b.label}: ${b.text}`).join("; ")}>
        {bars.map((b) => (
          <div className="sv-col" key={b.label} aria-hidden="true">
            <span className="sv-col-val">{b.text}</span>
            <div className="sv-col-track">
              <i style={{ height: `${(b.value / max) * 100}%` }} />
            </div>
            <span className="sv-col-lab">{b.label}</span>
          </div>
        ))}
      </div>
    </Chart>
  );
}

/** Horizontal bars: named options. */
export function Rows({
  question, n, bars, max, wide,
}: { question: string; n: number; bars: Bar[]; max: number; wide?: boolean }) {
  return (
    <Chart question={question} n={n} wide={wide}>
      <ul className="sv-rows">
        {bars.map((b) => (
          <li key={b.label}>
            <span className="sv-row-lab">{b.label}</span>
            <span className="sv-row-track"><i style={{ width: `${(b.value / max) * 100}%` }} /></span>
            <span className="sv-row-val">{b.text}</span>
          </li>
        ))}
      </ul>
    </Chart>
  );
}

/** A two-answer ring. Percentages as the form printed them. */
export function Ring({
  question, n, yes, no,
}: { question: string; n: number; yes: number; no: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <Chart question={question} n={n}>
      <div className="sv-ring">
        <svg viewBox="0 0 140 140" role="img" aria-label={`Yes ${yes}%, No ${no}%`}>
          <circle cx="70" cy="70" r={R} className="sv-ring-no" />
          <circle
            cx="70" cy="70" r={R} className="sv-ring-yes"
            strokeDasharray={`${(yes / 100) * C} ${C}`}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <ul>
          <li><b className="sv-dot sv-dot--yes" />Yes <strong>{yes}%</strong></li>
          <li><b className="sv-dot sv-dot--no" />No <strong>{no}%</strong></li>
        </ul>
      </div>
    </Chart>
  );
}
