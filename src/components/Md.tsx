import { useMemo, type ReactNode } from "react";

/*
 * A deliberately small Markdown renderer.
 *
 * Most of the long prose on this wiki is the team's own write-ups, kept in
 * src/contents/writeups/*.md and imported with Vite's ?raw suffix so the text on
 * the page is byte-for-byte the text in the write-up. Rendering them needs only
 * a subset of Markdown, and pulling in a parser plus a sanitiser for that subset
 * would be more code, not less — and iGEM's asset rules make every extra
 * dependency something to justify.
 *
 * Supported, because that is everything the write-ups use:
 *   #, ##, ###, #### headings      (## becomes an h3 — the band already has the h2)
 *   paragraphs
 *   - and * bullet lists, 1. numbered lists
 *   > blockquotes
 *   --- horizontal rules (dropped: the bands already separate content)
 *   **bold**, *italic*, `code`, [text](href)
 *
 * No raw HTML is emitted from the source text: inline runs are turned into React
 * elements, never into innerHTML, so a stray angle bracket in a write-up is
 * printed rather than parsed.
 */

export interface MdProps {
  /** The markdown source, imported with ?raw. */
  source: string;
  /** Drop everything above the first heading of this level (the file's own title). */
  stripTitle?: boolean;
  /** Heading level the file's "##" maps to. Default 3, inside a WikiPage band. */
  baseLevel?: 2 | 3 | 4;
}

/* ------------------------------ inline parsing ----------------------------- */

// One pass, longest-first, so **bold** is not eaten by *italic*.
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  for (const part of text.split(INLINE)) {
    if (!part) continue;
    const key = `i${i++}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      out.push(<b key={key}>{part.slice(2, -2)}</b>);
    } else if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      out.push(<i key={key}>{part.slice(1, -1)}</i>);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      out.push(<code key={key}>{part.slice(1, -1)}</code>);
    } else if (part.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (m) {
        const external = /^https?:\/\//.test(m[2]);
        out.push(
          <a key={key} href={m[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {m[1]}
          </a>,
        );
      } else out.push(part);
    } else {
      out.push(part);
    }
  }
  return out;
}

/* ------------------------------ block parsing ------------------------------ */

type Block =
  | { k: "h"; level: number; text: string }
  | { k: "p"; text: string }
  | { k: "ul" | "ol"; items: string[] }
  | { k: "quote"; text: string };

function parse(src: string, stripTitle: boolean): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { k: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ k: "p", text: para.join(" ").trim() });
      para = [];
    }
  };
  const flushList = () => {
    if (list) { blocks.push(list); list = null; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) { flushPara(); flushList(); continue; }
    if (/^---+$/.test(line.trim())) { flushPara(); flushList(); continue; }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushPara(); flushList();
      blocks.push({ k: "h", level: h[1].length, text: h[2].trim() });
      continue;
    }

    const ul = /^\s*[-*]\s+(.*)$/.exec(line);
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const kind = ul ? "ul" : "ol";
      if (!list || list.k !== kind) { flushList(); list = { k: kind, items: [] }; }
      list.items.push((ul ? ul[1] : ol![1]).trim());
      continue;
    }

    // A continuation line of the current list item.
    if (list && /^\s{2,}\S/.test(raw)) {
      list.items[list.items.length - 1] += " " + line.trim();
      continue;
    }

    const q = /^>\s?(.*)$/.exec(line);
    if (q) { flushPara(); flushList(); blocks.push({ k: "quote", text: q[1] }); continue; }

    para.push(line.trim());
  }
  flushPara();
  flushList();

  if (stripTitle) {
    const first = blocks.findIndex((b) => b.k === "h" && b.level === 1);
    if (first >= 0) blocks.splice(first, 1);
  }
  return blocks;
}

/* --------------------------------- render --------------------------------- */

export function Md({ source, stripTitle = true, baseLevel = 3 }: MdProps) {
  const blocks = useMemo(() => parse(source, stripTitle), [source, stripTitle]);

  return (
    <>
      {blocks.map((b, i) => {
        switch (b.k) {
          case "h": {
            // "#" is the file title, "##" the first heading we print, and so on.
            const level = Math.min(6, Math.max(2, baseLevel + Math.max(0, b.level - 2)));
            const Tag = `h${level}` as "h3";
            return (
              <Tag key={i} className={level === 3 ? "wk-h3" : "wk-h4"} data-reveal>
                {inline(b.text)}
              </Tag>
            );
          }
          case "p":
            return <p key={i} data-reveal data-reveal-group="prose">{inline(b.text)}</p>;
          case "quote":
            return (
              <blockquote key={i} className="wk-pull" data-reveal>
                <p>{inline(b.text)}</p>
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="wk-list">
                {b.items.map((it, j) => (
                  <li key={j} data-reveal data-reveal-group={`md-${i}`}>{inline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="wk-list">
                {b.items.map((it, j) => (
                  <li key={j} data-reveal data-reveal-group={`md-${i}`}>{inline(it)}</li>
                ))}
              </ol>
            );
        }
      })}
    </>
  );
}
