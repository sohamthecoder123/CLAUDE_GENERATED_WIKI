import { P } from "../components/WikiPage";
import a1 from "../assets/aiim/aiim-1.jpg";
import a2 from "../assets/aiim/aiim-2.jpg";
import a3 from "../assets/aiim/aiim-3.jpg";
import a4 from "../assets/aiim/aiim-4.jpg";
import a5 from "../assets/aiim/aiim-5.jpg";
import a6 from "../assets/aiim/aiim-6.jpg";

/*
 * AIIM. The text is the team's, as sent. The six photographs carry no captions,
 * because none were given; they sit between the paragraphs in the order sent.
 */

const Photos = ({ items }: { items: [string, string][] }) => (
  <div className="wk-photos" data-reveal>
    {items.map(([src, alt]) => (
      <img key={src} src={src} alt={alt} loading="lazy" />
    ))}
  </div>
);

export const AIIM = (
  <>
    <Photos items={[[a1, "The team on stage in front of the AIIM 2026 backdrop"]]} />
    <P>
      On August 1st and 2nd, our team travelled to IIT Madras for AIIM, a pre-Jamboree gathering that brings together iGEM teams from across the country before everyone heads to the international competition. For two days, we sat alongside teams tackling an enormous range of problems through synthetic biology. The value of the event wasn't just in presenting our own work, rather it was engaging with other teams. Watching the different approaches sharpened our sense of where MOSKATEER's own design choices stood relative to the field, and where we still had room to think harder.
    </P>
    <Photos items={[[a2, "The team together on stage beside the AIIM 2026 banner"]]} />
    <P>
      The feedback we received over those two days has been documented and folded back into the project as we continue refining it ahead of the Jamboree. Of everything we presented, the part that drew the most attention from the judging panel was our plan to incorporate a Tornado cassette into the construct, a circular RNA expression system that lets us produce our dsRNA cargo in a more stable, more efficient form than a conventional linear transcript would allow.
    </P>
    <Photos
      items={[
        [a3, "Two team members beside the AIIM 2026 banner"],
        [a4, "The audience in the lecture hall"],
      ]}
    />
    <P>
      Beyond the judging itself, AIIM was as much about the people as the projects, having fruitful conversations with other teams between sessions, hearing how they'd navigated the same kinds of ideation and feasibility questions we had. Moreover, we interacted with the various other student teams that had gathered there, even forming partnerships with the teams from IIT Kharagpur and IIT Madras. Overall, it was a rather fruitful experience.
    </P>
    <Photos
      items={[
        [a5, "Team members presenting at the podium"],
        [a6, "The team presenting on stage to the hall"],
      ]}
    />
  </>
);
