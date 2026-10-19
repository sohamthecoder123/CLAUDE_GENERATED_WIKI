import { WikiPage, P, H3, List, Pull, Note, Steps, Table, type WikiSection } from "../components/WikiPage";
import { Figure } from "../components/Figure";

import figDbtl from "../assets/figures/07-dbtl-cycle.svg?raw";
import figHeat from "../assets/figures/08-heatshield.svg?raw";
import figConstruct from "../assets/figures/01-fusion-protein.svg?raw";
import hs1 from "../assets/heatshield/hs-01.jpg";
import hs2 from "../assets/heatshield/hs-02.jpg";
import hs3 from "../assets/heatshield/hs-03.png";
import hs4 from "../assets/heatshield/hs-04.png";
import hs5 from "../assets/heatshield/hs-05.png";
import hs6 from "../assets/heatshield/hs-06.png";
import hs7 from "../assets/heatshield/hs-07.jpg";
import "./engineering.css";

/*
 * Engineering — the design-build-test-learn cycles.
 *
 * Two cycles: HeatShield, which we ran in full during ideation and did not carry
 * forward, and MOSKATEER, which we did. The HeatShield write-up is kept at length
 * because the reasoning in it is what shaped how MOSKATEER was designed.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "how-we-work",
    title: "How we ran a cycle",
    nav: "The cycle",
    band: "mist",
    lead: "A cycle is finished when what we learned changes the next design — not when the experiment ends.",
    body: (
      <>
        <P>
          Both of the projects below went through a genuine design-build-test-learn cycle. The
          first one we did not carry forward; documenting it here shows the breadth of what we
          explored and the kind of reasoning that eventually shaped how we approached MOSKATEER
          itself.
        </P>
        <P>
          The through-line in both is the same instinct our mentors kept pushing during
          ideation: ask the answerable question first, and let its answer tell you whether the
          bigger question is worth pursuing yet.
        </P>
      </>
    ),
    figure: <Figure svg={figDbtl} label="Figure 1" caption="The cycle, and what each move meant on this project." draw />,
  },

  {
    id: "heatshield-design",
    title: "HeatShield — Design",
    nav: "HeatShield: design",
    band: "paper",
    lead: "An engineered Bacillus subtilis strain to buffer crop roots against heat-stress-induced ethylene signalling.",
    body: (
      <>
        <P>
          Our starting point was not a bacterium or a gene — it was a question about
          agricultural loss. Heatwaves have roughly tripled in frequency since 1960, and even
          short heat spikes during sensitive growth stages like flowering can cut yield by
          10–40%. India's own 2022 heatwave produced a documented 10–15% drop in wheat output.
          That was the scale of problem we wanted a design to be able to move.
        </P>
        <H3>The biology: heat, ACC, ethylene</H3>
        <P>
          Heat stress at the root level, roughly 35 °C and above, makes plants synthesise more
          ACC (1-aminocyclopropane-1-carboxylic acid) via the enzyme ACS, and export it into the
          apoplast and rhizosphere. The plant's own apoplastic ACC oxidase converts ACC into
          ethylene — a useful hormone in modest amounts. Under prolonged heat stress, elevated
          ACC output means elevated ethylene, and excess ethylene amplifies growth inhibition
          and accelerates senescence. The plant over-produces its own stress hormone and
          compounds the damage.
        </P>
        <Pull>
          The problem was not heat, which we could not do anything about. It was the flood of
          ethylene signalling that heat triggers.
        </Pull>
        <H3>Why the rhizosphere, not the plant</H3>
        <P>
          Ethylene signalling regulates several developmental pathways at once, so modifying
          the plant's own hormone machinery risked pleiotropic effects in processes we were not
          trying to touch. The rhizosphere is a naturally microbe-populated interface plants
          already interact with constantly, so engineering a microbe to act there gave
          localised, stress-dependent control of ACC without altering the plant's genome.
        </P>
        <Note label="The same logic as MOSKATEER">
          <p>
            Rather than editing the organism we ultimately wanted to protect, we engineered a
            bacterium to act as an intermediary at a natural interface. The biology is entirely
            different; the design reasoning is the same one that produced MOSKATEER.
          </p>
        </Note>
      </>
    ),
    figure: (
      <Figure
        svg={figHeat}
        label="Figure 2"
        caption="HeatShield in one move: consume ACC in the rhizosphere before the plant turns it into ethylene."
        draw
      />
    ),
    after: (
      <div className="hs-grid" data-reveal>
        {[hs1, hs2, hs3, hs4, hs5, hs6, hs7].map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" />
        ))}
      </div>
    ),
  },

  {
    id: "heatshield-circuit",
    title: "HeatShield — four design principles",
    nav: "HeatShield: circuit",
    band: "dark",
    lead: "A naively always-on version of this idea creates as many problems as it solves. Each principle answers one specific failure mode.",
    body: (
      <>
        <P>
          Most straightforwardly engineered strains use constitutive promoters, which drain the
          bacterium's energy continuously — so the population dies off or sporulates before the
          heatwave it was meant to answer ever arrives. A high-expression deaminase that is not
          kinetically tuned strips out essentially all of the plant's ACC, producing what we
          called <b>ethylene blindness</b>, where the plant can no longer regulate root growth
          or immune signalling at all. Laboratory strains generally lack a safety leash. And a
          genetically uniform population under stress responds uniformly — all active and
          starving, or all dormant — leaving the plant unprotected in exactly the window that
          matters.
        </P>
        <Steps
          steps={[
            {
              title: "Dynamic thermostatic gating",
              body: (
                <p>
                  Use <i>B. subtilis</i>'s own heat-shock promoter, P<i>groE</i>, as a
                  biological thermostat. The circuit stays transcriptionally silent at baseline
                  soil temperatures around 30 °C and activates only once temperatures cross into
                  heat-stress territory around 42 °C, so no energy is spent maintaining a defence
                  that is not needed yet.
                </p>
              ),
            },
            {
              title: "Substrate-level kinetic buffering",
              body: (
                <p>
                  Choose an ACC deaminase variant with a K<sub>m</sub> of roughly 500 µM against
                  rhizosphere ACC concentrations of roughly 15 µM. Because the affinity is modest
                  relative to how little ACC is present, the system produces a partial reduction
                  of about 50–60% rather than total depletion — enough to blunt the excess, while
                  leaving the plant the basal ACC it needs for normal development.
                </p>
              ),
            },
            {
              title: "An auxotrophic safety leash",
              body: (
                <p>
                  A <i>trpC2⁻</i> mutation makes the strain a tryptophan auxotroph, dependent on
                  the tryptophan-rich exudates roots release. Its survival is tethered to
                  proximity with the root: spread beyond the rhizosphere and it simply cannot
                  survive. Containment is built into the biology rather than left to the
                  environment or to regulation alone.
                </p>
              ),
            },
            {
              title: "Engineered persistence — the 75% active shield",
              body: (
                <p>
                  Tune the circuit's metabolic burden to a growth rate of roughly 0.119/h under
                  heat stress, just above the ~0.1/h threshold past which <i>B. subtilis</i>{" "}
                  commits irreversibly to mass sporulation. The natural phenotypic bistability of
                  the species then produces a stable split: roughly 75% of cells stay active and
                  keep processing ACC while 25% go dormant as a survival backup. Population
                  heterogeneity is designed around rather than treated as noise.
                </p>
              ),
            },
          ]}
        />
        <H3>What happens to the ACC afterwards</H3>
        <P>
          A design that solves the signalling problem is still incomplete if it introduces a new
          one. ACC deaminase converts ACC into α-ketobutyrate and ammonia. Both are ecologically
          unremarkable: ACC-deaminase-producing rhizobacteria are widely reported to improve
          plant growth under stress with no evidence of phytotoxic accumulation, and soil
          ecosystems already contain ammonia in parts-per-million ranges as part of ordinary
          microbial nitrogen cycling.
        </P>
      </>
    ),
  },

  {
    id: "heatshield-learn",
    title: "HeatShield — what we took from it",
    nav: "HeatShield: learn",
    band: "mist",
    lead: "We did not carry HeatShield forward. We carried its reasoning forward.",
    body: (
      <>
        <P>
          The build, test and learn stages of this cycle — chromosomal integration strategy, the
          in-silico modelling that validated the design before any wet-lab work, and the planned
          experimental validation sequence — were developed alongside the design above. How the
          project came to be set aside in favour of MOSKATEER is on the{" "}
          <a href="/ideation">Ideation page</a>.
        </P>
        <List
          items={[
            "Intervene at an interface the system already has, rather than inside the organism you are trying to protect.",
            "Design against the specific failure mode, not against the general idea of failure: each of the four principles answers one named way the circuit could go wrong.",
            "Build containment into the biology where you can.",
            "Ask the answerable question first, and let the answer decide whether the bigger one is worth the reagents.",
          ]}
        />
      </>
    ),
  },

  {
    id: "moskateer-cycle",
    title: "MOSKATEER — the cycle we carried forward",
    nav: "MOSKATEER cycle",
    band: "paper",
    lead: "The same four moves, on the project we chose.",
    body: (
      <>
        <Table
          head={["Stage", "What we did", "Where it is documented"]}
          rows={[
            [
              "Design",
              "A fusion protein that both grips the RNA cargo and crosses the gut wall, carried by a bacterium that already lives there and already spreads.",
              <><a href="/design">Design</a></>,
            ],
            [
              "Build",
              "pMOSK1: promoter, fusion protein, dsRNA cassette and selection marker, with primers designed to verify the insert; transformed and purity-checked.",
              <><a href="/parts">Parts</a>, <a href="/experiments">Experiments</a></>,
            ],
            [
              "Test",
              "One assay per question: survival through the sugar matrix and CFU recovery, transformation and purity, glycerol stocks, an anti-His pulldown for expression, and OMV uptake for delivery.",
              <><a href="/experiments">Experiments</a></>,
            ],
            [
              "Learn",
              "Folding, metabolic cost and trap spacing asked on a computer first, so the wet lab started with fewer open questions; what each result changed is on Results.",
              <><a href="/model">Model</a>, <a href="/results">Results</a></>,
            ],
          ]}
        />
        <P>
          Every wet-lab experiment on this wiki was, in some form, downstream of a modelling
          question we had already asked and felt confident enough about to move forward on.
        </P>
      </>
    ),
    figure: (
      <Figure svg={figConstruct} label="Figure 3" caption="The construct the cycle converged on." draw />
    ),
  },
];

export function Engineering() {
  return (
    <WikiPage
      slug="engineering"
      kicker="Project"
      title="Engineering"
      standfirst="Two design-build-test-learn cycles: HeatShield, which we ran in full and set aside, and MOSKATEER, which we built."
      sections={SECTIONS}
    />
  );
}
