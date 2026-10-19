import { Link } from "react-router-dom";
import { PAGES } from "../pages";

/*
 * 404. The live wiki is a single-page app served from one HTML file, so a bad
 * path is handled here rather than by the server.
 */
export function NotFound() {
  return (
    <section className="wk-404">
      <h1>That page isn't here</h1>
      <p>
        The address you followed doesn't match any page on this wiki. Everything we
        have is one click away:
      </p>
      <ul>
        {PAGES.map((p) => (
          <li key={p.path}><Link to={p.path}>{p.name}</Link>{p.lead ? ` — ${p.lead}` : ""}</li>
        ))}
      </ul>
      <style>{`
        .wk-404 { max-width: 72ch; margin: 0 auto; padding: calc(var(--wk-nav-h) + 72px) 24px 96px; }
        .wk-404 h1 { font-size: clamp(32px, 5vw, 56px); margin: 0 0 16px; color: var(--wk-pine); }
        .wk-404 ul { padding-left: 1.1em; }
        .wk-404 li { margin: 0 0 .5em; font-size: .9em; }
        .wk-404 a { color: var(--wk-teal); }
      `}</style>
    </section>
  );
}
