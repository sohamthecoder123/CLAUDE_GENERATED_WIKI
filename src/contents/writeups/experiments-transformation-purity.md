## Experiment 2: Transformation of the Engineered Plasmid into *E. coli*

### Introducing the Question

Once our engineered plasmid — carrying the fusion protein construct — was in hand, the first practical question wasn't a scientific one so much as a logistical one: could we actually get a usable, growing population of cells carrying this exact plasmid, reliably enough to build every downstream experiment on top of it? Transformation is routine molecular biology, but "routine" doesn't mean guaranteed, especially with a construct assembled from several distinct functional pieces (the tandem MS2 domains, the flexible linker, the translocation peptide repeats) rather than a single simple gene — a larger, more complex insert can transform less efficiently than a small, well-behaved plasmid, and we needed to know early whether that was going to be a bottleneck.

So this experiment was less about testing a hypothesis and more about establishing a working foundation: transform the plasmid into a standard cloning strain of *E. coli*, confirm that colonies actually grow under selection, and confirm — before investing further time — that the colonies we picked genuinely carry our intended insert rather than an empty or re-ligated vector. More specifically, we wanted to know whether transformation efficiency was high enough to reliably give us multiple candidate colonies per attempt, and what fraction of those candidates would turn out to be true positives on screening.

### Experimental Design and Rationale

We used the heat-shock method for transformation rather than electroporation, since it doesn't require specialized equipment and is the standard, well-validated approach for routine plasmid transformation into chemically competent *E. coli*. Plating on antibiotic-selective media lets only cells that successfully took up the plasmid (and its resistance marker) survive and grow, which is what makes selective plating the first real checkpoint in the whole pipeline — any colony that appears has, at minimum, taken up a plasmid conferring resistance, even if it isn't necessarily the correct one.

Colony PCR was chosen as the screening step immediately after selection because it lets us check multiple candidate colonies for the presence of the correct insert quickly and without needing to first extract plasmid DNA from each one — a cheap filter before committing to a full miniprep on only the colonies that actually look promising.

### Materials and Reagents

- Chemically competent *E. coli*
- Engineered plasmid (purified, at a known concentration)
- LB broth (for recovery after heat shock)
- LB agar plates containing the appropriate selective antibiotic
- Antibiotic stock
- Sterile inoculation loops, spreaders, and PCR tubes
- Colony PCR reagents
- Incubator set to 37°C (standard for *E. coli*)
- Shaking incubator (for recovery step and later liquid cultures)

### Method

1. **Thaw competent cells** on ice, keeping them cold throughout handling to preserve competency.
2. **Add plasmid DNA** to the competent cells at a defined volume/concentration and mix gently — never vortex, to avoid damaging the cells.
3. **Incubate on ice** for to allow the DNA to associate with the cell membrane.
4. **Heat-shock** the cells at, then immediately return to ice.
5. **Recover** the cells by adding pre-warmed LB broth and incubating with shaking at 37°C for, allowing the antibiotic resistance gene to be expressed before selection.
6. **Plate** the recovered culture onto selective LB agar and incubate overnight at 37°C.
7. **Pick individual colonies** the following day and screen each by colony PCR to confirm the presence of the expected insert.
8. **Select confirmed positive colonies** for further growth, plasmid extraction, and long-term storage as glycerol stocks.

### Controls and Replicates

A no-DNA control (competent cells taken through the same heat-shock and plating procedure without any plasmid added) is essential here — if colonies appear on the selective plate for this control, it signals contamination or an issue with the selection itself, rather than genuine transformants.

### What We Expected

If transformation was efficient and the plasmid stable, we expected a reasonable number of colonies to appear on the selective plate, with a high proportion of those testing positive for the correct insert on colony PCR. A low colony count would point toward a transformation-efficiency problem — worth troubleshooting through competent cell quality or DNA concentration — while a high colony count paired with a low proportion of true positives would point instead toward a cloning-level issue (e.g., vector re-ligation) upstream of transformation itself, which is exactly the kind of ambiguity this screening step was designed to help us tell apart.

*(Results and their interpretation are presented separately on our Results page.)*

---

## Experiment 3: Verifying Plasmid Identity and Purity

### Introducing the Question

Getting a colony that survives antibiotic selection and even shows a PCR band of roughly the right size doesn't, by itself, guarantee we have exactly the plasmid we designed, cleanly enough to trust in every downstream experiment. PCR screening is a useful first filter, but it can't tell us whether the insert is the correct size across its full length, whether the vector backbone is intact, or whether the DNA we'd be using in later work is actually clean enough — free of contaminating protein, salts, or residual reagents from extraction — to give reliable results in more sensitive downstream applications. We needed a step that checked both of those things explicitly, rather than assuming a positive PCR result meant we were done.

This experiment was designed to answer two related but distinct questions at once: is the plasmid we extracted the correct size and structure (identity), and is the DNA sample itself clean enough to use reliably (purity)? More specifically, we wanted to know whether restriction digestion produced fragments matching our predicted digest pattern, and whether spectrophotometric absorbance ratios fell within the range expected for clean, protein- and salt-free plasmid DNA.

### Experimental Design and Rationale

We used restriction digestion followed by gel electrophoresis to confirm plasmid identity, since cutting the plasmid with enzymes at known recognition sites and comparing the resulting fragment sizes against our predicted digest map is a direct, visual way to catch both correct constructs and common failure modes (wrong insert size, missing insert, unexpected rearrangements) that a PCR band alone can miss.

For purity, we relied on spectrophotometric quantification (Nanodrop), specifically the A260/280 and A260/230 absorbance ratios, because these are the standard, fast way to flag protein contamination (A260/280) and contamination from salts, phenol, or other extraction reagents (A260/230) without needing to run a separate assay. Checking both identity and purity before moving forward meant that if a later experiment gave an unexpected result, we could be confident it wasn't simply because the plasmid itself was wrong or the DNA sample was dirty.

### Materials and Reagents

- Plasmid miniprep kit (or standard alkaline lysis miniprep reagents)
- Restriction enzyme(s) and appropriate reaction buffer
- Agarose (for gel electrophoresis) and appropriate running buffer (e.g., TAE)
- DNA ladder (molecular weight marker)
- Gel stain (e.g., a safe intercalating dye alternative to ethidium bromide, or ethidium bromide with appropriate handling precautions)
- Nanodrop spectrophotometer (or equivalent)
- Nuclease-free water for elution/dilution

### Method

1. **Grow a liquid culture** overnight from a confirmed positive colony (from Experiment 2) in selective LB broth at 37°C with shaking.
2. **Extract plasmid DNA** using a miniprep kit or standard alkaline lysis protocol, following the manufacturer's or lab's standard steps for cell lysis, neutralization, and DNA binding/elution.
3. **Quantify and assess purity** by loading the eluted DNA onto a Nanodrop spectrophotometer, recording concentration along with A260/280 and A260/230 ratios.
4. **Set up restriction digests** using the chosen enzyme(s) and appropriate buffer, incubating at the enzyme's recommended temperature (commonly 37°C) for the recommended duration.
5. **Run the digested samples on an agarose gel** alongside an undigested plasmid control and a molecular weight ladder.
6. **Compare the resulting band pattern** against the predicted digest map to confirm the plasmid's identity and structure.

### Controls and Replicates

An undigested plasmid sample run alongside the digests serves as a control, confirming that any banding pattern seen is genuinely a product of the restriction digest rather than an artifact of the plasmid's native supercoiled or nicked forms, which run differently on a gel than linearized DNA.

### What We Expected

For identity, we expected the digest to produce a band pattern matching our predicted fragment sizes exactly — any additional, missing, or shifted bands would indicate the plasmid did not match our intended design and needed to be re-examined (or discarded in favor of a different colony). For purity, we expected A260/280 ratios close to 1.8 (the accepted benchmark for protein-free DNA) and A260/230 ratios in the range typically considered free of salt or reagent contamination; values falling well outside these ranges would flag a sample as needing re-extraction before being trusted in downstream, more sensitive experiments.

*(Results and their interpretation are presented separately on our Results page.)*
