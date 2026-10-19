import { WikiPage, P, List, Note, Table, type WikiSection } from "../components/WikiPage";

/*
 * Attributions — who did what, and who helped.
 *
 * iGEM asks for this page specifically, and asks that outside help be named.
 * Where a contribution has not been confirmed with the person yet, this page
 * says so rather than listing them.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "team-work",
    title: "What the team did",
    nav: "The team's work",
    band: "mist",
    lead: "Every experiment, model, figure and page on this wiki is the team's own work unless named below.",
    body: (
      <>
        <Table
          head={["Area", "Who", "What"]}
          rows={[
            ["Dry Lab", "Soham, Joshua, Ahan, Srijan, Aaithijya", "Structure-based analysis of fusion-tag placement, the India burden dataset and its verification, and the cost-effectiveness model."],
            ["Wet Lab", "Satwik, Mohith, Debosmita, Yashwanth, Lisa, Aadya", "Construct design and assembly, transformation and verification, glycerol stocks, the anti-His pulldown and the OMV uptake work, and the sugar-matrix viability experiments."],
            ["Human Practices", "Ryan, Arani, Arya", "The clinician consultation and its questionnaire, AIIM, and the expert conversations that fed back into the design."],
            ["Education and Communication", "The whole team", "School outreach with NoteBook Drive, the campus orientations, the junior write-ups, the nationwide quiz with SciAstra and the video material."],
            ["Wiki", "The whole team", "Written, illustrated and built by the team, including the illustration system the figures are generated from."],
          ]}
        />
      </>
    ),
  },

  {
    id: "help",
    title: "Help we received",
    nav: "Outside help",
    band: "paper",
    lead: "Named, because none of this was done in isolation.",
    body: (
      <>
        <List
          items={[
            <><b>Our mentors and principal investigators.</b> They repeatedly pushed us to justify an experiment before designing it, rather than the other way around — which is why every experiment on this wiki is written around the question it answers.</>,
            <><b>The clinicians and healthcare professionals</b> who gave their time to the consultation questionnaire.</>,
            <><b>IIT Madras</b> and the teams at the All India iGEM Meet, for the questions that sent us back to the design.</>,
            <><b>NoteBook Drive</b>, our partner for the school outreach programme.</>,
            <><b>SciAstra</b>, for running the nationwide quiz with us.</>,
          ]}
        />
        <Note label="Still to add">
          <p>
            Named acknowledgements for the individual experts we consulted, our institutional
            biosafety committee contacts and our laboratory hosts are being confirmed with each
            of them before they appear here. We would rather this page be late than wrong about
            who helped.
          </p>
        </Note>
      </>
    ),
  },

  {
    id: "sources",
    title: "Data and sources we used",
    nav: "Sources",
    band: "mist",
    body: (
      <>
        <P>
          The project's quantitative claims come from named sources, and the pages that use them
          say which.
        </P>
        <List
          items={[
            <>Malaria burden figures for 2024: World Health Organization.</>,
            <>India's national surveillance series, 1995–2024: National Center for Vector Borne Diseases Control, Ministry of Health and Family Welfare, Government of India.</>,
            <>Cost and cost-effectiveness benchmarks: 22 figures from peer-reviewed economic evaluations retrieved via PubMed, each carrying its PMID and DOI, including Alonso 2021, Mpangala 2021 and Stelmach 2018.</>,
            <>Structures used in the tag-placement analysis: solved protein–RNA complexes from the Protein Data Bank, including 4W5N, 4W5T, 9CMP and 5ZAM.</>,
            <>Non-target exclusion by membrane feeding: <i>Insects</i>, 2025, "Evaluating a Novel Method to Limit Non-Target Mortality in Attractive Toxic Sugar Bait Systems", and the field-deployed Westham "Zumba" station used in WHO-tracked Phase III trials.</>,
            <>Registry parts: BBa_B0030 and BBa_B0031.</>,
          ]}
        />
      </>
    ),
  },

  {
    id: "wiki-itself",
    title: "About this wiki",
    nav: "This wiki",
    band: "teal",
    body: (
      <>
        <P>
          The wiki is a React and Vite application. Every figure is generated from the project's
          own illustration system rather than drawn by hand, so a change to the style tokens
          changes every figure at once. The fonts are self-hosted and no assets are loaded from
          outside iGEM's own static host.
        </P>
      </>
    ),
  },
];

export function Attributions() {
  return (
    <WikiPage
      slug="attributions"
      kicker="Team"
      title="Attributions"
      standfirst="Who did what, who helped, and where every number on this wiki came from."
      sections={SECTIONS}
    />
  );
}
