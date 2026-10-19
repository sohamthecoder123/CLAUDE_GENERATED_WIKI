import { WikiPage, P, H3, List, Note, Table, Steps, type WikiSection } from "../components/WikiPage";
import { Figure } from "../components/Figure";

import figPlasmid from "../assets/figures/09-pmosk1.svg?raw";
import figConstruct from "../assets/figures/01-fusion-protein.svg?raw";

/*
 * Parts — pMOSK1, feature by feature.
 *
 * The table below is transcribed from the annotated GenBank file that ships with
 * this wiki (public/files/pMOSK1_annotated.gb), so coordinates here and in the
 * file are the same numbers.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "overview",
    title: "pMOSK1",
    band: "mist",
    lead: "6,950 bp, circular. A pMAL-c5X backbone with positions 1459–2688 replaced by the MOSKATEER insert.",
    body: (
      <>
        <P>
          One plasmid carries the whole system: an inducible promoter, a vesicle-forming helper
          protein, the fusion protein that grips and ferries the cargo, and the cargo itself as a
          circularised RNA. Expression is driven from P<i>tac</i> under LacI control, so the
          construct is off until it is induced.
        </P>
        <List
          items={[
            <><b>Backbone:</b> pMAL-c5X, ColE1/pBR322 origin with <i>rop</i>, medium copy.</>,
            <><b>Selection:</b> AmpR (<i>bla</i>), with its own promoter.</>,
            <><b>Insert:</b> positions 1459–3961 — RBS, HlyF, RBS, the tdMCP–2×MTS fusion, and the Tornado cassette.</>,
            <>
              <b>File:</b>{" "}
              <a href="files/pMOSK1_annotated.gb" download>
                pMOSK1_annotated.gb
              </a>{" "}
              — the annotated sequence, as used by the primer-design scripts.
            </>,
          ]}
        />
        <Note label="A note on the annotation">
          <p>
            Several features carry warnings in the GenBank file that are worth repeating here:
            the <i>lacI</i> CDS has a native GTG start that should not be "corrected" to ATG, the
            242 bp <i>lacI</i>–P<i>tac</i> intergenic region is kept verbatim, the lac operator
            O1 must not be moved, and neither twister ribozyme may be trimmed. The HlyF codons
            are provisional and are to be regenerated before synthesis.
          </p>
        </Note>
      </>
    ),
    figure: <Figure svg={figPlasmid} label="Figure 1" caption="pMOSK1, in outline." draw />,
  },

  {
    id: "expression",
    title: "The expression module",
    nav: "Expression",
    band: "paper",
    lead: "One promoter, two ribosome binding sites of deliberately different strength.",
    body: (
      <>
        <P>
          The two coding sequences downstream of P<i>tac</i> are not meant to be expressed
          equally. HlyF sits behind the strong Registry RBS and the fusion protein behind the
          weak one, so the vesicle machinery runs ahead of the cargo-binding protein rather than
          competing with it for the cell's capacity.
        </P>
      </>
    ),
    after: (
      <Table
        head={["Feature", "Positions", "What it is"]}
        rows={[
          ["P_lacIq", "3–80", "lacIq up-mutation; roughly 10× more LacI. Kept from pMAL-c5X."],
          [<i>lacI</i>, "81–1163", "The lac repressor. Native GTG start."],
          ["Ptac", "1406–1434", "−35 TTGACA, 16 bp spacer, −10 TATAAT. The 16 bp spacer is what makes it Ptac rather than Ptrc."],
          ["lac operator O1", "1442–1458", "LacI binding site."],
          ["BBa_B0030", "1459–1473", "Strong RBS, driving HlyF. Registry part, 15 bp."],
          ["HlyF", "1481–2590", "369 aa. Drives outer-membrane vesicle formation — the route the cargo leaves the bacterium by."],
          ["BBa_B0031", "2599–2612", "Weak RBS, driving the fusion. Registry part, 14 bp."],
          ["rrnB T1 / T2", "4036–4122 / 4214–4241", "Transcriptional terminators."],
          ["AmpR (bla)", "4360–5220", "Ampicillin resistance, with its promoter at 4269–4359."],
          ["ori", "5308–5896", "ColE1/pBR322 origin; with rop, medium copy."],
          [<i>rop</i>, "complement(6266–6457)", "Holds the copy number down."],
        ]}
        caption="Backbone and expression features, from pMOSK1_annotated.gb."
      />
    ),
  },

  {
    id: "fusion",
    title: "The fusion protein, as built",
    nav: "The fusion",
    band: "paper",
    lead: "tdMCP–2×MTS: a tandem dimer of MS2 coat protein, a flexible linker, and two membrane-translocation sequences.",
    body: (
      <>
        <P>
          The Description page describes the two jobs; this is how they are arranged on the
          construct. The His₆ tag at the front is what the{" "}
          <a href="/experiments#pulldown">anti-His pulldown</a> catches, which is why expression
          can be confirmed at all.
        </P>
      </>
    ),
    figure: (
      <Figure svg={figConstruct} label="Figure 2" caption="The same protein, drawn as domains." draw />
    ),
    after: (
      <Table
        head={["Feature", "Positions", "What it is"]}
        rows={[
          ["fusion tdMCP-2×MTS", "2621–3604", "The whole coding sequence."],
          ["His₆ tag", "2624–2641", "The handle the pulldown uses."],
          ["MCP protomer 1", "2648–3034", "First MS2 coat protein."],
          ["AM junction", "3035–3040", "The junction that makes the two protomers a tandem dimer."],
          ["MCP protomer 2", "3041–3427", "Second MS2 coat protein."],
          ["(GGGGS)₄ linker", "3428–3487", "Keeps the gripping end and the ferrying end independent."],
          ["EcMTS 1 + GGGGS", "3488–3544", "First membrane-translocation sequence."],
          ["EcMTS 2 + GGGGS", "3545–3601", "Second membrane-translocation sequence."],
        ]}
        caption="The fusion protein's internal features, in order on the construct."
      />
    ),
  },

  {
    id: "cargo",
    title: "The cargo: a Tornado cassette",
    nav: "The cargo",
    band: "mist",
    lead: "Two twister ribozymes excise the payload from the transcript and circularise it, so the silencing RNA is not left with free ends.",
    body: (
      <>
        <P>
          The payload between the ribozymes carries the amiRNA hairpin — a 55 nt Dicer substrate
          — and, downstream of it, two MS2 stem-loops in a 19 + 20 + 19 arrangement. Those loops
          are what the tandem coat protein clamps onto, which is how one transcript becomes a
          cargo complex rather than loose RNA.
        </P>
        <H3>The silencing sequence</H3>
        <P>
          The guide strand at 3768–3788 is the anti-<i>mosGILT</i> sequence: the one stretch of
          the construct that determines which gene is silenced. Everything else in the cassette
          exists to get it there folded, circular and bound.
        </P>
      </>
    ),
    after: (
      <Table
        head={["Feature", "Positions", "What it is"]}
        rows={[
          ["Tornado cassette", "3612–3961", "twister-1 to twister-2: excises and circularises the payload."],
          ["twister-1 ribozyme", "3645–3702", "5′ ribozyme. Not to be trimmed."],
          ["amiRNA hairpin", "3718–3788", "55 nt Dicer substrate: passenger (bulged v3), stem extensions, loop, guide."],
          ["guide (anti-mosGILT)", "3768–3788", "The silencing sequence."],
          ["MS2 loop A", "3797–3815", "19 nt; bulged A, AUUA loop, U-variant."],
          ["MS2 internal spacer", "3816–3835", "20 nt — the 20 in 19 + 20 + 19."],
          ["MS2 loop B", "3836–3854", "19 nt; different stem, same core."],
          ["twister-2 ribozyme", "3869–3939", "71 nt. Not to be trimmed."],
          ["Tornado 3′ GC hairpin", "3946–3961", "Closes the cassette."],
        ]}
        caption="The cargo cassette, 5′ to 3′. Cloning sites (SalI, NotI, SacII, XbaI scar) sit between these features."
      />
    ),
  },

  {
    id: "primers",
    title: "Designing the verification primers",
    nav: "Primers",
    band: "paper",
    lead: "Divergent primers that flank the hairpin, designed against the real sequence rather than written down in advance.",
    body: (
      <>
        <P>
          Verifying a circularised payload means reading across the junction, so the primers
          point away from each other across it. The design script holds no expected primer
          sequence anywhere: the constraints encode how much sequence to search and how much
          margin to leave, and Primer3's own thermodynamic search picks what to return.
        </P>
        <Steps
          steps={[
            {
              title: "Build the template from the real file",
              body: <p>The payload is extracted from pMOSK1_annotated.gb and its length checked independently against the annotation.</p>,
            },
            {
              title: "Check every coordinate, not a spot check",
              body: <p>Each position used is re-read against the GenBank sequence, and the hairpin and guide sub-sequences are re-extracted and compared to the annotated ones.</p>,
            },
            {
              title: "State the requirement, not the answer",
              body: (
                <p>
                  SEQUENCE_TARGET and the product size range encode one requirement — the product
                  must fully contain the hairpin plus a safety buffer past the guide — and nothing
                  in the script tells Primer3 which sequence to return.
                </p>
              ),
            },
            {
              title: "Re-extract what Primer3 reports",
              body: <p>Each returned primer is re-read from the template using Primer3's own coordinates and compared with the sequence it reported, which catches bookkeeping errors on our side.</p>,
            },
            {
              title: "Check specificity against the host",
              body: <p>Candidate pairs were run through Primer-BLAST, including against the E. coli background they would be used in.</p>,
            },
          ]}
        />
        <Table
          head={["Constraint", "Value"]}
          rows={[
            ["Primer length", "17–24 nt, optimum 20"],
            ["Melting temperature", "54–62 °C, optimum 58; pair difference ≤ 3 °C"],
            ["GC content", "30–65%"],
            ["Product", "Must fully contain the hairpin plus the buffer past the guide"],
            ["Pairs returned", "5 candidates, each with a coordinate self-check"],
          ]}
          caption="Design constraints from pMOSK1_divergent_primers_verified.py."
        />
      </>
    ),
  },
];

export function Parts() {
  return (
    <WikiPage
      slug="parts"
      kicker="Project"
      title="Parts"
      standfirst="pMOSK1: one 6,950 bp plasmid carrying the promoter, the vesicle machinery, the fusion protein and the silencing cargo."
      sections={SECTIONS}
    />
  );
}
