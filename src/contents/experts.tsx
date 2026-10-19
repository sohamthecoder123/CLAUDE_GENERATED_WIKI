import { P, H3, List } from "../components/WikiPage";
import cp1 from "../assets/experts/common-people-1.jpg";
import cl3 from "../assets/experts/clinicians-3.jpg";

/*
 * Interactions with Experts and stakeholders. The text is the team's, as sent:
 * wording, spelling and punctuation are kept exactly. Four separate voices, each
 * under its own heading with a rule between them.
 */

const Sub = ({ children }: { children: string }) => <h5 className="ex-sub" data-reveal>{children}</h5>;
const Photo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="wk-photos" data-reveal>
    <img src={src} alt={alt} loading="lazy" />
  </div>
);
const Break = () => <hr className="ex-break" />;

export const EXPERTS = (
  <>
    <H3>Interacting with Common People</H3>
    <P>
      Malaria control depends on people as much as on technology, so we went out to ask ordinary people what they know about malaria and what they see being done about it. Malaria remains a public health concern in India, and measures such as spraying, bed nets and clearing stagnant water only work if communities see them, accept them and use them.
    </P>
    <P>
      Members of our team spent time in different localities speaking with a wide range of people. Rather than starting from the literature, we wanted to start by listening: how aware are people, how often do they encounter vector-control activity, and how do they feel about it?
    </P>
    <P>
      This post documents what we heard, one question at a time, in the order we asked them. It also reflects honestly on what these conversations can and cannot tell us.
    </P>
    <Photo src={cp1} alt="Two team members with a man in a black cap outside a building" />

    <Sub>How we went about it</Sub>
    <P>
      We spoke informally with people from many walks of life, asking the same short set of questions in each conversation. Our respondents included street vendors, chemists, pharmacists, receptionists, passers-by, working professionals in technology, college graduates and university students from different backgrounds. We also spoke with children as young as seven.
    </P>
    <P>
      We deliberately mixed ages, occupations and localities, because awareness of a public health issue is rarely uniform. Chemists and pharmacists were asked one additional question, since they see the medicine side of the story.
    </P>
    <P>
      The questions, in the order we asked them:
    </P>
    <List
      ordered
      items={[
        "How regularly do you see people spraying insecticide around your colony, workplace and home?",
        "When the spray enters your space, does it make breathing difficult or give you a headache?",
        "(Chemists and pharmacists) Have you noticed a difference in the number of people asking for malaria drugs?",
        "What do you commonly do to curb the spread of mosquitoes?",
        "Have you, or anyone in your close circle, ever been affected by malaria?",
      ]}
    />
    <P>
      The sections below follow this order.
    </P>

    <Sub>1. How often does the spray team come?</Sub>
    <P>
      The honest answer is that it depends on where you live. Some respondents told us that staff from the municipal corporation arrive wearing masks, but how often they come varied widely: some reported weekly visits, others fortnightly or monthly, and some only once a year. A few people said they had never seen spraying in their entire lifetime.
    </P>
    <P>
      We read this as two separate concerns. The first is irregularity on the part of the government bodies responsible for spraying. The second is inequality between localities, since neighbourhoods reported very different experiences.
    </P>
    <P>
      This led naturally to our next question: what happens when the spray does arrive?
    </P>

    <Sub>2. What happens when the spray arrives?</Sub>
    <P>
      Responses were again mixed, ranging from no effect at all to serious illness. Some respondents said they were not bothered and that the spray felt entirely normal. Others described severe headaches after the spray team passed through their locality, and a few said they were bed-ridden for several days.
    </P>
    <P>
      Perception of harm matters, because people who associate spraying with illness may avoid it or resist it. From conversations alone we cannot say what caused these reactions. Possible factors include how close people were to the spray, how well ventilated their homes were, individual sensitivity and the chemical used, none of which we measured.
    </P>
    <P>
      Together, the first two questions describe vector control that is delivered inconsistently and tolerated inconsistently. We then turned to the other side of the story: treatment.
    </P>

    <Sub>3. What do chemists and pharmacists see?</Sub>
    <P>
      The answer from chemists and pharmacists surprised us, because it was about supply, not demand. We had hoped to learn whether more people were asking for malaria drugs. Instead they told us that these medicines are mostly distributed through government hospitals or a limited number of private outlets, and that most people in India obtain them at subsidised rates, so cost is not a barrier.
    </P>
    <P>
      To our understanding, this fits with malaria diagnosis and treatment being offered through public health facilities under the national programme. It also means that retail pharmacies are probably a poor window into how many people are falling ill with malaria. We could not use these conversations to judge whether cases are rising or falling.
    </P>
    <P>
      Having heard from the people who dispense treatment, we asked the general public what they do to prevent the disease.
    </P>

    <Sub>4. What do people do to keep mosquitoes away?</Sub>
    <P>
      Across every age group, from young children to older adults, people were familiar with the standard precautions. They named bed nets, mosquito sprays and avoiding stagnant water in and around their homes. Many credited the government for this knowledge, saying that awareness messages are repeated regularly and more often during the monsoon season.
    </P>
    <P>
      By their account, education about precautionary measures has reached widely across the country. That is encouraging, and the consistency of answers from seven-year-olds to older adults was striking. We note, however, that what people say they know is not the same as what they do, and we did not observe practices directly.
    </P>
    <P>
      We closed with the most personal question: has malaria actually touched their lives?
    </P>

    <Sub>5. Has malaria touched their lives?</Sub>
    <P>
      None of the people we spoke to, and none of their relatives, had ever been affected by malaria. This was one of our most consistent findings, and also one of the hardest to interpret.
    </P>
    <P>
      It could mean that prevention and treatment are working well in the areas we visited. It could equally mean that these localities have low malaria transmission to begin with. To our understanding, malaria in India is not evenly spread but concentrated in certain regions, so where we asked shapes what we found. When nobody in your circle has had the disease, high awareness comes more easily and may not reflect an everyday sense of risk.
    </P>

    <Sub>What the conversations add up to</Sub>
    <P>
      Put together, the conversations describe a public that knows what to do about malaria but rarely meets it, and that experiences vector control unevenly.
    </P>

    <Break />

    <H3>Interacting with Health Care Professionals</H3>
    <P>
      After listening to people on the street, we wanted to hear from the professionals who diagnose and treat patients. Street conversations told us what the public knows and sees, but they could not tell us how often malaria actually reaches a clinic. So we turned to doctors.
    </P>
    <Photo src={cl3} alt="Two team members with a grey-haired man in a blue shirt" />
    <P>
      We consulted a couple of doctors who work in private clinics. We put one broad question to them: what is the malaria situation right now in places like Bengaluru?
    </P>

    <Sub>Malaria cases are now few in Bengaluru</Sub>
    <P>
      The doctors told us that they have seen very few malaria cases recently. This was the starting point of every conversation, and it was stated plainly: the disease is not something they come across often in their clinics.
    </P>
    <P>
      For doctors in busy private practice, who see a steady flow of patients with fever and other common complaints, this is a meaningful observation. It suggests that, at least in the parts of the city they serve, malaria has largely faded from everyday clinical experience.
    </P>

    <Sub>Malaria has declined steeply and is now localised</Sub>
    <P>
      According to the doctors, most malaria cases in India are now localised to coastal regions, and the disease has declined steeply over the decades. In their account, malaria has shifted from being a familiar illness in many places to one confined to particular areas.
    </P>
    <P>
      On this view, a city like Bengaluru, away from those areas, sees very little of it. We return to the point about coastal regions later in this post, because it deserves to be checked against national data before it is repeated as fact.
    </P>

    <Sub>Doctors stopped prescribing malaria drugs long ago</Sub>
    <P>
      Most of the doctors we spoke to have stopped prescribing malaria-related medicines altogether. What surprised us was the timescale: they said this is not a recent change but has been the case for about two decades in cities like Bengaluru.
    </P>
    <P>
      It means the quiet disappearance of malaria from everyday clinical practice is a long-standing trend, not a recent dip. It also echoes what chemists and pharmacists told us on the street, that malaria drugs are not something most outlets deal with, since distribution is largely through government hospitals and a limited number of private places.
    </P>

    <Sub>The Doctors credit awareness</Sub>
    <P>
      When we asked why malaria has become so uncommon, the doctors named one major factor: awareness. They said people are bitten far less by mosquitoes nowadays because of the safety and precautionary measures they follow. Malaria spreads through the bite of an infected mosquito, so fewer bites mean fewer infections. The precautions the doctors had in mind are the same ones people described to us on the street: bed nets, mosquito sprays and avoiding stagnant water in and around the home.
    </P>

    <Break />

    <H3>Interview with Rashi Bhavsar, Founder, Algaevity</H3>
    <P>
      We consulted Rashi on the practical realism of our sugar-trap design. She was blunt that controlled lab conditions rarely survive contact with the field,the sweat mimics we'd earlier been considering as an attractant, however well they perform on a bench, are essentially useless once deployed, because nothing artificial competes with an actual human as a mosquito's preferred target. This directly validated our decision to move away from sweat-based mimics toward acetoin and sulcatone as our attractants of choice, and pushed us to be far more conservative in our own expectations: she specifically asked us to assume that only a small percentage of the wild mosquito population would ever interact with a single trap, a constraint we now build into how we think about the horizontal and vertical spread mechanism doing the heavier lifting beyond the trap itself, rather than assuming the trap alone drives population-level impact.
    </P>

    <Break />

    <H3>Interview with Dr. Kavita Iswaran</H3>
    <P>
      Dr. Iswaran raised concerns about the potential off-target ecological effects of introducing any genetically modified organism into the environment and was direct about the current regulatory reality. The release of genetically modified mosquitoes in India has been barred because of precisely these kinds of concerns. This conversation reinforced our decision to pursue paratransgenesis using a naturally occurring, BSL-1 organism (Asaia bogorensis) and a sequence-specific RNAi payload, rather than genetically modifying the mosquito itself. At the same time, Dr. Iswaran offered concrete support for the project going forward, agreeing to assist with future mosquito-behavior experiments using the Aedes culture available in her lab. This resource will be valuable as MOSKATEER’s behavioral and field-relevant testing develops
    </P>

    <Break />

    <H3>Interaction with Prof. Dileep Prabhakar Jatkar</H3>
    <P>
      Dileep Prabhakar Jatkar is a professor and dean in the School of Mathematics and Natural Sciences at Chanakya University. He has previously served as a Professor in Harish Chandra Research Institute, and is a theoretical physicist mainly involved in high energy physics.
    </P>
    <P>
      We caught up and struck a conversation after the Award Ceremony for YSC, and his interests seemed to overlap with a certain model I was building for MOSKATEER. I was stuck at a wall with the model not yielding physically meaningful results, and I asked him about it. He gave me various insights, but mainly pushed me to look beyond the parameters I was considering (Surface Energy , Bending Energy and Pressure Differences), and asked me to look for extra factors that could affect the process. This led me to couple Inner Membrane budding to Outer Membrane budding and obtain a slightly more meaningful model.
    </P>
  </>
);
