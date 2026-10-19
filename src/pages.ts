import type { ComponentType } from "react";

import type { NavIconName } from "./components/NavIcons";

import { Home } from "./contents/home";
import { Description } from "./contents/description";
import { Design } from "./contents/design";
import { Engineering } from "./contents/engineering";
import { Experiments } from "./contents/experiments";
import { Results } from "./contents/results";
import { Model } from "./contents/model";
import { Parts } from "./contents/parts";
import { Safety } from "./contents/safety";
import { Ideation } from "./contents/ideation";
import { HumanPractices } from "./contents/human-practices";
import { Education } from "./contents/education";
import { Communication } from "./contents/communication";
import { Sustainability } from "./contents/sustainability";
import { Team } from "./contents/team";
import { Attributions } from "./contents/attributions";
import { Notebook } from "./contents/notebook";
import { Gallery } from "./contents/gallery";

/*
 * The navbar's hover sections. Pages that belong to none of them (Design,
 * Engineering, Parts, Communication, Attributions) are marked `unlisted`: still
 * routed and reachable by address, but not in the navbar until Aadya says which
 * section they belong to.
 */
export const GROUP_ORDER = ["Project", "Lab", "Human Practices"] as const;
export type NavGroup = (typeof GROUP_ORDER)[number];

/** A wiki page, as the navbar, the router and the footer sitemap all see it. */
export interface Page {
  /** Label in the navbar. */
  name: string;
  /** <title> and the browser history entry. */
  title: string;
  /** Route, relative to the wiki's base path. */
  path: string;
  component: ComponentType;
  /** Navbar group. Pages with no group sit on their own at the end. */
  group?: NavGroup;
  /** Routed and reachable by address, but absent from the navbar and footer. */
  unlisted?: boolean;
  /** Icon in the group's hover panel. */
  icon?: NavIconName;
  /** The coloured line under the name in the hover panel. */
  tagline?: string;
  /** One line for the footer sitemap and for link previews. */
  lead?: string;
}

/*
 * Order matters: this is the order of the navbar, the footer sitemap and the
 * "previous / next page" links at the foot of each page.
 *
 * Every page draws its own hero, so Layout prints no page header above the content.
 */
export const PAGES: Page[] = [
  {
    name: "Home", title: "MOSKATEER", path: "/", component: Home,
    lead: "Malaria, and a bacterium engineered to switch off the mosquito's fertility.",
  },

  // ---- Project ----
  {
    name: "Description", title: "Description", path: "/description", component: Description,
    group: "Project", icon: "flask", tagline: "The problem, our idea, how it works",
    lead: "The problem we picked, the whole MOSKATEER chain, and the biology that makes it work.",
  },
  {
    name: "Ideation", title: "Ideation", path: "/ideation", component: Ideation,
    group: "Project", icon: "tools", tagline: "Design, Build, Test, Learn",
    lead: "How a room full of ideas became one project.",
  },

  // ---- Lab ----
  {
    name: "Experiments", title: "Experiments", path: "/experiments", component: Experiments,
    group: "Lab", icon: "tubes", tagline: "Every protocol, as run",
    lead: "Protocols, as run: immobilisation, transformation, stocks, pulldown and OMV uptake.",
  },
  {
    name: "Results", title: "Results", path: "/results", component: Results,
    group: "Lab", icon: "chart", tagline: "What the data showed",
    lead: "What each experiment told us, and what it changed.",
  },
  {
    name: "Notebook", title: "Notebook", path: "/notebook", component: Notebook,
    group: "Lab", icon: "notebook", tagline: "The record, week by week",
    lead: "What we did, in the order we did it.",
  },
  {
    name: "Modelling", title: "Modelling", path: "/model", component: Model,
    group: "Lab", icon: "nodes", tagline: "Answers before reagents",
    lead: "Structure prediction, flux balance analysis and trap coverage modelling.",
  },
  {
    name: "Biosafety", title: "Biosafety", path: "/safety", component: Safety,
    group: "Lab", icon: "shield", tagline: "How we contain it",
    lead: "Biological risk, waste handling, biosafety levels and the Indian regulatory route.",
  },

  // ---- Human Practices ----
  {
    name: "Integrated Human Practices", title: "Integrated Human Practices",
    path: "/human-practices", component: HumanPractices,
    group: "Human Practices", icon: "people", tagline: "Who we asked, and what changed",
    lead: "Clinicians, an institute visit and the experts who changed the design.",
  },
  {
    name: "Education", title: "Education", path: "/education", component: Education,
    group: "Human Practices", icon: "cap", tagline: "Malaria, explained from scratch",
    lead: "Our write-ups on malaria, synthetic biology and biosafety.",
  },
  {
    name: "Sustainability", title: "Sustainability", path: "/sustainability", component: Sustainability,
    group: "Human Practices", icon: "leaf", tagline: "SDGs 3, 9, 15 and 17",
    lead: "MOSKATEER against SDGs 3, 9, 15 and 17.",
  },
  {
    name: "Gallery", title: "Gallery", path: "/gallery", component: Gallery,
    group: "Human Practices", icon: "images", tagline: "The year in photographs",
    lead: "Photographs from the lab, the schools and the team's own year.",
  },

  // ---- Team: a plain link, no panel ----
  {
    name: "Team", title: "Team", path: "/team", component: Team,
    lead: "The people behind MOSKATEER.",
  },

  /* ---- Not yet placed ----
     These pages are written and reachable, but Aadya has not said which section
     they belong to yet. They sit under "More" until she does; moving one is a
     change of `group` here and nothing else. */
  {
    name: "Design", title: "Design", path: "/design", component: Design, unlisted: true,
    lead: "The fusion protein, the RNA cargo and the sugar bait station that delivers them.",
  },
  {
    name: "Engineering", title: "Engineering", path: "/engineering", component: Engineering, unlisted: true,
    lead: "Our design-build-test-learn cycles, from HeatShield to MOSKATEER.",
  },
  {
    name: "Parts", title: "Parts", path: "/parts", component: Parts, unlisted: true,
    lead: "pMOSK1 and the primer design behind it.",
  },
  {
    name: "Communication", title: "Communication", path: "/communication", component: Communication, unlisted: true,
    lead: "A nationwide quiz, school outreach, orientations and the videos.",
  },
  {
    name: "Attributions", title: "Attributions", path: "/attributions", component: Attributions, unlisted: true,
    lead: "Who did what, and who helped.",
  },
];

/** PAGES grouped for the navbar, in PAGES order, ungrouped pages first. */
export const NAV_GROUPS = GROUP_ORDER.map((group) => ({
  group,
  pages: PAGES.filter((p) => p.group === group),
}));

export const TOP_LEVEL = PAGES.filter((p) => !p.group && !p.unlisted);

/**
 * The navbar, left to right: Project, Team, Lab, Human Practices. A string is a
 * hover group; a path is a plain link. Reorder here and nowhere else.
 */
export const NAV_ORDER: ({ group: (typeof GROUP_ORDER)[number] } | { path: string })[] = [
  { group: "Project" },
  { path: "/team" },
  { group: "Lab" },
  { group: "Human Practices" },
];

/** The page before and after `path`, for the footer's prev/next links. */
export function neighbours(path: string): { prev?: Page; next?: Page } {
  const i = PAGES.findIndex((p) => p.path === path);
  if (i < 0) return {};
  return { prev: PAGES[i - 1], next: PAGES[i + 1] };
}
