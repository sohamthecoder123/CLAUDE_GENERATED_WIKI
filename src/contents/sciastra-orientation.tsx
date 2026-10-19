import { P } from "../components/WikiPage";
import o1 from "../assets/orientation/orientation-1.jpg";
import o2 from "../assets/orientation/orientation-2.jpg";
import o3 from "../assets/orientation/orientation-3.jpg";

/*
 * Sciastra Quiz and iGEM Orientation. Text as sent by the team; the three
 * photographs belong to the orientation and carry no captions.
 */

export const SCIASTRA = (
  <>
    <P>
      As a part of Human Practices this year and to supplement our fundraising efforts, our team partnered with SciAstra Foundation, an NGO whose main goal is democratising access to the sciences in our country, to organise one of the biggest nationwide quizzes ever organised by a student team. Apart from raising almost 4 lakh INR, we got roughly 4,000 registrations and 7000 visits to the website advertising our initiative. The quiz was designed to foster a healthy interest in the sciences, and encourage pursuing research in a country where higher education is saturated by engineers or doctors, with a great need for R&amp;D as the country continues developing.
    </P>
    <P>
      The prizes for the competition ranged up to 1 lakh INR in educational material, medals and other goodies, and the toppers also got to visit our college, getting to experience the centre of research in our country.
    </P>
  </>
);

export const ORIENTATION = (
  <>
    <P>
      We organised an orientation aimed at incoming undergraduate students at IISc, where our team walked through what iGEM actually is, IISc's history of participation in the competition and how a typical iGEM cycle unfolds over the year.
    </P>
    <div className="wk-photos" data-reveal>
      <img src={o1} alt="A team member speaking beside a “Thank you for coming!” slide" loading="lazy" />
    </div>
    <P>
      What stood out most from the session were the questions that followed. We were genuinely amazed at how wide-ranging they were, moving fluidly between the practical (how teams are formed, how much time it demands) and the scientific (why we'd chosen an RNAi-based approach over more established alternatives).
    </P>
    <div className="wk-photos" data-reveal>
      <img src={o2} alt="The group in front of the iGEM 2026 Orientation slide" loading="lazy" />
      <img src={o3} alt="The audience seated in the classroom" loading="lazy" />
    </div>
  </>
);
