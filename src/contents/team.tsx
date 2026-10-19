import { WikiPage, type WikiSection } from "../components/WikiPage";
import p3936 from "../assets/team/IMG_3936.jpg";
import p3938 from "../assets/team/IMG_3938.jpg";
import p3940 from "../assets/team/IMG_3940.jpg";
import p3941 from "../assets/team/IMG_3941.jpg";
import p3945 from "../assets/team/IMG_3945.jpg";
import p3948 from "../assets/team/IMG_3948.jpg";
import p3950 from "../assets/team/IMG_3950.jpg";
import p3952 from "../assets/team/IMG_3952.jpg";
import p3956 from "../assets/team/IMG_3956.jpg";
import p3958 from "../assets/team/IMG_3958.jpg";
import p3960 from "../assets/team/IMG_3960.jpg";
import p3969 from "../assets/team/IMG_3969.jpg";
import p3971 from "../assets/team/IMG_3971.jpg";
import p3973 from "../assets/team/IMG_3973.jpg";
import piShukla from "../assets/team/pi-shantanu-shukla.jpg";
import piSingh from "../assets/team/pi-vishal-singh.jpg";
import "./team.css";

/*
 * Team. Same layout as the Gallery: no navigator, one centred column.
 *
 * The Principal Investigators come first, each photograph above the name. The fourteen photographs follow, each cropped on the face and set in a
 * card of one size. Names are not supplied yet, so the cards carry none: fill in
 * `name` on a member below and it is printed under the photo. `file` keeps the
 * original photograph's number so names can be matched to it.
 *
 * The earlier sub-team bios are kept in writeups/team-bios.md.
 */

const PIS = [
  { name: "Shantanu Shukla", src: piShukla },
  { name: "Vishal Singh", src: piSingh },
];

interface Member {
  /** The original photograph's file number, e.g. IMG_3936. */
  file: string;
  src: string;
  /** Printed under the photo when given. */
  name?: string;
}

const MEMBERS: Member[] = [
  { file: "IMG_3936", src: p3936 },
  { file: "IMG_3938", src: p3938 },
  { file: "IMG_3940", src: p3940 },
  { file: "IMG_3941", src: p3941 },
  { file: "IMG_3945", src: p3945 },
  { file: "IMG_3948", src: p3948 },
  { file: "IMG_3950", src: p3950 },
  { file: "IMG_3952", src: p3952 },
  { file: "IMG_3956", src: p3956 },
  { file: "IMG_3958", src: p3958 },
  { file: "IMG_3960", src: p3960 },
  { file: "IMG_3969", src: p3969 },
  { file: "IMG_3971", src: p3971 },
  { file: "IMG_3973", src: p3973 },
];

const SECTIONS: WikiSection[] = [
  {
    id: "principal-investigators",
    title: "Principal Investigators",
    band: "mist",
    body: (
      <ul className="tm-pis">
        {PIS.map((pi) => (
          <li key={pi.name} data-reveal>
            <img src={pi.src} alt={pi.name} />
            <span>{pi.name}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "the-team",
    title: "",
    band: "paper",
    body: (
      <div className="tm-grid">
        {MEMBERS.map((m) => (
          <figure className="tm-card" key={m.file} data-reveal data-photo={m.file}>
            <img src={m.src} alt={m.name ?? "A member of the MOSKATEER team"} loading="lazy" />
            {m.name && <figcaption>{m.name}</figcaption>}
          </figure>
        ))}
      </div>
    ),
  },
];

export function Team() {
  return <WikiPage slug="team" title="Team" sideless sections={SECTIONS} />;
}
