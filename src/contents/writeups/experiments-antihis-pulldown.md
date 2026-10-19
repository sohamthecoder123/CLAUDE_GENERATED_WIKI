## Experiment 5: Confirming Fusion Protein Expression via Anti-His Pulldown

### Introducing the Question

Every experiment up to this point confirmed that our engineered plasmid was correctly built and stably maintained — the right sequence, in the right strain, backed up in storage. None of that, however, actually tells us whether the bacterium is doing the one thing the whole delivery strategy depends on: translating that plasmid into a real, intact fusion protein. A plasmid can be perfectly correct at the DNA level and still fail to produce a functional protein, whether from poor expression, premature termination, or the protein being made but rapidly degraded — so we needed a way to directly ask the question at the protein level rather than continuing to infer it from DNA-level checks alone.

This experiment was designed to answer that directly: once expression is induced, can we actually detect the fusion protein construct in the bacterial lysate, and does it come down cleanly when pulled out using an antibody against its His-tag? We used a C-terminal (or N-terminal,) His-tag on the construct specifically so we'd have a reliable, generic detection handle — since no off-the-shelf antibody exists against a custom fusion protein like ours, tagging it with a well-characterized epitope was the practical way to make it detectable at all. More specifically, we wanted to know whether the pulldown recovered a protein of the expected molecular weight for the full-length construct, and whether that signal was present only in induced samples and absent in uninduced controls — which would confirm the signal was genuinely coming from our construct and not from background binding.

### Experimental Design and Rationale

We chose an anti-His pulldown (immunoprecipitation using antibody-coated beads specific to the His-tag) over a more general total-protein stain because we needed to specifically enrich for and identify our construct out of the full complexity of the bacterial proteome, rather than simply confirming that "some protein" was present in the lysate. Anti-His pulldown lets the tag do the work of selecting our protein of interest out of everything else the cell is making, which is essential given that the fusion protein wasn't expected to be highly abundant relative to native bacterial proteins.

Running the pulldown eluate on SDS-PAGE afterward lets us check the recovered protein against its predicted molecular weight — calculated from the combined size of the MS2 domains, linker, translocation peptide repeats, and His-tag — giving us a size-based check on top of the tag-based selectivity of the pulldown itself. Including both induced and uninduced culture samples was essential to the design, since it's the comparison between the two, not the induced sample alone, that tells us whether any band we see is actually attributable to our construct.

### Materials and Reagents

- Confirmed bacterial culture carrying the fusion protein construct (from Experiment 4's glycerol stock)
- Inducer for protein expression
- Lysis buffer
- Anti-His antibody-coupled beads (magnetic or agarose)
- Wash buffer(s) for the pulldown
- Elution buffer (or SDS sample buffer for direct elution into loading buffer)
- SDS-PAGE gel, running buffer, and protein molecular weight ladder
- Coomassie stain or, if used, anti-His antibody for Western blot detection
- Centrifuge (for clarifying lysate and bead washing steps)

### Method

1. **Grow and induce cultures.** Grow the confirmed bacterial strain to a defined growth phase, then split into induced and uninduced conditions, adding inducer to the induced sample only.
2. **Incubate under induction conditions** for the defined temperature and duration to allow expression of the fusion protein.
3. **Harvest and lyse cells** from both induced and uninduced cultures, using a lysis method gentle enough to preserve protein structure while releasing intracellular contents.
4. **Clarify the lysate** by centrifugation to remove cell debris, retaining the soluble fraction for pulldown.
5. **Incubate the lysate with anti-His beads**, allowing the antibody to bind any His-tagged protein present in the sample.
6. **Wash the beads** repeatedly to remove non-specifically bound proteins, leaving only proteins genuinely retained through the His-tag interaction.
7. **Elute the bound protein** from the beads, either by competitive elution or by direct boiling in SDS sample buffer.
8. **Run eluates from both induced and uninduced samples on SDS-PAGE**, alongside a molecular weight ladder.
9. **Visualize** the gel by Coomassie staining or, if used, transfer for anti-His Western blotting to confirm the identity of the band.

### Controls and Replicates

The uninduced culture, taken through the identical lysis and pulldown procedure, served as our essential negative control — any band appearing in the induced sample but absent in the uninduced one can be attributed specifically to expression of our construct rather than to background binding of native bacterial proteins to the anti-His beads.

### What We Expected

We expected the induced sample to show a distinct band at the predicted molecular weight for the full-length fusion construct, either by Coomassie staining or anti-His Western blot, while the uninduced sample should show either no comparable band or only a very faint one attributable to basal, un-induced expression. A band present but at a lower molecular weight than predicted would suggest degradation or premature truncation of the protein, while the complete absence of any specific band, even under induction, would point toward an expression problem upstream of the pulldown itself — either of which would need to be resolved before we could trust downstream experiments that assume a full, intact fusion protein is being made.

*(Results and their interpretation are presented separately on our Results page.)*
