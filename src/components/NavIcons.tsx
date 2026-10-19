/*
 * Line icons for the navbar's hover panels.
 *
 * Drawn to match the reference Aadya gave: a single-weight outline on no ground,
 * square-ish, read at about 26px. They are stroked paths on a 24-unit grid, so
 * they inherit currentColor and scale with the panel.
 *
 * iGEM serves no external assets, so these are inline, like every other mark on
 * the wiki. Add one here and point a page at it by name in pages.ts.
 */

export type NavIconName =
  | "flask"
  | "tools"
  | "tubes"
  | "chart"
  | "notebook"
  | "nodes"
  | "shield"
  | "people"
  | "cap"
  | "leaf"
  | "images";

interface Props {
  name: NavIconName;
  className?: string;
}

const COMMON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function NavIcon({ name, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      focusable="false"
    >
      <g {...COMMON}>
        {name === "flask" && (
          /* conical flask under a magnifier: the reference's Description mark */
          <>
            <path d="M9.5 3h5" />
            <path d="M10.6 3v5.1L5.4 17.2A2.1 2.1 0 0 0 7.2 20.4h9.6a2.1 2.1 0 0 0 1.8-3.2l-5.2-9.1V3" />
            <circle cx="12.1" cy="14.4" r="2.9" />
            <path d="M14.3 16.6 16.7 19" />
          </>
        )}

        {name === "tools" && (
          /* crossed spanner and screwdriver: the reference's Design, Build, Test, Learn mark */
          <>
            <path d="M7.2 3.4a3.6 3.6 0 0 0-3.3 5l1.7-1.7 2.1.6.6 2.1-1.7 1.7a3.6 3.6 0 0 0 4.4-1.3" />
            <path d="M9.9 11.6 19 20.7a1.8 1.8 0 0 0 2.5-2.5l-9.1-9.1" />
            <path d="M16.8 3.4a3.6 3.6 0 0 1 3.3 5l-1.7-1.7-2.1.6-.6 2.1 1.7 1.7a3.6 3.6 0 0 1-4.4-1.3" />
            <path d="M14.1 11.6 5 20.7a1.8 1.8 0 0 1-2.5-2.5l9.1-9.1" />
          </>
        )}

        {name === "tubes" && (
          /* two test tubes in a rack: the bench itself */
          <>
            <path d="M7.4 2.8v13.4a2.4 2.4 0 0 0 4.8 0V2.8" />
            <path d="M6.2 2.8h7.2" />
            <path d="M7.4 10.2h4.8" />
            <path d="M16.4 6.2v10a2 2 0 0 0 4 0v-10" />
            <path d="M15.4 6.2h6" />
            <path d="M16.4 12.4h4" />
          </>
        )}

        {name === "chart" && (
          /* a sheet with bars on it: the reference's Results mark */
          <>
            <path d="M6 2.8h7.6L19 8.2v13H6z" />
            <path d="M13.4 2.8v5.6H19" />
            <path d="M9.4 17.6v-3.2" />
            <path d="M12.5 17.6v-5.4" />
            <path d="M15.6 17.6v-2" />
          </>
        )}

        {name === "notebook" && (
          /* a bound notebook: the lab record */
          <>
            <path d="M7 2.8h11.2v18.4H7a2.2 2.2 0 0 1-2.2-2.2V5a2.2 2.2 0 0 1 2.2-2.2z" />
            <path d="M8.6 2.8v18.4" />
            <path d="M11.4 8h4.2" />
            <path d="M11.4 11.6h4.2" />
            <path d="M11.4 15.2h2.6" />
          </>
        )}

        {name === "nodes" && (
          /* one node branching into three: the reference's Model mark */
          <>
            <rect x="9.6" y="2.8" width="4.8" height="4" rx="0.6" />
            <rect x="2.8" y="17.2" width="4.8" height="4" rx="0.6" />
            <rect x="9.6" y="17.2" width="4.8" height="4" rx="0.6" />
            <rect x="16.4" y="17.2" width="4.8" height="4" rx="0.6" />
            <path d="M12 6.8v5.6" />
            <path d="M5.2 17.2v-2.6h13.6v2.6" />
            <path d="M12 12.4v4.8" />
          </>
        )}

        {name === "shield" && (
          /* a shield with a cross: containment and safe handling */
          <>
            <path d="M12 2.8 4.6 5.8v6c0 4.3 3 8.1 7.4 9.4 4.4-1.3 7.4-5.1 7.4-9.4v-6z" />
            <path d="M12 8.6v6.2" />
            <path d="M8.9 11.7h6.2" />
          </>
        )}
        {name === "people" && (
          /* a person beside a globe: the reference's Contribution mark */
          <>
            <circle cx="17.2" cy="7.4" r="4.4" />
            <path d="M12.8 7.4h8.8" />
            <path d="M17.2 3a9 9 0 0 1 0 8.8 9 9 0 0 1 0-8.8z" />
            <circle cx="7.6" cy="9.8" r="2.4" />
            <path d="M3.2 21.2v-2.6a4.4 4.4 0 0 1 4.4-4.4h2.2" />
            <path d="M12.6 16.4h8.2v4.8h-8.2z" />
          </>
        )}

        {name === "cap" && (
          /* a graduation cap: the teaching we did */
          <>
            <path d="M12 4 2.8 8.4 12 12.8l9.2-4.4z" />
            <path d="M6.6 10.6v5.2c0 1.8 2.4 3.2 5.4 3.2s5.4-1.4 5.4-3.2v-5.2" />
            <path d="M21.2 8.4v5.4" />
          </>
        )}

        {name === "leaf" && (
          /* a leaf with its vein: what the project leaves behind */
          <>
            <path d="M4.4 19.6c-1.6-6 1.6-12.4 8.4-14.6 2.4-.8 5-.9 6.8-.6.3 1.8.2 4.4-.6 6.8-2.2 6.8-8.6 10-14.6 8.4z" />
            <path d="M4.4 19.6 14.8 9.2" />
          </>
        )}

        {name === "images" && (
          /* two stacked photographs: the gallery */
          <>
            <path d="M7.4 3.2h13.4v13.4H7.4z" />
            <circle cx="11.4" cy="7.4" r="1.4" />
            <path d="M7.4 13.4 11.8 9.6l5.2 4.6" />
            <path d="M16.6 16.6v2.4a1.8 1.8 0 0 1-1.8 1.8H5a1.8 1.8 0 0 1-1.8-1.8V9.2a1.8 1.8 0 0 1 1.8-1.8h2.4" />
          </>
        )}
      </g>
    </svg>
  );
}
