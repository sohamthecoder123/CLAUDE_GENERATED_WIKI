import { WikiPage, P, H3, type WikiSection } from "../components/WikiPage";

/* Biosafety — the team's own text only, in two sections. */

const SECTIONS: WikiSection[] = [
  {
    id: "gmo",
    title: "Working With Genetically Modified Organism",
    nav: "Working With GMO",
    band: "mist",
    body: (
      <>
        <P>Working with a genetically engineered organism carries responsibilities. In India, it means operating within a specific legal and regulatory structure.</P>
        <P>Genetically engineered organisms in India are governed under the Rules for the Manufacture, Use, Import, Export and Storage of Hazardous Microorganisms, Genetically Engineered Organisms or Cells, 1989, established under the Environment Protection Act of 1986 . This framework operates through a hierarchy of committees, each with a distinct scope. At the institutional level, the Institutional Biosafety Committee (IBSC), comprising institutional leadership, scientists conducting the research, a medical doctor, and a Department of Biotechnology representative is the "nodal point" for biosafety implementation. Above the institutional level, the Review Committee on Genetic Manipulation (RCGM) monitors ongoing research safety and develops procedural guidelines, while the Genetic Engineering Appraisal Committee (GEAC), the apex authority under the Ministry of Environment, Forest and Climate Change is the body that would need to approve any large-scale activity or environmental release, with State Biotechnology Coordination Committees and District Level Committees monitoring implementation locally.</P>
        <P>For MOSKATEER, this means our current lab-stage work with engineered E. coli DH5α (and, prospectively, Asaia bogorensis) falls under our institution's IBSC oversight, consistent with the biosafety training and institutional practice already described. Any future step toward an environmental release, actually introducing engineered Asaia into a wild mosquito population would require RCGM review and GEAC approval, a multi-year regulatory process.</P>
        <H3>Looking Ahead: Ecological Risk and Community Engagement</H3>
        <P>We are explicit that questions of ecological risk assessment, effects on non-target species, unintended spread beyond a treated area, long-term persistence of Asaia in a wild population have not been formally addressed yet, because they only become relevant once a project moves toward the RCGM/GEAC approval process for environmental release, a stage MOSKATEER has not reached. When and if that stage is reached, we recognize that regulatory approval alone would not be sufficient: releasing an engineered organism into a shared environment also raises questions of community consent and public communication, particularly in the regions where malaria burden is highest, which is part of why we consider Human Practices engagement (with clinicians, and eventually with affected communities and regulators) inseparable from the technical development of the project.</P>
      </>
    ),
  },
  {
    id: "safety-security",
    title: "Safety and Security",
    band: "paper",
    body: (
      <>
        <P>MOSKATEER works with living, self-replicating organisms designed to spread through a wild population. This page walks through the risks specific to our project, how we're addressing them, and the safety features built into MOSKATEER's design, alongside our compliance with iGEM's Safety Policies and India's biosafety regulatory framework.</P>
        <H3>Biological Risks</H3>
        <P><b>Chassis pathogenicity.</b> Our lab-stage work uses engineered E. coli DH5α, a standard, well-characterized, non-pathogenic cloning strain with no significant capacity to colonize or harm humans. Our prospective field chassis, Asaia bogorensis, is a naturally occurring, non-pathogenic bacterium already found colonizing the gut, salivary glands, and reproductive organs of wild mosquitoes.</P>
        <P><b>Environmental and off-target impact.</b> Because mosGILT silencing is Anopheles-specific at the sequence level, the RNAi cargo is not expected to have activity against non-target insects, humans, or other organisms. The delivery mechanism itself, the MS2/translocation-peptide fusion construct, is not toxic and functions purely as a carrier, which distinguishes our approach from insecticide-based vector control from a biological-risk standpoint.</P>
        <P><b>Containment by design.</b> Because the engineered element lives in a bacterium rather than in the mosquito's own genome, containment can, in principle, be exercised by controlling the bacterial population, culturing conditions, physical isolation, and standard disposal, rather than by trying to reverse a change already integrated into a wild organism's DNA. This is one of the reasons we chose paratransgenesis and RNAi over a genomic gene-drive approach in the first place.</P>
        <H3>Disposal and Waste Handling</H3>
        <P>All engineered bacterial cultures and associated material are disposed of through OLSEH's segregated biological waste streams, ensuring that no engineered organism leaves the laboratory except through a controlled, documented disposal process.</P>
      </>
    ),
  },
];

export function Safety() {
  return <WikiPage slug="safety" title="Biosafety" sections={SECTIONS} />;
}
