import { WikiPage, P, Cards, Note, type WikiSection } from "../components/WikiPage";
import { Md } from "../components/Md";

import nbd from "./writeups/nbd-school-outreach.md?raw";
import orientations from "./writeups/orientations.md?raw";
import juniors from "./writeups/junior-writeups-intro.md?raw";

/*
 * Communication — the work aimed outward: schools, the campus, our juniors and
 * the video material.
 *
 * Education carries the write-ups themselves; this page carries what we did with
 * them and who we did it with.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "schools",
    title: "School outreach with NoteBook Drive",
    nav: "Schools",
    band: "mist",
    lead: "Taking synthetic biology to students who would not otherwise meet it.",
    body: <Md source={nbd} />,
  },

  {
    id: "orientations",
    title: "Orientations on campus",
    nav: "Orientations",
    band: "paper",
    lead: "Explaining iGEM to the people who will run the next team.",
    body: <Md source={orientations} />,
  },

  {
    id: "juniors",
    title: "Involving our juniors",
    nav: "Our juniors",
    band: "mist",
    lead: "Write-ups by first-year students, as their own way into the project.",
    body: <Md source={juniors} />,
  },

  {
    id: "video",
    title: "Video and the nationwide quiz",
    nav: "Video and quiz",
    band: "teal",
    lead: "Two routes to people who were never going to read a wiki page.",
    body: (
      <>
        <P>
          A short share video introduces the project in thirty seconds, and a longer piece walks
          through RNA interference itself, grounded in actual structures rather than cartoons.
          Both were scripted first and storyboarded against the illustration system, so the
          figures on this wiki and the frames in the video say the same thing.
        </P>
        <P>
          Alongside them we ran a nationwide quiz with SciAstra, which put malaria and synthetic
          biology questions in front of a much larger audience than any event we could host
          ourselves.
        </P>
        <Note label="To add">
          <p>
            Video files and the recordings from the 10 October event are not on this page yet.
            They are listed in the project's own write-up as material to attach, and this section
            is where they go.
          </p>
        </Note>
      </>
    ),
    after: (
      <Cards
        columns={3}
        items={[
          {
            meta: "Short",
            title: "Thirty-second introduction",
            body: <p>The project in one pass, made to be shared rather than studied.</p>,
          },
          {
            meta: "Long",
            title: "How RNA interference works",
            body: <p>The mechanism, built on real structures, for an audience that wants the actual biology.</p>,
          },
          {
            meta: "With SciAstra",
            title: "Nationwide quiz",
            body: <p>Malaria and synthetic biology questions, reaching students across the country.</p>,
          },
        ]}
      />
    ),
  },
];

export function Communication() {
  return (
    <WikiPage
      slug="communication"
      kicker="Team"
      title="Communication"
      standfirst="Schools, orientations, our own juniors, a nationwide quiz and the videos: the work aimed at people outside the lab."
      sections={SECTIONS}
    />
  );
}
