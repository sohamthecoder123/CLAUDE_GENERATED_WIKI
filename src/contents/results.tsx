import { WikiPage, P, H3, Note, Table, Cards, type WikiSection } from "../components/WikiPage";

/*
 * Results.
 *
 * The experiments were planned so that each one has a stated question and a
 * stated set of outcomes that would answer it either way. This page is built on
 * that frame: for each experiment, what was asked, what each possible result
 * would have meant, and what we have. Where data is not yet in, the page says so
 * plainly rather than leaving a gap that reads as a result.
 */

interface Outcome {
  id: string;
  n: string;
  question: string;
  ifA: string;
  ifB: string;
  changes: string;
  status: "awaiting" | "in";
}

const OUTCOMES: Outcome[] = [
  {
    id: "immobilisation",
    n: "1",
    question: "Do Asaia cells recovered from the sugar matrix regrow into colonies at a rate comparable to cells that never entered it, and does time in the matrix change that?",
    ifA: "Counts falling dramatically or to zero, whatever the incubation time, would mean the matrix is simply lethal and the delivery concept needs redesigning before any further work.",
    ifB: "Counts close to the unexposed control would mean the cells enter a metabolically inactive but viable state and resume growth once the osmotic stress is removed — still a viable delivery vehicle.",
    changes: "A time-dependent decline would point to a slow cumulative stress rather than an immediate kill, and would set how long a field trap could run before it needs refreshing.",
    status: "awaiting",
  },
  {
    id: "transformation",
    n: "2",
    question: "Did the engineered plasmid go into E. coli, and do the colonies that survived selection actually carry it?",
    ifA: "Colonies on the selection plate with no band of the expected size would mean survival on the plate is not evidence of the construct.",
    ifB: "Colonies carrying a PCR band of the predicted size would mean the transformation worked and there is material to verify properly.",
    changes: "Everything downstream starts from a verified colony, so this is the gate the rest of the work passes through.",
    status: "awaiting",
  },
  {
    id: "purity",
    n: "3",
    question: "Is it exactly the plasmid we designed, and is the DNA clean enough to trust in sensitive downstream work?",
    ifA: "A digest pattern that does not match the predicted map would catch a wrong insert size, a missing insert or a rearrangement that a PCR band alone would have hidden.",
    ifB: "A matching digest pattern with A260/280 and A260/230 ratios in the expected range would mean both identity and purity are established.",
    changes: "If a later experiment gives an unexpected result, this is what lets us say it was not simply a wrong or dirty plasmid.",
    status: "awaiting",
  },
  {
    id: "glycerol",
    n: "4",
    question: "Does the verified construct survive freezing, so later work starts from the same material?",
    ifA: "Poor recovery from a thawed stock would mean re-deriving material each time, with the variability that brings.",
    ifB: "Clean recovery would mean one verified stock underlies every later experiment.",
    changes: "This is what makes results across weeks comparable to each other.",
    status: "awaiting",
  },
  {
    id: "pulldown",
    n: "5",
    question: "Is the fusion protein expressed, and is the band we pull down the protein we designed?",
    ifA: "No band, or a band at the wrong size, would send us back to expression conditions or to the construct itself.",
    ifB: "A band at the predicted size, present in the tagged sample and absent from the untagged control, would confirm expression of the fusion.",
    changes: "Delivery cannot be tested until there is a protein to deliver, so this gates the OMV work.",
    status: "awaiting",
  },
  {
    id: "omv",
    n: "6",
    question: "Do OMVs get taken up by epithelial cells, and does the dsRNA cargo arrive with them?",
    ifA: "Uptake without cargo delivery would separate the two halves of the problem and point the design at the cargo, not the vesicle.",
    ifB: "Uptake with cargo detected inside the cells would be the first direct evidence for the delivery route the whole project rests on.",
    changes: "This is the experiment closest to the project's central claim, and the one whose result most changes what comes next.",
    status: "awaiting",
  },
];

const SECTIONS: WikiSection[] = [
  {
    id: "how-to-read",
    title: "How to read this page",
    nav: "How to read it",
    band: "mist",
    lead: "Each experiment was planned with its answers written down in advance. This page holds those answers against what we have.",
    body: (
      <>
        <P>
          Framing every experiment as an answer to a stated question, rather than a generic step
          in a protocol, made troubleshooting far more targeted — and it means a result can be
          traced back to exactly which assumption needed revisiting. The{" "}
          <a href="/experiments">Experiments page</a> carries the question, the method and the
          controls for each one; this page carries what came back.
        </P>
        <Note label="Status of the data">
          <p>
            The experimental records on this wiki are complete for design, method and expected
            outcomes. The measured data and its interpretation are being compiled from the lab
            notebooks, and each entry below marked <i>awaiting data</i> is a slot waiting for
            those numbers — not a null result.
          </p>
        </Note>
      </>
    ),
  },

  {
    id: "by-experiment",
    title: "Experiment by experiment",
    nav: "By experiment",
    band: "paper",
    lead: "The question, what each answer would have meant, and what it changes.",
    body: (
      <>
        {OUTCOMES.map((o) => (
          <section key={o.id} id={`result-${o.id}`}>
            <H3>
              Experiment {o.n} — {o.question}
            </H3>
            <P>
              <b>If one way:</b> {o.ifA}
            </P>
            <P>
              <b>If the other:</b> {o.ifB}
            </P>
            <P>
              <b>What it changes:</b> {o.changes}
            </P>
            <P>
              <b>Where we are:</b>{" "}
              {o.status === "awaiting"
                ? "Awaiting data — the run is recorded in the lab notebook and the numbers go here."
                : "Data in; see the figure above."}
            </P>
          </section>
        ))}
      </>
    ),
  },

  {
    id: "summary",
    title: "At a glance",
    band: "mist",
    body: (
      <P>
        One line per experiment, so a reader can see the state of the whole project without
        scrolling through it.
      </P>
    ),
    after: (
      <Table
        head={["Experiment", "Question", "State"]}
        rows={OUTCOMES.map((o) => [
          <>#{o.n}</>,
          o.question,
          o.status === "awaiting" ? "Awaiting data" : "Data in",
        ])}
        caption="Updated as results are added. Each row links to its full write-up on the Experiments page."
      />
    ),
  },

  {
    id: "what-we-learned",
    title: "What the planning itself gave us",
    nav: "What we learned",
    band: "teal",
    body: (
      <>
        <P>
          The habit of stating the question first paid off in ways we did not fully appreciate
          until later. It made troubleshooting targeted, because an ambiguous result could be
          traced to a specific assumption rather than to the experiment as a whole. And it made
          the work much easier to explain to people outside the project, including judges, since
          the logic behind each experiment is stated up front rather than left implicit.
        </P>
        <P>
          It also changed what we ran. Several questions were answered on a computer first —
          whether the construct plausibly folds, whether the bacterium can afford to express it,
          how far apart traps would have to be — so that the bench work started with fewer open
          questions. That work is on the <a href="/model">Model page</a>.
        </P>
      </>
    ),
    after: (
      <Cards
        columns={3}
        items={[
          {
            meta: "Habit",
            title: "Ask the answerable question",
            body: <p>Smaller questions whose outcome tells you something useful whichever way they go, before the big one.</p>,
          },
          {
            meta: "Habit",
            title: "Write the answers down first",
            body: <p>What each possible result would mean, stated before the run, so an ambiguous result points at an assumption.</p>,
          },
          {
            meta: "Habit",
            title: "Separate question from answer",
            body: <p>Method on one page, result on another, so neither can be quietly reshaped to fit the other.</p>,
          },
        ]}
      />
    ),
  },
];

export function Results() {
  return (
    <WikiPage
      slug="results"
      kicker="Project"
      title="Results"
      standfirst="What each experiment asked, what each answer would have meant, and what we have so far."
      sections={SECTIONS}
    />
  );
}
