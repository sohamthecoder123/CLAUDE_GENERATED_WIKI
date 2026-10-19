import { WikiPage, Note, type WikiSection } from "../components/WikiPage";
import { Md } from "../components/Md";
import { Figure } from "../components/Figure";

// The write-ups themselves, imported verbatim so the page and the document can
// never drift apart. Editing the prose means editing the .md file, not the JSX.
import intro from "./writeups/experiments-intro.md?raw";
import immobilisation from "./writeups/experiments-bacteria-immobilisation.md?raw";
import transformation from "./writeups/experiments-transformation-purity.md?raw";
import glycerol from "./writeups/experiments-glycerol-stock.md?raw";
import pulldown from "./writeups/experiments-antihis-pulldown.md?raw";
import omv from "./writeups/experiments-omv-uptake.md?raw";

import figImmob from "../assets/figures/10-immobilisation.svg?raw";
import figPulldown from "../assets/figures/11-anti-his-pulldown.svg?raw";
import figGut from "../assets/figures/05-gut-crossing-rnai.svg?raw";

/*
 * Experiments.
 *
 * Every experiment is written around the question it was designed to answer, in
 * the team's own framework: the question, what we expected, the design and its
 * rationale, materials, method, controls and replicates. The prose is rendered
 * straight from src/contents/writeups/*.md.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "how-we-plan",
    title: "How we planned them",
    nav: "Our framework",
    band: "mist",
    lead: "Each experiment is presented as an answer to a stated question, not as a step in a protocol.",
    body: <Md source={intro} />,
  },
  {
    id: "immobilisation",
    title: "1 · Immobilisation and viability in the sugar matrix",
    nav: "Sugar matrix viability",
    band: "paper",
    lead: "Does embedding Asaia in a solidified sugar matrix kill the cells, or only make them dormant?",
    body: <Md source={immobilisation} />,
    figure: (
      <Figure
        svg={figImmob}
        label="Figure 1"
        caption="Culture, matrix, recovery: colonies counted against an unexposed control."
        draw
      />
    ),
  },
  {
    id: "transformation",
    title: "2 and 3 · Transformation, identity and purity",
    nav: "Transformation & purity",
    band: "mist",
    lead: "Getting the plasmid into E. coli, then proving it is the plasmid we designed and clean enough to rely on.",
    body: <Md source={transformation} />,
  },
  {
    id: "glycerol",
    title: "4 · Glycerol stock preparation",
    nav: "Glycerol stocks",
    band: "paper",
    lead: "Making the verified construct survive a freezer, so later work starts from the same material.",
    body: <Md source={glycerol} />,
  },
  {
    id: "pulldown",
    title: "5 · Fusion protein expression, by anti-His pulldown",
    nav: "Anti-His pulldown",
    band: "paper",
    lead: "Is the fusion protein actually being made, and is what we pulled down the protein we designed?",
    body: <Md source={pulldown} />,
    figure: (
      <Figure
        svg={figPulldown}
        label="Figure 2"
        caption="The tagged fusion stays on the resin while untagged protein washes away."
        draw
      />
    ),
  },
  {
    id: "omv",
    title: "6 · OMV uptake and dsRNA delivery into epithelial cells",
    nav: "OMV uptake",
    band: "mist",
    lead: "The delivery question itself: do the vesicles get in, and does the cargo arrive with them?",
    body: <Md source={omv} />,
    after: (
      <Figure
        svg={figGut}
        label="Figure 3"
        caption="What the assay is a proxy for: cargo crossing the epithelium, then the mosquito's own RNAi machinery taking over."
        wide
        draw
      />
    ),
  },
  {
    id: "where-results-live",
    title: "Where the results are",
    nav: "Results",
    band: "teal",
    body: (
      <Note label="On this wiki">
        <p>
          Each write-up above ends with what we expected to see and why. The data itself, and
          what it changed, is on the <a href="/results">Results page</a>, so that the question
          and its answer can be read separately — which is how we planned them.
        </p>
      </Note>
    ),
  },
];

export function Experiments() {
  return (
    <WikiPage
      slug="experiments"
      kicker="Project"
      title="Experiments"
      standfirst="Six experiments, each written around the question it was designed to answer: the reasoning first, then the method, then what would count as an answer either way."
      sections={SECTIONS}
    />
  );
}
