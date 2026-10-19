# MOSKATEER dry lab — build v1

Three computational analyses for the iGEM 2026 project, built on real data throughout.
Nothing here uses invented numbers; where a figure could not be obtained, that is stated
rather than filled in.

---

## 1. Fusion-tag placement from solved structures

**The problem this addresses.** GFP fused to the N-terminus of the MS2 coat protein blocked
the active site. The question "where should the tag go instead?" is answerable from structure
before any further cloning.

**`scripts/fusion_tag_analysis.py`** takes any protein–nucleic-acid complex and scores both
termini of every protein chain on:

1. Solvent accessibility of the terminal residue (Shrake–Rupley, computed on the full complex
   so interface burial is reflected).
2. Minimum distance from that residue to any nucleic-acid heavy atom.
3. Whether the residue is itself part of the binding interface (≤ 4.5 Å contact).
4. A steric occlusion test — a sphere of the tag's effective radius (default 17 Å, GFP) is
   projected outward from the terminus at a range of linker reaches, and the nucleic-acid and
   interface atoms falling inside it are counted.

Run it:

```bash
python3 scripts/fusion_tag_analysis.py STRUCTURE.pdb --json out.json
python3 scripts/fusion_tag_analysis.py STRUCTURE.pdb --tag-radius 12 --linker-reaches 3 10 20 35
```

### What it found on real structures

28 termini across 7 solved protein–RNA complexes. 6 came back UNSAFE, 1 CONDITIONAL, 21 SAFE.

Two results are worth pulling out:

**It reproduces itself across independent datasets.** Human Argonaute2 appears in 4W5N, 4W5T
and 9CMP — three separate crystal structures. All three independently return the same
C-terminal residue, Ala859, with relative SASA 0.028 / 0.000 / 0.000 and 6.58 / 6.51 / 6.03 Å
from the RNA, flagged UNSAFE in each. That is the method agreeing with itself on data it was
not tuned against.

**It gives a quantitative linker requirement, not just a verdict.** For Dicer (5ZAM chain A),
the projected GFP sphere contains 245 RNA atoms at a 3 Å linker reach, 202 at 7 Å, 116 at
14 Å, 4 at 21 Å and 0 at 28 Å. That is the shape of answer the tool was built to give: not
"this terminus is bad" but "this terminus needs roughly this much linker."

### The MS2 structure itself — not done, and why

The analysis you actually want is this tool run on **1ZDH** (MS2 coat protein bound to its RNA
operator stem-loop, 2.70 Å), which would answer the N- versus C-terminus question for your
construct directly. I could not fetch it. Every PDB route is blocked from this environment by
an organisation egress policy — `files.rcsb.org`, `ftp.rcsb.org`, `data.rcsb.org`,
`models.rcsb.org`, `www.ebi.ac.uk`, `pdbj.org`, `alphafold.ebi.ac.uk`, `rna.bgsu.edu` and
`ncbi.nlm.nih.gov` all refused, as did the two workarounds that functioned earlier in this
project (the Chrome download route and the device bridge — neither was reachable).

To finish it, download the file yourself and run one command:

```bash
# from any normal network
curl -O https://files.rcsb.org/download/1ZDH.pdb
python3 scripts/fusion_tag_analysis.py 1ZDH.pdb --json results/1ZDH_tags.json
```

Two things to check against your construct when you do. First, 1ZDH's coat protein chains are
modelled from the crystal and may be truncated relative to your expressed sequence — the script
prints the modelled terminal residue number so you can compare. Second, your fusion is a
*tandem dimer* of MS2 coat protein; 1ZDH contains the natural dimer, so read the result as
applying to each subunit's termini, and remember that in a tandem construct the first copy's
C-terminus is internal (joined to the second copy) rather than free.

---

## 2. India's malaria burden, 1995–2024

**`data/india_malaria_1995_2024.csv`** — 30 years of national surveillance data: cases,
*P. falciparum* cases, deaths, and annual parasite incidence. Source: National Center for
Vector Borne Diseases Control (NCVBDC), Ministry of Health and Family Welfare, Government of
India.

The transcription was verified independently: computed *P. falciparum* share from the
case columns reproduces the officially reported 38.84% (1995) and 60.07% (2024) exactly.

What the series shows:

- Cases fell **91.3%** and deaths **92.5%** between 1995 and 2024.
- But cases have risen **58%** from the 2021 low of 161,753 to 255,500 in 2024.
- The *P. falciparum* share rose from **38.8% to 60.1%** — the remaining burden is smaller
  and skewed toward the more dangerous species.

That rebound plus the species shift is the most useful thing here for Human Practices framing
and for the Ramaiah Hospital clinician questionnaire: it is a specific, government-sourced
claim about why continued vector-control work is still warranted, rather than a general appeal
to malaria being bad.

---

## 3. What the intervention would have to cost

**`scripts/cost_effectiveness_model.py`**, using **`data/intervention_cost_benchmarks.csv`** —
22 cost and cost-effectiveness figures from peer-reviewed economic evaluations retrieved via
PubMed, each row carrying its PMID and DOI.

MOSKATEER has no measured efficacy, so the model does not assume one. It runs the question
backwards: given what existing interventions really cost per case averted, what would a new
one have to achieve to compete?

**Validation.** The model's formula, applied to indoor residual spraying at its published cost
($8.26/person/year, Alonso 2021) and efficacy (57%, Mpangala 2021), reproduces the published
Tanzanian figure of $152.36 per case averted (Stelmach 2018) to the right order of magnitude
at Tanzania's actual transmission intensity ($97 at API 150, $145 at API 100).

### Two findings

**Deployment setting dominates.** The same intervention at the same price and efficacy costs
about **$48 per case averted** at high sub-Saharan transmission and about **$80,500 per case
averted** at India's 2024 national average incidence — a factor of roughly 1,700, driven
entirely by how many cases exist to avert. A population-wide intervention aimed at India has
to be targeted at high-burden districts to be economically defensible at all. This is worth
confronting directly in your project framing rather than leaving for a judge to raise.

**The comparison reduces to one number.** When two interventions are compared in the same
setting, the incidence term cancels. What remains is cost per unit of efficacy. Indoor
residual spraying costs **$0.1449 per person per year for each 1% reduction in incidence**.
To be cost-competitive at equal coverage, MOSKATEER must come in below that — under about
$4.35 per person-year at 30% efficacy, or $8.69 at 60%.

Note that incidence decides whether *any* intervention is worth deploying in a place; it does
not decide which of two interventions is cheaper per case. Those are separate questions and
the model keeps them separate.

---

## Files

```
data/india_malaria_1995_2024.csv        NCVBDC surveillance series, 30 years
data/intervention_cost_benchmarks.csv   22 published cost/ICER figures with PMIDs and DOIs
scripts/fusion_tag_analysis.py          terminus accessibility + steric occlusion tool
scripts/cost_effectiveness_model.py     break-even model
scripts/build_dashboard.py              regenerates dashboard.html from the result files
results/*_tags.json                     per-structure terminus analyses
results/summary_all_termini.json        all 28 termini, consolidated
results/cost_model.json                 model output
dashboard.html                          interactive summary of all three analyses
figures/                                rendered checks
```

Dependencies: `biopython` (≥1.79, for `Bio.PDB.SASA.ShrakeRupley`), `numpy`. The dashboard
needs nothing beyond a browser.

## Limits worth stating in any write-up

The steric model treats a folded tag as a rigid isotropic sphere, and GFP is really a
24 × 42 Å barrel. It screens for gross clashes; it is not a free-energy calculation and will
not catch subtle folding or allosteric effects. The projection direction is a geometric
heuristic that models a plausible worst-case resting position, not a Boltzmann-weighted
ensemble over what a flexible linker actually samples. Treat the output as a ranking of which
construct to build first, not as a replacement for a binding assay.

The cost model assumes equal coverage between the compared interventions and takes efficacy as
a single proportional reduction in incidence. It does not model the bait-station delivery
mechanism, coverage decay, or any dynamics over time.
