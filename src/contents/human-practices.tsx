import { WikiPage, P, type WikiSection } from "../components/WikiPage";
import { Columns, Rows, Ring } from "./survey-charts";
import "./survey-charts.css";

import { EXPERTS } from "./experts";
import { AIIM } from "./aiim";
import { SCIASTRA, ORIENTATION } from "./sciastra-orientation";

/*
 * Integrated Human Practices.
 *
 * Five sections, in the order the team gave. AIIM and the orientation use the
 * team's existing write-ups unchanged; the survey text is as supplied. The
 * experts section and the Sciastra quiz are waiting for their text and carry a
 * marker rather than invented copy.
 *
 * The survey charts are drawn from the numbers on the Google Forms screenshots
 * (two surveys, 61 and 93 responses, never merged). Only charts whose every
 * value is legible in the screenshot are used.
 */

const SURVEY_AFTER = (
  <div className="sv-grid">
    <Columns
      n={93}
      question="On a scale of 1–5, how would you rate your overall awareness of malaria as a public health issue in India?"
      max={33}
      bars={[
        { label: "1", text: "3 (3.2%)", value: 3 },
        { label: "2", text: "12 (12.9%)", value: 12 },
        { label: "3", text: "18 (19.4%)", value: 18 },
        { label: "4", text: "27 (29%)", value: 27 },
        { label: "5", text: "33 (35.5%)", value: 33 },
      ]}
    />
    <Ring n={93} question="Have you, or anyone close to you, ever been affected by malaria?" yes={47.3} no={52.7} />

    <Rows
      wide
      n={93}
      question="Which of the following malaria prevention or control methods have you heard of? (Select all that apply)"
      max={80}
      bars={[
        { label: "Bed nets", text: "73 (78.5%)", value: 73 },
        { label: "Indoor spraying of insecticide (IRS)", text: "63 (67.7%)", value: 63 },
        { label: "Killing mosquito larvae in stagnant water using certain ch…", text: "67 (72%)", value: 67 },
        { label: "Genetically modified mosquitoes or gene drives", text: "30 (32.3%)", value: 30 },
        { label: "Malaria vaccines", text: "45 (48.4%)", value: 45 },
        { label: "None of these, I wasn't aware of any", text: "4 (4.3%)", value: 4 },
      ]}
    />

    <Columns
      n={61}
      question="How effective do you personally believe current control methods (like bed nets and spraying) have been at reducing malaria cases?"
      max={24}
      bars={[
        { label: "1", text: "1 (1.6%)", value: 1 },
        { label: "2", text: "17 (27.9%)", value: 17 },
        { label: "3", text: "24 (39.3%)", value: 24 },
        { label: "4", text: "18 (29.5%)", value: 18 },
        { label: "5", text: "1 (1.6%)", value: 1 },
      ]}
    />
    <Columns
      n={93}
      question="How effective do you personally believe current control methods (like bed nets and spraying) have been at reducing malaria cases?"
      max={50}
      bars={[
        { label: "1", text: "5 (5.4%)", value: 5 },
        { label: "2", text: "11 (11.8%)", value: 11 },
        { label: "3", text: "50 (53.8%)", value: 50 },
        { label: "4", text: "14 (15.1%)", value: 14 },
        { label: "5", text: "13 (14%)", value: 13 },
      ]}
    />

    <Columns
      n={61}
      question="How confident are you that current tools alone (bed nets and spraying insecticides) will be enough to eliminate malaria in India without any newer technological approaches?"
      max={25}
      bars={[
        { label: "1", text: "21 (34.4%)", value: 21 },
        { label: "2", text: "25 (41%)", value: 25 },
        { label: "3", text: "9 (14.8%)", value: 9 },
        { label: "4", text: "6 (9.8%)", value: 6 },
        { label: "5", text: "0 (0%)", value: 0 },
      ]}
    />
    <Rows
      n={93}
      question="In your view, what is the single biggest reason current malaria control methods fall short of eliminating the disease?"
      max={30}
      bars={[
        { label: "Mosquitoes developing resistance", text: "16.1%", value: 16.1 },
        { label: "Poor public compliance (e.g., not consistently using nets)", text: "28%", value: 28 },
        { label: "Inadequate funding or infrastructure", text: "15.1%", value: 15.1 },
        { label: "Climate and environmental factors expanding mosquito habitats", text: "23.7%", value: 23.7 },
        { label: "Limited healthcare access in affected regions", text: "17.2%", value: 17.2 },
      ]}
    />

    <Ring n={61} question="Before this survey, had you heard of genetic or biological approaches to mosquito control?" yes={59} no={41} />
    <Ring
      n={93}
      question="Before this survey, had you heard of genetic or biological approaches to mosquito control specifically?"
      yes={43}
      no={57}
    />
  </div>
);

const SECTIONS: WikiSection[] = [
  {
    id: "experts",
    title: "Interactions with Experts and stakeholders",
    nav: "Experts and stakeholders",
    band: "mist",
    body: EXPERTS,
  },
  {
    id: "aiim",
    title: "AIIM",
    band: "paper",
    body: AIIM,
  },
  {
    id: "sciastra-quiz",
    title: "Sciastra Quiz",
    band: "mist",
    body: SCIASTRA,
  },
  {
    id: "orientation",
    title: "iGEM Orientation",
    band: "paper",
    body: ORIENTATION,
  },
  {
    id: "community-survey",
    title: "Community Awareness Survey",
    nav: "Community Survey",
    band: "mist",
    body: (
      <>
        <P>
          Malaria remains one of the largest infectious disease burdens in the world, and India carries a substantial share of it. Current control relies mainly on insecticide-treated bed nets and indoor residual spraying. Their effectiveness is increasingly limited by insecticide resistance, and the public’s view of these tools shapes how any new approach would be received. Before a technology such as ours could be considered, it is important to understand what people already know and believe.
        </P>
        <P>
          As part of the MOSKATEER project, an engineered bacterium that lives in Anopheles mosquitoes is being developed to disrupt their reproduction and reduce malaria transmission. Because this approach is new to most people, the way it is explained and perceived matters as much as the science itself. We therefore designed a short community awareness survey to capture public and professional views before the technology is tested.
        </P>
        <P>
          The survey asked about four areas: how aware respondents are of malaria as a public health issue, how they judge current control methods and whether those methods will be enough without new tools, what they already know about genetic and biological approaches to mosquito control, and whether they would support a supervised pilot once safety testing and regulatory approval are in place. Several questions tested understanding directly, including how gene-based methods are meant to work and whether the term “paratransgenesis” was familiar, so we could separate awareness from misconception.
        </P>
        <P>
          Responses were collected anonymously and used only for this research. The survey is intended as a baseline. It tells us where public understanding stands, which concepts need clearer explanation, and where concerns are concentrated, so that our outreach and any future pilot planning address real questions rather than assumed ones.
        </P>
      </>
    ),
    after: SURVEY_AFTER,
  },
];

export function HumanPractices() {
  return <WikiPage slug="human-practices" title="Integrated Human Practices" sections={SECTIONS} />;
}
