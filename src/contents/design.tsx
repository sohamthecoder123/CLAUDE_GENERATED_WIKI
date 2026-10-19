import { WikiPage, P, H3, List, Pull, Note, Cards, Table, type WikiSection } from "../components/WikiPage";
import { Figure } from "../components/Figure";

import figCargo from "../assets/figures/02-cargo-complex.svg?raw";
import figStation from "../assets/figures/04-sugar-trap.svg?raw";
import figCirc from "../assets/figures/19-circular-rna.svg?raw";
import figDomains from "../assets/figures/20-fusion-domains.svg?raw";
import figHlyF from "../assets/figures/21-hlyf-vesicles.svg?raw";
import figBetter from "../assets/figures/22-improvements.svg?raw";

/*
 * Design — the decisions, and why each one went the way it did.
 *
 * Description says what the system is. This page says why it is shaped that
 * way: the choice of chassis, the architecture of the fusion protein, and the
 * one load-bearing safety decision in the bait station.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "brief",
    title: "What the design had to do",
    nav: "The brief",
    band: "mist",
    lead: "Four requirements, and every later decision traces back to one of them.",
    body: (
      <>
        <List
          ordered
          items={[
            <>Silence <i>mosGILT</i> in male <i>Anopheles</i> without modifying the mosquito's own genome.</>,
            <>Get an RNA payload from inside a bacterium to inside a gut cell, intact.</>,
            <>Reach wild mosquitoes through a behaviour they already have, with no injections and no equipment in the field.</>,
            <>Keep working after the trap is gone — which means the carrier has to spread on its own.</>,
          ]}
        />
        <Pull>The mosquito must feed and fly away alive.</Pull>
        <P>
          That last line is the single most important constraint on the whole project. MOSKATEER
          is not an attractive toxic sugar bait; it is the opposite of a kill trap. Every trap
          design in the literature that captures or kills mosquitoes is the wrong reference
          class here. The right reference class is a feeding station.
        </P>
      </>
    ),
  },

  {
    id: "chassis",
    title: "Why Asaia bogorensis",
    nav: "The chassis",
    band: "dark",
    lead: "We did not want to build a vehicle. We wanted to find one that was already driving the route.",
    body: (
      <>
        <P>
          <i>Asaia</i> naturally colonises the mosquito gut and reproductive organs, and already
          spreads between insects on its own. It is a ready-made vehicle for the silencing
          machinery: stable colonies establish after a mosquito feeds on it, so the bacterium is
          not being asked to do anything it does not already do in nature.
        </P>
        <P>
          It also solves the problem that a one-shot intervention cannot. Because <i>Asaia</i>{" "}
          moves horizontally between adults and vertically from parent to offspring, the effect
          travels further than the trap does.
        </P>
        <Note label="The design logic, repeated">
          <p>
            Rather than editing the organism we ultimately want to affect, we engineer a
            bacterium to act as an intermediary at a natural interface. The same reasoning runs
            through the HeatShield cycle on the <a href="/engineering">Engineering page</a>,
            where the intermediary sits in the rhizosphere instead of the gut.
          </p>
        </Note>
      </>
    ),
  },

  {
    id: "fusion",
    title: "The fusion protein",
    band: "paper",
    lead: "One molecule that grips the cargo at one end and crosses a membrane at the other.",
    body: (
      <>
        <P>
          The RNA has to survive the trip and then get through the gut epithelium. Splitting
          those two jobs across two molecules would mean relying on them finding each other at
          the right moment; building them into one protein removes that dependency entirely.
        </P>
        <Table
          head={["Domain", "What it does", "Why this one"]}
          rows={[
            [
              <>2 × MS2 coat protein</>,
              "Clamps onto MS2 stem-loops engineered into the RNA cargo.",
              "A well-characterised, high-affinity RNA-binding pair, so the grip does not have to be engineered from scratch.",
            ],
            [
              <>(GGGGS)₄ linker</>,
              "Keeps the two ends flexible and independent.",
              "A standard flexible linker: long enough that neither domain folds into the other's way.",
            ],
            [
              <>2 × translocation peptide</>,
              <>14 amino acids (FIEEEKKGFLKRLF), amphipathic; inserts into gut-cell membranes and carries the bound cargo across.</>,
              "Two copies rather than one, to improve the chance of productive membrane insertion.",
            ],
          ]}
          caption="The construct as designed. Domain order on the construct is given on the Parts page."
        />
        <H3>What we checked before building it</H3>
        <P>
          Each of these choices was put through a modelling question first — does it plausibly
          fold, and can the bacterium afford to express it — before any of it was cloned. That
          work is on the <a href="/model">Model page</a>.
        </P>
      </>
    ),
    figure: (
      <Figure svg={figDomains} label="Figure 1" caption="The chain from N to C: signal sequence, coat protein, H6 tag, membrane anchor." draw />
    ),
    after: (
      <>
        <Figure
          svg={figCargo}
          label="Figure 2"
          caption="The cargo complex: stem-loops on the RNA, coat proteins clamped onto them."
          wide
          draw
        />
        <Figure
          svg={figCirc}
          label="Figure 3"
          caption="The secreted circular RNA: about 60 bp, with a central mismatch that simulation says resists RNase, and an MS2 loop for the coat protein to grip."
          wide
          draw
        />
      </>
    ),
  },

  {
    id: "vesicles",
    title: "Getting it out of the bacterium",
    nav: "The vesicles",
    band: "paper",
    lead: "HlyF degrades lipid-bilayer precursors, the membrane destabilises, and the vesicles that bud off look enough like a mosquito cell's own membrane to fuse with it.",
    body: (
      <>
        <P>
          The cargo never has to be injected or secreted as a bare molecule. It leaves inside an
          outer-membrane vesicle, and that is a deliberate part of the construct rather than a
          side effect: HlyF sits behind the strong ribosome binding site on{" "}
          <a href="/parts">pMOSK1</a> so the vesicle machinery runs ahead of the cargo-binding
          protein.
        </P>
        <P>
          Degrading those precursors does two things at once. It destabilises the membrane,
          which raises vesicle production sharply, and it shifts the membrane's composition
          toward a eukaryotic one — which is what lets the vesicle fuse with a mosquito cell at
          the other end.
        </P>
        <P>
          On the way out, the signal peptidase recognises the fusion protein's N-terminal signal
          sequence and cleaves it, so what ends up in the vesicle is the mature protein with its
          cargo.
        </P>
      </>
    ),
    after: (
      <Figure
        svg={figHlyF}
        label="Figure 4"
        caption="Vesicles budding from the bacterium and fusing with a mosquito cell."
        wide
        draw
      />
    ),
  },

  {
    id: "station",
    title: "The sugar bait station",
    nav: "The station",
    band: "mist",
    lead: "A feeding station, not a trap: the mosquito never enters the housing, feeds through a membrane, and leaves.",
    body: (
      <>
        <H3>Membrane feeding, not a walk-in chamber</H3>
        <P>
          The obvious way to picture the device is an entry hole sized so a mosquito walks in and
          a bee stays out. There is no published, field-validated hole diameter that does that
          reliably, and commercial field-trial stations avoid the problem entirely by not using
          an open chamber.
        </P>
        <P>
          What does have a number behind it is membrane feeding. A 2025 study in <i>Insects</i>{" "}
          used a microneedle roller to punch perforations under 0.25 mm in film over the bait.
          Mosquito stylets are 10–50 µm and probe straight through; a honeybee's lapping glossa
          needs an open liquid surface at 100–200 µm, and a butterfly's coiled proboscis is
          larger still. The reported result was 85–86% mosquito feeding and 0% bee and butterfly
          feeding. The field-deployed Westham "Zumba" station, used in WHO-tracked Phase III
          trials in Mali, Kenya and Zambia, works on the same principle with an SEBS elastomer
          membrane.
        </P>
        <Pull>
          The membrane is the load-bearing safety decision in the whole design. Change it, and
          you are outside validated territory.
        </Pull>

        <H3>Five printed parts</H3>
        <P>
          Plus a membrane and a cotton wick, neither printed. The split exists so that exactly
          one part ever touches the bacterial suspension.
        </P>
      </>
    ),
    figure: (
      <Figure
        svg={figStation}
        label="Figure 5"
        caption="The bait station in principle: a baited reservoir, wicks to a feeding surface, and a mosquito that leaves alive."
        draw
      />
    ),
    after: (
      <Cards
        columns={3}
        items={[
          {
            meta: "Part 1",
            title: "Outer shell",
            body: (
              <p>
                Cylindrical weather housing, Ø110 × 140 mm, 3 mm wall, with four 28 × 28 mm
                feeding windows at 90° around a recessed band. Each window backs onto a
                clip-in membrane frame. An 18 mm inspection port lets you check activity
                without opening the cartridge. It never touches the bacteria.
              </p>
            ),
          },
          {
            meta: "Part 2",
            title: "Roof",
            body: (
              <p>
                A conical cap overhanging the shell by 28 mm, so wind-driven rain has to come
                in at a steep angle to reach a membrane. A drip-edge groove underneath makes
                water fall at the rim instead of wicking back toward the shell.
              </p>
            ),
          },
          {
            meta: "Part 3 — safety-critical",
            title: "Cartridge",
            body: (
              <p>
                A twist-lock-sealed inner vessel, Ø90 × 110 mm, and the only component that
                ever contacts the bacterial suspension. Single-use or autoclavable, and
                physically separable for sterilisation or disposal. Cotton wicks run from the
                liquid out through angled ports and up to the back of each membrane, so the
                liquid level controls flow passively: no pump, no power.
              </p>
            ),
          },
          {
            meta: "Part 4",
            title: "Drip tray",
            body: (
              <p>
                Catches anything leaking from a damaged cartridge or an overfull wick before it
                reaches soil, lined with an absorbent pad that is collected and decontaminated
                rather than left in the field. It also carries the ground stake.
              </p>
            ),
          },
          {
            meta: "Part 5 — recommended",
            title: "Shutter sleeve",
            body: (
              <p>
                A rotating sleeve with cutouts matching the windows: aligned at dusk when{" "}
                <i>Anopheles</i> forages, offset by day when bees and butterflies do. Redundant
                with the membrane, deliberately — it is a second layer on a completely different
                principle, timing rather than pore size, and nearly free to add.
              </p>
            ),
          },
          {
            meta: "Not printed",
            title: "Membrane and wick",
            body: (
              <p>
                Stretched Parafilm or thin latex for early prototyping, since Parafilm is already
                standard in mosquito membrane-feeding work. Thin SEBS, silicone, or
                microneedle-perforated polyethylene film for a field-grade build.
              </p>
            ),
          },
        ]}
      />
    ),
  },

  {
    id: "better",
    title: "Three ways to make it better",
    nav: "Making it better",
    band: "mist",
    lead: "Changes we have reasoned through and not yet built.",
    body: (
      <>
        <List
          ordered
          items={[
            <>
              <b>A universal target sequence.</b> One anti-<i>mosGILT</i> sequence that works in{" "}
              <i>Aedes</i>, <i>Culex</i> and <i>Anopheles</i> alike, so the same cargo covers more
              than one vector.
            </>,
            <>
              <b>Anti-MatRP-1.</b> So <i>Asaia</i> also passes from females to males, not only
              males to females — which turns a one-way route into one that compounds.
            </>,
            <>
              <b>A tethered endolysin.</b> A small amount of native endolysin tethered to the
              inner membrane, facing the periplasm, to raise outer-membrane vesicle production.
              MepS has low affinity for wall peptide bonds, so it opens a small part of the cell
              wall and the vesicle contents can stream through.
            </>,
          ]}
        />
      </>
    ),
    after: (
      <Figure
        svg={figBetter}
        label="Figure 6"
        caption="The three proposals, and the endolysin opening part of the wall."
        wide
        draw
      />
    ),
  },

  {
    id: "phases",
    title: "What a prototype means here",
    nav: "Two phases",
    band: "teal",
    lead: "The station is not legally deployable outdoors with live engineered bacteria, and the design plan says so up front rather than in a footnote.",
    body: (
      <>
        <P>
          In India, work with genetically engineered organisms runs through a three-tier chain —
          the institutional committee first, then two national ones. The route and what each
          gate decides is set out on the <a href="/safety">Safety page</a>. Until those gates are
          passed, the device is a mechanical mockup, and the build plan is split to match.
        </P>
        <List
          items={[
            <>
              <b>Phase A — dye only, no live bacteria.</b> The station engineering can be
              validated on its own: does the membrane hold, does the wick feed, does the roof
              keep rain off, do mosquitoes probe and leave. Nothing biological is involved.
            </>,
            <>
              <b>Phase B — live bacteria, contained.</b> Only once the device works mechanically,
              and only under the biosafety committee's own standard operating procedure. A
              loaded cartridge is labelled, transported sealed and autoclaved or chemically
              decontaminated at end of life.
            </>,
          ]}
        />
        <Note label="Status">
          <p>
            MOSKATEER is contained laboratory work. Nothing on this wiki describes a field
            release, and the station as specified here is a prototype for Phase A.
          </p>
        </Note>
      </>
    ),
  },
];

export function Design() {
  return (
    <WikiPage
      slug="design"
      kicker="Project"
      title="Design"
      standfirst="Every part of MOSKATEER exists because of a constraint. This is the reasoning, from the choice of bacterium to the membrane the mosquito feeds through."
      sections={SECTIONS}
    />
  );
}
