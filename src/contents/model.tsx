import { WikiPage, P, H3, List, Pull, Note, Table, Steps, type WikiSection } from "../components/WikiPage";
import { Md } from "../components/Md";
import { Figure } from "../components/Figure";

import intro from "./writeups/modelling-intro.md?raw";
import figModel from "../assets/figures/14-modelling-stack.svg?raw";

/*
 * Model — the computational work, and what each analysis was for.
 *
 * Three analyses: where a tag can sit on a protein without blocking its RNA
 * binding, what India's own surveillance data says about the burden we are
 * designing against, and what the intervention would have to cost to compete.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "why-model",
    title: "Why we modelled first",
    nav: "Why model",
    band: "mist",
    lead: "Ask the cheap questions before the expensive ones.",
    body: <Md source={intro} />,
    figure: (
      <Figure svg={figModel} label="Figure 1" caption="Three questions we could answer before spending a reagent." draw />
    ),
  },

  {
    id: "tag-placement",
    title: "Where the tag can go",
    nav: "Fusion-tag placement",
    band: "paper",
    lead: "GFP fused to the N-terminus of the MS2 coat protein blocked the active site. Where should a tag go instead — and how much linker does it need?",
    body: (
      <>
        <P>
          That question is answerable from solved structures before any further cloning. Our
          script takes any protein–nucleic-acid complex and scores both termini of every protein
          chain on four things.
        </P>
        <List
          ordered
          items={[
            "Solvent accessibility of the terminal residue, by Shrake–Rupley, computed on the full complex so interface burial is reflected.",
            "Minimum distance from that residue to any nucleic-acid heavy atom.",
            "Whether the residue is itself part of the binding interface, at a 4.5 Å contact threshold.",
            "A steric occlusion test: a sphere of the tag's effective radius — 17 Å for GFP by default — is projected outward from the terminus at a range of linker reaches, and the nucleic-acid and interface atoms falling inside it are counted.",
          ]}
        />
        <H3>What it found on real structures</H3>
        <P>
          Twenty-eight termini across seven solved protein–RNA complexes: six came back unsafe,
          one conditional and twenty-one safe.
        </P>
        <P>
          <b>It reproduces itself across independent datasets.</b> Human Argonaute2 appears in
          4W5N, 4W5T and 9CMP — three separate crystal structures. All three independently return
          the same C-terminal residue, Ala859, with relative SASA 0.028 / 0.000 / 0.000 and
          6.58 / 6.51 / 6.03 Å from the RNA, flagged unsafe in each. That is the method agreeing
          with itself on data it was not tuned against.
        </P>
        <P>
          <b>It gives a quantitative linker requirement, not just a verdict.</b> For Dicer
          (5ZAM chain A), the projected GFP sphere contains 245 RNA atoms at a 3 Å linker reach,
          202 at 7 Å, 116 at 14 Å, 4 at 21 Å and none at 28 Å.
        </P>
        <Pull>
          Not "this terminus is bad", but "this terminus needs roughly this much linker".
        </Pull>
        <Note label="Still to run">
          <p>
            The analysis we most want is this tool run on <b>1ZDH</b> — MS2 coat protein bound to
            its RNA operator stem-loop at 2.70 Å — which would answer the N- versus C-terminus
            question for our own construct directly. The structure file has not yet been put
            through the pipeline; the script takes it as a single argument.
          </p>
        </Note>
      </>
    ),
  },

  {
    id: "burden",
    title: "India's malaria burden, 1995–2024",
    nav: "The burden data",
    band: "paper",
    lead: "Thirty years of national surveillance data, transcribed and independently verified.",
    body: (
      <>
        <P>
          Cases, <i>P. falciparum</i> cases, deaths and annual parasite incidence, from the
          National Center for Vector Borne Diseases Control, Ministry of Health and Family
          Welfare. The transcription was checked by recomputing the <i>P. falciparum</i> share
          from the case columns: it reproduces the officially reported 38.84% for 1995 and
          60.07% for 2024 exactly.
        </P>
        <Table
          head={["What the series shows", "Figure"]}
          rows={[
            ["Fall in cases, 1995 to 2024", "91.3%"],
            ["Fall in deaths over the same period", "92.5%"],
            ["Rise in cases from the 2021 low of 161,753 to 2024", "58%, to 255,500"],
            ["P. falciparum share of cases, 1995 → 2024", "38.8% → 60.1%"],
          ]}
          caption="National surveillance data, NCVBDC."
        />
        <P>
          That rebound plus the species shift is the most useful thing in the dataset for our
          Human Practices work and for the clinician questionnaire: it is a specific,
          government-sourced claim about why continued vector-control work is still warranted,
          rather than a general appeal to malaria being bad. The remaining burden is smaller and
          skewed toward the more dangerous species.
        </P>
      </>
    ),
  },

  {
    id: "cost",
    title: "What the intervention would have to cost",
    nav: "Cost model",
    band: "mist",
    lead: "MOSKATEER has no measured efficacy, so the model does not assume one. It runs the question backwards.",
    body: (
      <>
        <P>
          Given what existing interventions really cost per case averted, what would a new one
          have to achieve to compete? The model uses 22 cost and cost-effectiveness figures from
          peer-reviewed economic evaluations retrieved via PubMed, each row carrying its PMID and
          DOI.
        </P>
        <H3>Validation</H3>
        <P>
          Applied to indoor residual spraying at its published cost ($8.26 per person per year,
          Alonso 2021) and efficacy (57%, Mpangala 2021), the model's formula reproduces the
          published Tanzanian figure of $152.36 per case averted (Stelmach 2018) to the right
          order of magnitude at Tanzania's actual transmission intensity: $97 at API 150, $145 at
          API 100.
        </P>
        <Steps
          steps={[
            {
              title: "Deployment setting dominates",
              body: (
                <p>
                  The same intervention at the same price and efficacy costs about <b>$48 per
                  case averted</b> at high sub-Saharan transmission and about <b>$80,500 per case
                  averted</b> at India's 2024 national average incidence — a factor of roughly
                  1,700, driven entirely by how many cases exist to avert. A population-wide
                  intervention aimed at India has to be targeted at high-burden districts to be
                  economically defensible at all. We would rather confront that directly than
                  leave it for a judge to raise.
                </p>
              ),
            },
            {
              title: "The comparison reduces to one number",
              body: (
                <p>
                  Compare two interventions in the same setting and the incidence term cancels.
                  What remains is cost per unit of efficacy. Indoor residual spraying costs{" "}
                  <b>$0.1449 per person per year for each 1% reduction in incidence</b>. To be
                  cost-competitive at equal coverage, MOSKATEER has to come in below that: under
                  about <b>$4.35 per person-year at 30% efficacy</b>, or <b>$8.69 at 60%</b>.
                </p>
              ),
            },
          ]}
        />
        <P>
          Incidence decides whether <i>any</i> intervention is worth deploying in a place; it does
          not decide which of two interventions is cheaper per case. Those are separate questions,
          and the model keeps them separate.
        </P>
      </>
    ),
  },

  {
    id: "limits",
    title: "Limits worth stating",
    nav: "Limits",
    band: "teal",
    lead: "Every model here is a ranking tool, not a replacement for a measurement.",
    body: (
      <>
        <P>
          The steric model treats a folded tag as a rigid isotropic sphere, and GFP is really a
          24 × 42 Å barrel. It screens for gross clashes; it is not a free-energy calculation and
          will not catch subtle folding or allosteric effects. The projection direction is a
          geometric heuristic modelling a plausible worst-case resting position, not a
          Boltzmann-weighted ensemble over what a flexible linker actually samples. Treat the
          output as a ranking of which construct to build first, not as a substitute for a
          binding assay.
        </P>
        <P>
          The cost model assumes equal coverage between the compared interventions and takes
          efficacy as a single proportional reduction in incidence. It does not model the
          bait-station delivery mechanism, coverage decay, or any dynamics over time.
        </P>
        <Note label="On the data">
          <p>
            Nothing in this work uses invented numbers. Where a figure could not be obtained, the
            analysis says so rather than filling it in — which is why the MS2 structure analysis
            above is listed as still to run rather than reported as a result.
          </p>
        </Note>
      </>
    ),
  },
];

export function Model() {
  return (
    <WikiPage
      slug="model"
      kicker="Project"
      title="Model"
      standfirst="Three computational analyses, built on real data: where a tag can sit without blocking RNA binding, what India's own surveillance data shows, and what MOSKATEER would have to cost to compete."
      sections={SECTIONS}
    />
  );
}
