import { WikiPage, P, Note, type WikiSection } from "../components/WikiPage";

/*
 * Notebook — the lab record, in the order the work happened.
 *
 * The frame is here; the entries are the team's own writing and are not
 * invented on their behalf. Each week goes in as its own section once Aadya
 * supplies it, and nothing on this page is reworded when it arrives.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "how-to-read-it",
    title: "How to read this notebook",
    band: "mist",
    lead: "What we did, in the order we did it, including the runs that did not work.",
    body: (
      <>
        <P>
          This page is the record rather than the argument. The reasoning behind each
          experiment is on the <a href="/experiments">Experiments page</a>, and what the
          numbers meant is on the <a href="/results">Results page</a>. Here the entries stay
          in date order, so a reader can follow the project as it actually ran.
        </P>
        <Note label="Awaiting the team's entries">
          <p>
            The weekly entries are being written up from the lab notebook and will be added
            here as they come in, in the team's own words.
          </p>
        </Note>
      </>
    ),
  },
];

export function Notebook() {
  return (
    <WikiPage
      slug="notebook"
      titleArt="notebook"
      kicker="Lab"
      title="Notebook"
      standfirst="The project as it ran, week by week: what was set up, what was measured, and what we changed afterwards."
      sections={SECTIONS}
    />
  );
}
