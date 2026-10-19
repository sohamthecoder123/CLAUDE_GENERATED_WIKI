import { WikiPage, P, type WikiSection } from "../components/WikiPage";
import g01 from "../assets/gallery/g01.jpg";
import g02 from "../assets/gallery/g02.jpg";
import g03 from "../assets/gallery/g03.jpg";
import g06 from "../assets/gallery/g06.jpg";
import g07 from "../assets/gallery/g07.jpg";
import g08 from "../assets/gallery/g08.jpg";
import g09 from "../assets/gallery/g09.jpg";
import g10 from "../assets/gallery/g10.jpg";
import g11 from "../assets/gallery/g11.jpg";
import g12 from "../assets/gallery/g12.jpg";
import g13 from "../assets/gallery/g13.jpg";
import g14 from "../assets/gallery/g14.jpg";
import g15 from "../assets/gallery/g15.jpg";
import g16 from "../assets/gallery/g16.jpg";
import "./gallery.css";

/*
 * Gallery. The heading and paragraph are the team's own words, set exactly as
 * given. No navigator on this page: one centred column.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "sneak-peek",
    title: "Sneak Peek Into iGEM IISc 2026 Bengaluru",
    band: "mist",
    body: (
      <P>
        A project like MOSKATEER is built in long hours of reading, designing, troubleshooting and waiting for results, and it is easy to describe that work and leave out the people doing it. This section is about everything that happened apart from and to some extent the science: the late-night fun, playing chess on field without carrying about any deadlines, and a lot more. What follows is a collection of those moments, shown as they happened.
      </P>
    ),
  },
  {
    id: "lab-work",
    title: "Lab Work",
    band: "paper",
    body: (
        <div className="gl-grid">
          <figure data-reveal><img src={g01} alt="Two people working at a laminar flow hood" loading="lazy" /></figure>
          <figure data-reveal><img src={g02} alt="A team member working at the hood" loading="lazy" /></figure>
          <figure data-reveal><img src={g03} alt="Team members at the hood, with others watching" loading="lazy" /></figure>
        </div>
    ),
  },
  {
    id: "lab-fun",
    title: "Lab Fun",
    band: "mist",
    body: (
        <div className="gl-grid">
          <figure data-reveal><img src={g06} alt="A team member at a desk with a laptop" loading="lazy" /></figure>
          <figure data-reveal><img src={g07} alt="Team members at the lab desk" loading="lazy" /></figure>
          <figure data-reveal><img src={g08} alt="Team members in lab coats in the corridor" loading="lazy" /></figure>
          <figure data-reveal><img src={g09} alt="Two team members looking at a laptop" loading="lazy" /></figure>
          <figure data-reveal><img src={g10} alt="Two team members at a laptop" loading="lazy" /></figure>
          <figure data-reveal><img src={g11} alt="A team member in a lab coat, waving with a blue glove" loading="lazy" /></figure>
          <figure data-reveal><img src={g12} alt="The team gathered in the courtyard" loading="lazy" /></figure>
          <figure data-reveal><img src={g13} alt="Two team members smiling in front of a blue curtain" loading="lazy" /></figure>
          <figure data-reveal><img src={g14} alt="Two team members in the lab" loading="lazy" /></figure>
          <figure data-reveal><img src={g15} alt="Two team members in the lab" loading="lazy" /></figure>
          <figure data-reveal><img src={g16} alt="Three team members holding a blue box" loading="lazy" /></figure>
        </div>
    ),
  },
];

export function Gallery() {
  return <WikiPage slug="gallery" title="Gallery" sideless sections={SECTIONS} />;
}
