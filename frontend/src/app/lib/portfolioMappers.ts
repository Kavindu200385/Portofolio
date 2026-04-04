import type {
  AboutData,
  ContactData,
  EducationItem,
  ExperienceItem,
  HeroData,
  ProjectItem,
  ProjectType,
  SkillItem,
} from "../data/portfolioData";

function joinMonthYear(month?: string, year?: string) {
  return [month, year].filter(Boolean).join(" ").trim();
}

export function mapProjectFromApi(doc: Record<string, unknown>): ProjectItem {
  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    type: (doc.category as ProjectType) ?? "Individual",
    shortDescription: String(doc.shortDescription ?? ""),
    longDescription: String(doc.description ?? ""),
    thumbnail: String(doc.mainPhoto ?? ""),
    extraImages: Array.isArray(doc.additionalPhotos) ? (doc.additionalPhotos as string[]) : [],
    githubLink: String(doc.githubLink ?? ""),
    liveDemoLink: String(doc.liveDemoLink ?? ""),
    techStack: Array.isArray(doc.techStack) ? (doc.techStack as string[]) : [],
    featured: !!doc.featured,
  };
}

export function mapSkillFromApi(doc: Record<string, unknown>): SkillItem {
  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    icon: String(doc.icon ?? ""),
    category: doc.category as SkillItem["category"],
    shortDescription: String(doc.description ?? ""),
    proficiency: doc.proficiency as SkillItem["proficiency"],
    color: String(doc.color ?? "#4F8EF7"),
    size: doc.size === "wide" ? "wide" : "normal",
  };
}

export function mapExperienceFromApi(doc: Record<string, unknown>, index: number): ExperienceItem {
  const startDate = joinMonthYear(
    doc.startMonth as string | undefined,
    doc.startYear as string | undefined,
  );
  const isCurrent = !!doc.isCurrent;
  const endDate = isCurrent
    ? ""
    : joinMonthYear(doc.endMonth as string | undefined, doc.endYear as string | undefined);
  return {
    id: String(doc._id),
    companyName: String(doc.company ?? ""),
    role: String(doc.role ?? ""),
    startDate,
    endDate,
    present: isCurrent,
    description: String(doc.description ?? ""),
    logo: String(doc.companyLogo ?? ""),
    side: index % 2 === 0 ? "left" : "right",
  };
}

export function mapEducationFromApi(doc: Record<string, unknown>, index: number): EducationItem {
  const startDate = joinMonthYear(
    doc.startMonth as string | undefined,
    doc.startYear as string | undefined,
  );
  const isCurrent = !!doc.isCurrent;
  const endDate = isCurrent
    ? ""
    : joinMonthYear(doc.endMonth as string | undefined, doc.endYear as string | undefined);
  return {
    id: String(doc._id),
    institutionName: String(doc.institution ?? ""),
    degree: String(doc.degree ?? ""),
    startDate,
    endDate,
    present: isCurrent,
    description: String(doc.description ?? ""),
    logo: String(doc.institutionLogo ?? ""),
    side: index % 2 === 0 ? "left" : "right",
  };
}

export function mapAboutFromApi(doc: Record<string, unknown> | null | undefined): AboutData | null {
  if (!doc) return null;
  return {
    paragraphs: [
      String(doc.paragraph1 ?? ""),
      String(doc.paragraph2 ?? ""),
      String(doc.paragraph3 ?? ""),
    ],
    badges: Array.isArray(doc.badges)
      ? (doc.badges as AboutData["badges"]).map((b) => ({
          id: String(b.id ?? ""),
          emoji: String(b.emoji ?? ""),
          label: String(b.label ?? ""),
        }))
      : [],
    profilePhoto: String(doc.profilePhoto ?? ""),
  };
}

export function mapHeroFromApi(doc: Record<string, unknown> | null | undefined): HeroData | null {
  if (!doc) return null;
  return {
    heading: String(doc.mainHeading ?? ""),
    subHeading: String(doc.subHeading ?? ""),
    cta1Label: String(doc.cta1Label ?? ""),
    cta1Link: String(doc.cta1Link ?? ""),
    cta2Label: String(doc.cta2Label ?? ""),
    cta2Link: String(doc.cta2Link ?? ""),
    heroPhoto: String(doc.heroPhoto ?? ""),
  };
}

export function mapContactFromApi(doc: Record<string, unknown> | null | undefined): ContactData | null {
  if (!doc) return null;
  return {
    email: String(doc.email ?? ""),
    whatsapp: String(doc.whatsapp ?? ""),
    linkedin: String(doc.linkedin ?? ""),
    github: String(doc.github ?? ""),
    phone: String(doc.phone ?? ""),
    heading: String(doc.sectionHeading ?? ""),
    description: String(doc.sectionDescription ?? ""),
  };
}
