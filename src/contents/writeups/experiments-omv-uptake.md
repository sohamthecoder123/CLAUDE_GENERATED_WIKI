## Experiment 6: OMV Uptake and dsRNA Delivery into Epithelial Cells

### Introducing the Question

Every experiment so far confirmed that our bacterium carries the right construct and expresses the right fusion protein — but none of it actually tested the step our entire delivery mechanism hinges on: does the RNAi cargo ever actually get inside a host cell? Gram-negative bacteria naturally bud off outer membrane vesicles (OMVs) as part of normal physiology, and OMVs are a well-documented route by which bacteria can package and deliver cargo — including RNA — across a host cell membrane without needing the whole bacterium to invade the cell itself. Before we could treat OMV-mediated delivery as a credible mechanism for getting our *mosGILT*-silencing dsRNA into gut epithelial cells, we needed direct evidence that it was actually happening, rather than simply assuming it because the biology is plausible.

This experiment was designed to answer two connected but distinct questions, tested against a normal epithelial cell line as an accessible, tractable proxy for gut epithelium: first, are the OMVs produced by our engineered bacteria actually taken up by epithelial cells at all, rather than simply remaining outside and being washed away; and second, once uptake happens, is the dsRNA cargo itself detectable inside those cells, confirming that the OMV route actually delivers functional cargo rather than just attaching to the cell surface. Answering the first question without the second would leave us knowing the vesicles get in, but not knowing whether they're actually doing their job as a delivery vehicle.

### Experimental Design and Rationale

We split this into two linked assays rather than one, because uptake and cargo delivery are genuinely separate claims that each need their own evidence. For uptake, we labeled OMVs with a lipophilic fluorescent membrane dye before exposing them to the epithelial cell monolayer — since the dye incorporates into the OMV membrane itself, any fluorescent signal that ends up inside cells (rather than washed away with unbound vesicles) is a direct, visual readout of internalization, checked by confocal microscopy rather than inferred indirectly.

For dsRNA detection, we relied on the J2 monoclonal antibody, a well-established reagent in the RNAi and virology literature specifically raised against double-stranded RNA regardless of sequence, which let us detect the presence of dsRNA inside cells by immunofluorescence without needing to design a sequence-specific probe. Using an extracellular RNase treatment step before fixing and staining was essential to the design: it degrades any dsRNA that never actually made it inside the cell, so any signal that survives RNase treatment and is still detected inside the cell boundary can be attributed to genuinely internalized cargo, not surface-bound or extracellular contamination.

### Materials and Reagents

- Bacterial culture supernatant for OMV isolation
- Ultracentrifuge (or appropriate filtration/centrifugation setup for OMV purification)
- Lipophilic fluorescent membrane dye for OMV labeling
- Epithelial cell line, maintained under standard culture conditions
- Culture plates/chambers suitable for confocal imaging
- Extracellular RNase (to degrade non-internalized dsRNA before fixation)
- Fixation and permeabilization reagents
- J2 anti-dsRNA monoclonal antibody, plus appropriate fluorescently-labeled secondary antibody
- Nuclear counterstain (e.g. DAPI) for cell localization reference
- Confocal microscope

### Method

**Part A — OMV Uptake**

1. **Isolate OMVs** from bacterial culture supernatant using centrifugation-based purification, removing intact bacterial cells and debris before recovering the vesicle fraction.
2. **Label the OMVs** with a lipophilic fluorescent membrane dye, then remove unincorporated dye by washing/re-purification.
3. **Apply labeled OMVs to the epithelial cell monolayer** at a defined dose and incubate for a defined period to allow uptake to occur.
4. **Wash cells thoroughly** to remove unbound, extracellular OMVs before imaging.
5. **Image by confocal microscopy**, using optical sectioning to confirm that fluorescent signal is genuinely located inside the cell boundary rather than simply adhered to the outer membrane.

**Part B — dsRNA Delivery**

6. **Treat OMV-exposed cells with extracellular RNase** prior to fixation, degrading any dsRNA that remains outside the cell.
7. **Fix and permeabilize** the cells to allow antibody access to intracellular contents.
8. **Stain with J2 anti-dsRNA antibody**, followed by a fluorescently-labeled secondary antibody, alongside a nuclear counterstain.
9. **Image by confocal microscopy**, assessing whether dsRNA-specific signal is present inside cells that were exposed to OMVs.

### Controls and Replicates

Unlabeled OMVs (or dye alone, applied without OMVs) served as a control for the uptake assay, ruling out non-specific dye staining as the source of any intracellular signal. Cells not exposed to OMVs at all, taken through the same RNase treatment, fixation, and J2 staining procedure, served as the negative control for the dsRNA detection assay, establishing the baseline background signal (if any) against which OMV-exposed samples were compared.

### What We Expected

For Part A, we expected fluorescent signal from labeled OMVs to appear within the cell boundary in OMV-treated samples, confirmed by optical sectioning, while control samples (dye-only or unlabeled OMVs) should show no comparable intracellular signal. For Part B, we expected J2 antibody signal to be present specifically inside cells that had been exposed to OMVs and to survive the extracellular RNase treatment step, while unexposed control cells should show no meaningful dsRNA-specific signal. Seeing OMV uptake without corresponding dsRNA signal would suggest the vesicles enter cells but fail to release or protect their RNA cargo, which would point us toward re-examining how the dsRNA is packaged into the OMVs in the first place, rather than the uptake mechanism itself.

*(Results and their interpretation are presented separately on our Results page.)*
