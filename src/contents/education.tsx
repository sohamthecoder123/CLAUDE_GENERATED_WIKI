import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { LowPoly } from "../components/LowPoly";
import { TitleArt } from "../components/TitleArt";
import "./education.css";

/*
 * Education page.
 *
 * The layout is a copy of the Ideation page, which is the one layout used
 * across the wiki: faceted hero, sticky navigator on the left, bands beneath
 * it. See wiki/ideation-page/LAYOUT-SPEC.md; do not re-derive the values.
 *
 * Only the content below changes. The prose is the team's own write-up,
 * carried word for word; nothing here paraphrases, shortens or re-titles it.
 * Every animation is skipped under prefers-reduced-motion.
 */

/** Facet colours shared by the hero and the navigator, as on Ideation. */
const HERO_COLORS = ["#0f4a3f", "#1d715f", "#2b7f6d", "#3f8a6a", "#4f8f74"];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Counts up to `to` the first time it scrolls into view. Used only to animate
 * figures that are already part of a sentence, never to add or alter wording.
 */
function CountUp({ to, text }: { to: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1000);
        setN(k < 1 ? to * (1 - Math.pow(1 - k, 3)) : null);
        if (k < 1) requestAnimationFrame(tick);
      };
      setN(0);
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span className="edu-count" ref={ref}>
      {n === null ? text : Math.round(n).toLocaleString("en-US")}
    </span>
  );
}

/** The write-up's paragraphs, in order, exactly as written. */
function Prose({ paras }: { paras: ReactNode[] }) {
  return <>{paras.map((p, i) => <p key={i}>{p}</p>)}</>;
}

const IGEM: ReactNode[] = [
  <>iGEM stands for the International Genetically Engineered Machine. It is a competition where students from all over the world, mostly undergraduates, although school students and graduate students take part too, get together in teams and try to solve a real problem using biology.</>,
  <>Every year, hundreds of teams from different countries pick a problem they are concerned about. It could be anything, a disease, a pollution issue, a gap in healthcare, a problem in farming; almost anything one could imagine. The team then spends months designing a solution using synthetic biology, which is, in other words, the science of redesigning living things, usually bacteria or other tiny organisms, to do a job they wouldn&rsquo;t naturally do. They plan it out, build it in the lab, test whether it actually works, and learn from what happens, and then they do this cycle again and again, improving their design each time. Along the way, teams also think and work on whether their idea is safe, ethical, and helpful to the people it&rsquo;s meant for, not just clever on paper. At the end of it all, every team travels to present their work at a big final event called the Grand Jamboree, where projects are judged, and medals and awards are given out.</>,
  <>Now, why does something like this actually matter? Because science, especially the kind done in professional labs, can sometimes feel very far away from students. iGEM flips that around, enabling students to solve something that they think really matters, using the actual methods real scientists use. That, we believe, is a very big deal.</>,
  <>Competitions like iGEM give the fearless thinking a real, structured place to go. And for a project like ours, this is exactly where it all began: A group of students choosing a problem worth solving, and deciding to actually go try and solve it.</>,
];

const MALARIA: ReactNode[] = [
  <>Malaria remains one of the oldest diseases known to humankind. Centuries ago, in Italy, people who lived near marshy, swampy land kept falling terribly sick, and they assumed it was the bad, foul-smelling air rising from the swamps that was making them ill. So they called it &ldquo;mal aria&rdquo;, meaning literally, &ldquo;bad air&rdquo;, and the name stuck, even though the swamps themselves were never really the problem. Ancient physicians in China, Egypt, and Greece all wrote about the same kind of illness thousands of years ago: sudden fevers that came and went in cycles. For most of human history, nobody knew what was actually causing it. People just knew it came from somewhere near water, and that it could take a person&rsquo;s life without warning.</>,
  <>Long before anyone understood the cause, people in South America had already stumbled onto a cure, without knowing exactly why it worked. Indigenous communities in the Andes had discovered that the bark of a particular tree, later named the cinchona tree, could bring fevers like these under control. Spanish colonists and missionaries carried this knowledge back to Europe in the 1600s, and cinchona bark slowly became the go-to remedy for malarial fevers across the continent, centuries before the disease itself was understood at all. It wasn&rsquo;t until 1820 that French chemists managed to isolate the actual active compound inside the bark responsible for the effect, a substance they named quinine turning a folk remedy into something that could be purified, dosed, and eventually mass-produced.</>,
  <>It took until the late 1800s for anyone to actually find the real culprit behind the disease, and when they did, the answer surprised everyone. In 1880, a French army doctor named Charles Louis Alphonse Laveran, working in Algeria, looked at the blood of a feverish patient under a microscope and spotted something moving, a tiny, single-celled parasite, living and multiplying inside human blood. It was the first time anyone had actually seen the cause of malaria with their own eyes, and the discovery eventually earned Laveran the Nobel Prize in Physiology or Medicine in 1907. But finding the parasite still left a mystery unsolved: how was it actually getting from one person to another? That answer came almost two decades later, in 1897, when a British medical officer named Ronald Ross, working in India, dissected the stomach of a mosquito that had fed on a malaria patient and found the parasite developing inside it. Ross had found the missing link, the mosquito wasn&rsquo;t just an annoyance, it was the vehicle carrying the disease from person to person and his discovery won him the Nobel Prize in 1902, making Ross and Laveran two of the earliest Nobel laureates in medicine, both for cracking open the same disease from two different angles.</>,
  <>Once the mosquito&rsquo;s role was understood, the fight against malaria shifted from treating symptoms to attacking the transmission cycle itself: draining swamps, using insecticides, and later, in the mid-1900s, launching large global eradication campaigns that used the pesticide called DDT (Dichlorodiphenyltrichloroethane) to knock down mosquito populations across many parts of the world. Those campaigns succeeded in eliminating malaria from many countries, but they didn&rsquo;t finish the job everywhere, particularly across much of Africa, where the disease held on stubbornly. Even the medicines kept evolving: in the 1970s, a Chinese scientist; Tu Youyou, digging through centuries-old traditional Chinese medical texts, rediscovered a plant called sweet wormwood as a treatment for fevers, and went on to isolate its active compound, artemisinin, a discovery that eventually won her the 2015 Nobel Prize in Physiology or Medicine and remains, to this day, the backbone of the most effective malaria treatments used worldwide.</>,
  <>So by the time we get to today, malaria carries an unusually long paper trail behind it: a disease named after a wrong guess, cured for centuries by a bark nobody understood, finally explained by two scientists chasing two different halves of the same puzzle, and still being fought with a medicine rediscovered from an ancient text. And despite everything science has learned across all these centuries, malaria is still very much alive today, which is exactly where MOSKATEER&rsquo;s own part of this very long story begins.</>,
];

const LIFE_CYCLE: ReactNode[] = [
  <>Now that we know where malaria came from and how it was finally understood, it&rsquo;s worth walking through exactly how it actually spreads.</>,
  <>The story begins with a female Anopheles mosquito, only the females bite, because they need a blood meal to develop their eggs. As she feeds, she draws up parasites along with the blood she takes in. Over the next week or two, inside the mosquito&rsquo;s gut, the parasites go through several changes, multiplying and transforming into a new form, before finally migrating to the mosquito&rsquo;s salivary glands, the place they need to reach if they&rsquo;re ever going to infect someone new.</>,
  <>The next time that same mosquito bites another person, it doesn&rsquo;t just draw blood out, it injects a small amount of saliva first, to keep the blood from clotting while she feeds. It&rsquo;s from that saliva that the parasites slip into a new person&rsquo;s bloodstream. From there, the parasites don&rsquo;t head straight for the blood. They travel first to the liver, where they quietly invade liver cells and multiply for several days, hidden away and causing no symptoms at all, which is part of what makes malaria so hard to detect early, since a newly infected person can feel perfectly fine during this stage.</>,
  <>Eventually, the parasites burst out of the liver cells in huge numbers and pour into the bloodstream, where they invade red blood cells. Inside each RBC, the parasite grows, multiplies, and eventually bursts the cell open to release even more parasites, which go on to invade fresh red blood cells all over again. It&rsquo;s this repeating cycle &mdash; invade, multiply, burst, invade again that produces the classic symptoms malaria is known for. If nothing intervenes, the disease can escalate quickly, especially in young children and people who&rsquo;ve never been exposed before, sometimes becoming fatal within days.</>,
  <>While most of the parasites in the blood are busy invading and bursting red blood cells, a smaller fraction of them develop into a different form, one built not to cause illness, but to survive inside a mosquito. If another Anopheles mosquito happens to bite this same infected person and picks up some of these specialized parasites along with her blood meal, the entire cycle starts over again inside her body, and she becomes capable of infecting someone new.</>,
  <>This is what makes malaria so persistent in places where the conditions are right: warm climates, standing water for mosquitoes to breed in, and communities where mosquitoes and humans are in constant, close contact. Every bite from an infected mosquito can start the cycle over in another person, which is exactly why stopping malaria has never just been about treating people who are already sick, it is also about finding a way to break the chain somewhere in this loop, whether that means the mosquito, the parasite, or the exact moment of transmission itself. And that, in the simplest possible terms, is the problem MOSKATEER aims to interrupt.</>,
];

const ONE_HEALTH: ReactNode[] = [
  <>When people hear &ldquo;mosquito control,&rdquo; they usually picture something simple: mosquitoes spread malaria, so get rid of the mosquitoes. But mosquitoes don&rsquo;t live on their own. They bite people, they bite cows and goats, they breed in the same ponds that farms drain into, and they&rsquo;re food for other animals too. Change one thing and something else shifts. That&rsquo;s the idea behind what scientists call One Health: the health of people, animals and the environment are linked, so you can&rsquo;t really fix one without thinking about the other two.</>,
  <>Not every Anopheles mosquito cares about human blood equally. Some prefer people, but others are happy to feed on cattle if there are cattle nearby. So if your tool only targets mosquitoes that come inside houses, you can miss the ones that feed outdoors on livestock. And in parts of Southeast Asia there&rsquo;s a malaria parasite called Plasmodium knowlesi that normally lives in macaque monkeys and sometimes jumps to humans through mosquito bites. In those places the animals aren&rsquo;t just bystanders, they&rsquo;re part of how the disease travels.</>,
  <>Then there&rsquo;s what we&rsquo;ve done to the environment trying to fight mosquitoes. DDT is the classic example. It worked really well against mosquitoes in the mid-1900s, but there was a problem- it didn&rsquo;t break down quickly, and it built up in food chains. It was linked to birds of prey laying eggs with thin shells, which is one big reason it was eventually restricted. Even now, pesticides sprayed on crops wash into the same puddles and ponds where mosquito larvae grow. The larvae get a small dose of chemical over and over, which helps them become resistant, and meanwhile fish, frogs and harmless insects in that water are harmed too. So the way we farm can quietly make malaria harder to control.</>,
  <>How we use land matters as well. Dams, irrigation channels, rice fields and cleared forest all create standing water, and standing water is exactly what Anopheles looks for. Even bed nets, which have saved a huge number of lives, have an unintended drawback: in some communities people reuse them as fishing nets, and the insecticide on them ends up in the water.</>,
  <>Lastly, mosquitoes are a part of the ecosystem too. Their larvae are eaten by fish, and adults get eaten by bats, birds and dragonflies. Most researchers think removing one malaria-carrying species wouldn&rsquo;t collapse anything, since most mosquito species don&rsquo;t spread malaria and other animals can take up the slack. But &ldquo;probably fine&rdquo; isn&rsquo;t a guarantee, and it&rsquo;s something we need to take seriously when we design anything that affects wild mosquito populations.</>,
  <>So the question for any mosquito control idea shouldn&rsquo;t just be &ldquo;does it work on mosquitoes?&rdquo; It should also be what happens to the people, animals and places around it.</>,
];

const SYNBIO: ReactNode[] = [
  <>Imagine you&rsquo;re an engineer, but instead of building with metal, plastic, or circuits, you build with the actual machinery of life, namely genes, proteins, and the tiny cellular systems that make living things work. That, to put simply, is what synthetic biology is. It&rsquo;s a field that takes the mindset of engineering &mdash; take something apart, understand each piece, redesign it, and rebuild it to do a specific job.</>,
  <>For most of the history of biology, scientists were mainly in the business of understanding living things as they already exist, mainly interested in how a cell works, how a gene gets switched on, how a protein folds into its shape. Synthetic biology asks a different kind of question. Instead of just asking &ldquo;how does this work,&rdquo; it asks &ldquo;now that we understand how this works, can we redesign it to do something new?&rdquo;</>,
  <>The basic idea rests on treating pieces of DNA almost like standardized parts. A gene that makes a cell glow, a genetic &ldquo;switch&rdquo; that turns a process on or off in response to some signal, a piece of DNA that tells a cell to produce a particular protein. Each of these can be thought of as a modular part, something you can combine with other parts to build a larger system inside a living cell.</>,
  <>What makes synthetic biology especially powerful is the sheer range of problems it can be used to solve. A bacterium doesn&rsquo;t naturally know how to interfere with a mosquito&rsquo;s fertility, or clean up an oil spill, or manufacture a specific drug, but with the right genetic parts engineered into it, it can be redirected to do exactly that. That&rsquo;s the real promise of the field: synthetic biology borrows life&rsquo;s own toolkit and redirects a small piece of it toward a problem humans actually need solved.</>,
  <>MOSKATEER, at its core, is exactly this kind of project: taking a naturally occurring bacterium and giving it a very specific, engineered job to do, in service of a problem Malaria that has resisted simpler solutions for far too long.</>,
];

const ENGINEERING_PARTS: ReactNode[] = [
  <>A promoter, which acts like an &ldquo;on switch&rdquo; telling the cell when to start reading a gene;</>,
  <>The gene itself, which carries the actual instructions for building a specific protein; and often a few other regulatory pieces that fine-tune exactly how much of that protein gets made, and under what conditions.</>,
];

const ENGINEERING_REST: ReactNode[] = [
  <>Once the design exists on paper, the next step is actually building it, usually assembled in a lab using enzymes that can cut and join DNA fragments together with precision, stitching the different parts of the design into one continuous sequence. This finished piece of engineered DNA is typically carried on a plasmid, a small, circular loop of DNA separate from the bacterium&rsquo;s own main chromosome.</>,
  <>Getting that plasmid into the bacterium is called transformation. Bacterial cells don&rsquo;t normally let foreign DNA in. So scientists have to coax them into a temporarily more permeable state, often using one of the methods called heat-shock, wherein the cells are chilled, mixed with the plasmid DNA, then briefly exposed to a sudden rise in temperature that creates small, temporary openings in the cell membrane just long enough for the plasmid to slip inside. Not every cell in the population takes up the DNA successfully, which is why the next step is screening: growing the treated bacteria on a plate containing an antibiotic that only cells carrying the plasmid can survive, since the plasmid itself usually carries a resistance gene as a marker.</>,
  <>From there, the cell&rsquo;s own machinery reads the engineered gene and manufactures the protein it codes for, the same way it would with any of its own native genes.</>,
];

const BIOSAFETY: ReactNode[] = [
  <>Whenever you&rsquo;re working with living organisms in a lab, especially organisms that have been genetically modified, there has to be some way of deciding how careful you actually need to be. Not every experiment carries the same amount of risk. So scientists came up with a simple system to sort this out: biosafety levels, usually just called BSL, numbered from 1 to 4, where the number tells you how much risk the organism you&rsquo;re working with actually poses, and therefore how much protection the lab needs to have in place.</>,
  <>At the very bottom is BSL-1, the level used for organisms that are well understood, don&rsquo;t cause disease in healthy people, and are already commonly used in teaching and basic research labs. Stepping up to BSL-2, and you&rsquo;re working with organisms that could cause moderate illness if something went wrong. Thus, BSL-2 labs add things like restricted access, more careful waste disposal, and safety cabinets for any step that could create airborne particles.</>,
  <>Climbing further up to BSL-3, and now you&rsquo;re dealing with organisms that can cause serious or even fatal disease, but ones for which treatments usually exist so the lab itself becomes a much more controlled space, with specialized ventilation that keeps air flowing inward rather than out, sealed windows, and researchers wearing more protective gear before they even enter. And at the very top, BSL-4, you&rsquo;re in the realm of the most dangerous pathogens known with no reliable treatment or vaccine. Full-body positive-pressure suits, completely sealed facilities, and an amount of institutional oversight makes BSL-4 labs some of the most tightly controlled spaces in all of science, of which there are only a small number in the entire world.</>,
  <>Most synthetic biology work including ours happens at the lower end of that scale, usually BSL-1 or BSL-2, using well-characterized lab strains of bacteria that aren&rsquo;t dangerous to begin with. But, synthetic biology adds its own extra layer of thinking on top of the standard biosafety ladder, because we&rsquo;re not just handling an organism as it naturally exists, you&rsquo;re deliberately changing what it can do. That means a project has to ask a slightly different set of questions alongside the standard biosafety checklist: could the new trait we&rsquo;ve engineered into this organism make it more likely to survive somewhere it shouldn&rsquo;t? could it transfer to another organism unintentionally? and have we built in any safeguards? &mdash; containment strategies, kill switches, dependency on lab-only conditions that stops the engineered function from becoming a problem outside the lab, even if the original organism itself was never dangerous to begin with.</>,
  <>This is exactly the kind of thinking every iGEM project, ours included, is expected to work through carefully, not merely adhering to the appropriate biosafety level for our chassis organism, which we do, but genuinely sitting with the harder question underneath it: what happens if this engineered system ever left the lab? Have we designed the system responsibly enough that the answer to that question is reassuring rather than worrying?</>,
];

const SUGAR_TRAP: ReactNode[] = [
  <>The utilization of insecticide treated nets as well as spraying of the insecticides can reduce the number of mosquitoes, however, the development of insecticide resistance and also reaching large numbers of mosquitoes has been a challenge which has encouraged researchers to seek out other means.</>,
  <>One of the alternatives is the sugar trap which does not involve attracting and killing mosquitoes but it involves delivery of the engineered bacterium to the mosquito population. The engineered bacterium interferes with the reproduction process in mosquitoes.</>,
  <>In the case of MOSKATEER, the components of the trap have acetoin and sulcatone, which are used to attract mosquitoes and are effective.</>,
  <>The sugar solution acts as a source of food for the mosquitoes, which increases the chances of their interaction with the trap. It has Asaia bogorensis, a bacterium that colonises parts of the mosquito&rsquo;s body.</>,
  <>Unlike a conventional mosquito trap whose primary purpose is to capture or kill its target, the sugar trap in MOSKATEER is designed primarily for biological delivery.</>,
  <>The sugar trap is meant to be cost effective, large scale and needing little infrastructural support. Its success depends on parameters such as mosquito attraction, bacterial survival, successful RNA delivery and reproductive suppression.</>,
];

/* The two sections whose wording carries inline figures or a lead-in list. */

const STILL_KILLING = (
  <>
    <p>
      Given everything we now know about malaria, a parasite first observed under a microscope in
      1880, a transmission cycle elucidated out by 1897, treatments refined for over a century, and
      entire global eradication campaigns launched in the decades that followed - you&rsquo;d be
      forgiven for assuming this is a disease humanity has already solved. It isn&rsquo;t.
    </p>
    <p>
      According to the World Health Organization&rsquo;s most recent global data, malaria caused
      around <CountUp to={282} text="282" /> million cases and{" "}
      <CountUp to={610000} text="610,000" /> deaths in a single year, with the overwhelming
      majority of both roughly <CountUp to={94} text="94" />% of cases and{" "}
      <CountUp to={95} text="95" />% of deaths concentrated in Africa. And worse, that case number
      isn&rsquo;t falling. It&rsquo;s climbing: from about 230 million cases in 2015, up to 273
      million in 2023, and higher still after that.
    </p>
    <p>
      To understand why malaria keeps finding new footing despite all the existing medical
      interventions, it becomes important to look at a handful of very specific ways the disease
      has kept adapting just as fast as we have.
    </p>
    <p>
      One of the crucial factors explaining this, is the resistance occurring at 2 fronts. On one
      hand, the mosquitoes themselves are becoming harder to kill. Resistance to the insecticides
      used in bed nets and indoor spraying. On the other side, the parasite itself is starting to
      slip past our best medicines too. Partial resistance to artemisinin, has now been detected
      spreading across parts of Africa. When both the mosquito and the parasite start finding ways
      around our two most important tools at the same time, the ground we had gained starts eroding
      from underneath us. Adding to this, the disruptions caused by climate change, which is
      shifting rainfall and temperature patterns into new areas in ways that can expand where
      mosquitoes can survive and breed.
    </p>
    <p>
      A disease we&rsquo;ve technically understood for over a century is still, in practical terms,
      winning in large parts of the world and is thus difficult to tackle.
    </p>
  </>
);

const ENGINEERING = (
  <>
    <p>
      It starts with designing the genetic construct on paper, deciding exactly what pieces of DNA
      need to go into the bacterium, and in what order. A working genetic system is usually made up
      of several distinct parts working together:
    </p>

    <Prose paras={ENGINEERING_PARTS} />
    <Prose paras={ENGINEERING_REST} />
  </>
);

/* ---------- page content: groups, each holding its sections ---------- */
/*
 * Same model as Ideation: a group is a sub-heading on the page and in the
 * navigator, and each section inside it becomes one band and one link.
 * Education is one group for now; add another entry to GROUPS to split it.
 */

type Band = "mist" | "dark" | "paper" | "teal";

interface Section {
  id: string;
  title: string;
  /** Short label for the navigator; the heading on the page keeps the full title. */
  nav?: string;
  /** Short marker shown above the title. */
  kicker?: string;
  band: Band;
  /** Running text, shown beside `figure` on wide screens. */
  text?: ReactNode;
  figure?: ReactNode;
  /** Full-width content under the text and figure. */
  after?: ReactNode;
  layout?: "split" | "funnel";
}

interface Cycle {
  id: string;
  title: string;
  lead?: string;
  /** Background used while the group has no sections yet. */
  band?: Band;
  sections: Section[];
}

const CYCLES: Cycle[] = [
  {
    id: "basics",
    title: "Education",
    sections: [
      { id: "igem", title: "What is iGEM?", nav: "What is iGEM?", band: "mist", text: <Prose paras={IGEM} /> },
      { id: "malaria", title: "Malaria", nav: "Malaria", band: "dark", text: <Prose paras={MALARIA} /> },
      {
        id: "life-cycle", title: "What is Malaria? Part 2: How It Spreads: The Life Cycle", nav: "How It Spreads",
        band: "paper", text: <Prose paras={LIFE_CYCLE} />,
      },
      {
        id: "still-killing", title: "Why Is Malaria Still Killing Millions in 2026", nav: "Still killing millions",
        band: "teal", text: STILL_KILLING,
      },
      {
        id: "one-health", title: "Why is mosquito control a human, animal and ecosystem problem?", nav: "A One Health problem",
        band: "mist", text: <Prose paras={ONE_HEALTH} />,
      },
      { id: "synbio", title: "What is Synthetic Biology?", nav: "What is Synthetic Biology?", band: "dark", text: <Prose paras={SYNBIO} /> },
      { id: "engineering", title: "How We Engineer Bacteria", nav: "How We Engineer Bacteria", band: "paper", text: ENGINEERING },
      {
        id: "biosafety", title: "Biosafety Levels in Synthetic Biology Research", nav: "Biosafety Levels",
        band: "teal", text: <Prose paras={BIOSAFETY} />,
      },
      {
        id: "sugar-trap", title: "What is a sugar trap and how does it work?", nav: "The sugar trap",
        band: "mist", text: <Prose paras={SUGAR_TRAP} />,
      },
    ],
  },
];

/** Anchors the navigator tracks, in page order: each section, or the group itself while it is empty. */
const ANCHORS = CYCLES.flatMap((c) => (c.sections.length ? c.sections.map((s) => s.id) : [c.id]));
/** Section numbers shown in the navigator and on the phone rail. */
const SECTION_NO = new Map(CYCLES.flatMap((c) => c.sections).map((s, i) => [s.id, i + 1]));

/** A group whose sections have not been written yet: just its heading on a band. */
function EmptyCycle({ cycle, z }: { cycle: Cycle; z: number }) {
  return (
    <section id={cycle.id} className={`edu-band edu-band--${cycle.band ?? "mist"} edu-band--cycle-only${z === 0 ? " edu-band--first" : ""}`}
      style={{ zIndex: z + 1 }}>
      <div className="edu-inner">
        <header className="edu-cycle-head" data-reveal>
          <h2>{cycle.title}</h2>
          {cycle.lead && <p className="edu-cycle-lead">{cycle.lead}</p>}
        </header>
      </div>
    </section>
  );
}

function SectionBand({ sec, z }: { sec: Section; z: number }) {
  const head = (
    <div className={sec.layout === "funnel" ? "edu-funnel-text" : undefined} data-reveal>
      {sec.kicker && <p className="edu-kicker">{sec.kicker}</p>}
      <h3>{sec.title}</h3>
      {sec.text}
    </div>
  );
  const split = sec.figure ? `edu-inner edu-split${sec.layout === "funnel" ? " edu-split--funnel" : ""}` : "edu-inner";
  return (
    <section id={sec.id} className={`edu-band edu-band--${sec.band}${z === 0 ? " edu-band--first" : ""}`}
      style={{ zIndex: z + 1 }}>
      <div className={split}>
        {head}
        {sec.figure}
      </div>
      {sec.after && <div className="edu-inner">{sec.after}</div>}
    </section>
  );
}

export function Education() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  // Hide below-the-fold content before first paint so it can animate in.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (root && !reducedMotion() && "IntersectionObserver" in window) root.classList.add("edu-motion");
  }, []);

  // Reveal on scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!root.classList.contains("edu-motion")) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Navigator: highlight the section being read and fill the bar with overall progress.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const atEnd = window.scrollY >= max - 4;
      let idx = 0;
      ANCHORS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      if (atEnd) idx = ANCHORS.length - 1;
      bar.style.transform = `scaleY(${max > 0 ? clamp01(window.scrollY / max) : 0})`;
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const activeId = ANCHORS[active];
  let z = 0;

  return (
    <div className="edu-page" ref={rootRef}>
      <header className="edu-hero">
        <LowPoly className="edu-hero-canvas" colors={HERO_COLORS} cell={120} drift={6} glow seed={5} />
        <div className="edu-hero-text title-art-row title-art-row--left">
          <TitleArt name="grad-cap" />
          <h1 className="edu-title">Education</h1>
        </div>
        <svg className="edu-wave" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C240 70 420 110 560 190 C690 262 820 268 960 244 C1110 218 1250 190 1440 238 V260 H0 Z" />
        </svg>
      </header>

      <div className="edu-body">
        <aside className="edu-side" aria-label="Sections on this page">
          <LowPoly className="edu-side-canvas" colors={HERO_COLORS} cell={110} drift={5} seed={13} />
          <nav className="edu-toc">
            <div className="edu-toc-list">
              {CYCLES.map((c) => (
                <div key={c.id} className="edu-toc-group">
                  <ol>
                    {c.sections.map((st) => (
                      <li key={st.id}>
                        <a href={`#${st.id}`} onClick={go(st.id)} className={st.id === activeId ? "is-on" : undefined}
                          aria-current={st.id === activeId ? "true" : undefined}>
                          <b aria-hidden="true">{SECTION_NO.get(st.id)}</b><span>{st.nav ?? st.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className="edu-toc-bar" aria-hidden="true"><span ref={barRef} /></div>
          </nav>
        </aside>

        <main className="edu-main">
          {CYCLES.map((c) => c.sections.length
            ? c.sections.map((sec) => <SectionBand key={sec.id} sec={sec} z={z++} />)
            : <EmptyCycle key={c.id} cycle={c} z={z++} />)}
        </main>
      </div>
    </div>
  );
}
