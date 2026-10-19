import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { NAV_GROUPS, NAV_ORDER, PAGES, neighbours } from "../pages";
import { Mosquito } from "./Mosquito";
import brandLogo from "../assets/brand-logo.png";
import { NavIcon } from "./NavIcons";
import "./layout.css";

/*
 * Site chrome: a translucent navbar, the routed page, and a footer that carries
 * the sitemap plus previous/next links.
 *
 * Deliberately thin. Every page draws its own hero and its own sticky section
 * navigator, so the layout prints no page title and no breadcrumb — otherwise
 * each page would show two headings.
 */

/** Sets document.title and moves focus to the page, as a router should on navigation. */
function useRouteSideEffects(mainRef: React.RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = PAGES.find((p) => p.path === pathname);
    document.title = page ? `${page.title} — MOSKATEER · iGEM IISc Bengaluru` : "MOSKATEER";

    // A fresh route starts at the top, and screen readers should hear the new page.
    window.scrollTo({ top: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, mainRef]);
}

/*
 * The page bottom (previous/next cards, sitemap, legal line) is switched off
 * for now, at Aadya's request; she will say what goes there. Set to true to
 * restore it unchanged.
 */
const SHOW_FOOTER = false;

export function Layout() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useRouteSideEffects(mainRef);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // The navbar is transparent over a page hero and gains its surface once scrolled.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu; the body must not scroll behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const { prev, next } = neighbours(pathname);

  return (
    <>
      <a className="wk-skip" href="#wk-main">Skip to content</a>

      <header className={`wk-nav${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
        <div className="wk-nav-in">
          {/* The team's banner, as supplied: the mosquito that stands in for the M of MOSKATEER. */}
          <Link to="/" className="wk-brand" aria-label="MOSKATEER, home">
            <img className="wk-brand-logo" src={brandLogo} alt="MOSKATEER" width="1110" height="414" />
          </Link>

          <button
            className="wk-burger"
            type="button"
            aria-expanded={open}
            aria-controls="wk-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          </button>

          <nav id="wk-menu" className="wk-menu" aria-label="Wiki sections">
            {NAV_ORDER.map((item) => {
              if ("path" in item) {
                const p = PAGES.find((x) => x.path === item.path);
                return p ? <NavLink key={p.path} to={p.path} className="wk-link">{p.name}</NavLink> : null;
              }
              const g = NAV_GROUPS.find((x) => x.group === item.group)!;
              return (
                <div className="wk-group" key={g.group}>
                  <span className="wk-group-label">{g.group}</span>
                  {/* One row of items, each an icon, its page name and a line
                      under it — the panel Aadya gave as the reference. */}
                  <div className="wk-panel" style={{ "--cols": g.pages.length } as CSSProperties}>
                    {g.pages.map((p) => (
                      <NavLink key={p.path} to={p.path} className="wk-panel-item">
                        {p.icon && <NavIcon name={p.icon} className="wk-panel-icon" />}
                        <span className="wk-panel-text">
                          <span className="wk-panel-name">{p.name}</span>
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* tabIndex -1 so focus can be moved here on navigation without a tab stop */}
      <main id="wk-main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>

      {SHOW_FOOTER && (
      <footer className="wk-foot">
        {(prev || next) && (
          <nav className="wk-updown" aria-label="Previous and next page">
            {prev ? (
              <Link to={prev.path} className="wk-updown-card">
                <span className="wk-updown-dir">Previous</span>
                <span className="wk-updown-name">{prev.name}</span>
                {prev.lead && <span className="wk-updown-lead">{prev.lead}</span>}
              </Link>
            ) : <span />}
            {next && (
              <Link to={next.path} className="wk-updown-card is-next">
                <span className="wk-updown-dir">Next</span>
                <span className="wk-updown-name">{next.name}</span>
                {next.lead && <span className="wk-updown-lead">{next.lead}</span>}
              </Link>
            )}
          </nav>
        )}

        <div className="wk-foot-in">
          <div className="wk-foot-about">
            <p className="wk-foot-title">
              <Mosquito size={54} />
              MOSKATEER
            </p>
            <p className="wk-foot-line">
              iGEM 2026 · Indian Institute of Science, Bengaluru. Engineering{" "}
              <i>Asaia bogorensis</i> to deliver RNAi against <i>mosGILT</i> and suppress
              malaria transmission at its vector.
            </p>
          </div>

          {NAV_GROUPS.map(({ group, pages }) => (
            <div className="wk-foot-col" key={group}>
              <p className="wk-foot-head">{group}</p>
              <ul>
                {pages.map((p) => (
                  <li key={p.path}><Link to={p.path}>{p.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="wk-foot-legal">
          Content on this wiki is the work of the IISc Bengaluru iGEM team unless
          credited otherwise on the Attributions page.
        </p>
      </footer>
      )}
    </>
  );
}
