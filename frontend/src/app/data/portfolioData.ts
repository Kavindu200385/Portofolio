import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";
import {
  mapAboutFromApi,
  mapContactFromApi,
  mapEducationFromApi,
  mapExperienceFromApi,
  mapHeroFromApi,
  mapProjectFromApi,
  mapSkillFromApi,
} from "../lib/portfolioMappers";

export type ProjectType = "Group" | "Individual" | "Research";
export type SkillCategory = "Frontend" | "Backend" | "DevOps" | "Tools";
export type Proficiency = "Beginner" | "Intermediate" | "Advanced";

export type ProjectItem = {
  id: string;
  name: string;
  type: ProjectType;
  shortDescription: string;
  longDescription: string;
  thumbnail: string;
  extraImages?: string[];
  githubLink: string;
  liveDemoLink: string;
  techStack: string[];
  featured: boolean;
};

export type SkillItem = {
  id: string;
  name: string;
  icon: string;
  category: SkillCategory;
  shortDescription: string;
  proficiency: Proficiency;
  color: string;
  size: "normal" | "wide";
};

export type ExperienceItem = {
  id: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate: string;
  present: boolean;
  description: string;
  logo: string;
  side: "left" | "right";
};

export type EducationItem = {
  id: string;
  institutionName: string;
  degree: string;
  startDate: string;
  endDate: string;
  present: boolean;
  description: string;
  logo: string;
  side: "left" | "right";
};

export type AboutBadge = { id: string; emoji: string; label: string };
export type AboutData = {
  paragraphs: string[];
  badges: AboutBadge[];
  profilePhoto: string;
};

export type HeroData = {
  heading: string;
  subHeading: string;
  cta1Label: string;
  cta1Link: string;
  cta2Label: string;
  cta2Link: string;
  heroPhoto: string;
};

export type ContactData = {
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  phone: string;
  heading: string;
  description: string;
};

export type PortfolioData = {
  projects: ProjectItem[];
  skills: SkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  about: AboutData;
  hero: HeroData;
  contact: ContactData;
  changesLog: string[];
};

const TOKEN_KEY = "admin_auth_token_v1";
export const TOAST_EVENT = "portfolio-admin-toast";

const ADMIN_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const defaultPortfolioData: PortfolioData = {
  projects: [
    {
      id: "p1",
      name: "FindWORK WebApp",
      type: "Group",
      shortDescription:
        "A full-stack job discovery platform connecting job seekers with employers.",
      longDescription:
        "A full-stack job discovery platform connecting job seekers with employers. Features real-time filtering, user authentication, and a responsive dashboard for managing applications.",
      thumbnail:
        "https://images.unsplash.com/photo-1767449356630-c60094b1d1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      githubLink: "#",
      liveDemoLink: "#",
      techStack: ["React", "Node.js", "MongoDB", "Tailwind"],
      extraImages: [],
      featured: true,
    },
    {
      id: "p2",
      name: "KaviCode Portfolio",
      type: "Individual",
      shortDescription: "A modern developer portfolio with cinematic transitions.",
      longDescription:
        "A modern developer portfolio built with Next.js 14 App Router, Framer Motion, and Tailwind CSS. Showcases projects, skills, and experience with cinematic transitions.",
      thumbnail:
        "https://images.unsplash.com/photo-1720962158883-b0f2021fb51e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      githubLink: "#",
      liveDemoLink: "#",
      techStack: ["Next.js", "TypeScript", "Framer Motion"],
      extraImages: [],
      featured: true,
    },
  ],
  skills: [
    {
      id: "s-github",
      name: "GitHub",
      icon: "",
      category: "Tools",
      shortDescription: "Version control, collaboration, and code review on GitHub",
      proficiency: "Advanced",
      color: "#ffffff",
      size: "wide",
    },
    {
      id: "s-gha",
      name: "GitHub Actions",
      icon: "",
      category: "DevOps",
      shortDescription: "CI/CD pipelines and automated workflows",
      proficiency: "Advanced",
      color: "#2088FF",
      size: "normal",
    },
    {
      id: "s-cpanel",
      name: "cPanel",
      icon: "",
      category: "Tools",
      shortDescription: "Web hosting, domains, and server management",
      proficiency: "Intermediate",
      color: "#FF6C2C",
      size: "normal",
    },
    {
      id: "s-mysql",
      name: "MySQL",
      icon: "",
      category: "Backend",
      shortDescription: "Relational databases and SQL-backed applications",
      proficiency: "Advanced",
      color: "#4479A1",
      size: "wide",
    },
    {
      id: "s-tailwind",
      name: "Tailwind CSS",
      icon: "",
      category: "Frontend",
      shortDescription: "Utility-first styling and responsive layouts",
      proficiency: "Advanced",
      color: "#38BDF8",
      size: "normal",
    },
    {
      id: "s-react",
      name: "React",
      icon: "",
      category: "Frontend",
      shortDescription: "Component-based UI development",
      proficiency: "Advanced",
      color: "#61DAFB",
      size: "wide",
    },
    {
      id: "s-nest",
      name: "NestJS",
      icon: "",
      category: "Backend",
      shortDescription: "Structured Node APIs with TypeScript and decorators",
      proficiency: "Advanced",
      color: "#E0234E",
      size: "normal",
    },
    {
      id: "s-node",
      name: "Node.js",
      icon: "",
      category: "Backend",
      shortDescription: "Server-side JavaScript and runtime tooling",
      proficiency: "Advanced",
      color: "#68A063",
      size: "normal",
    },
    {
      id: "s-figma",
      name: "Figma",
      icon: "",
      category: "Tools",
      shortDescription: "UI/UX design, prototypes, and design handoff",
      proficiency: "Intermediate",
      color: "#F24E1E",
      size: "wide",
    },
    {
      id: "s-cursor",
      name: "Cursor",
      icon: "",
      category: "Tools",
      shortDescription: "AI-assisted development in the editor",
      proficiency: "Advanced",
      color: "#A8B4FF",
      size: "normal",
    },
    {
      id: "s-html",
      name: "HTML",
      icon: "",
      category: "Frontend",
      shortDescription: "Semantic markup and accessible page structure",
      proficiency: "Advanced",
      color: "#E34F26",
      size: "normal",
    },
    {
      id: "s-css",
      name: "CSS",
      icon: "",
      category: "Frontend",
      shortDescription: "Layouts, responsive design, and modern styling",
      proficiency: "Advanced",
      color: "#1572B6",
      size: "normal",
    },
    {
      id: "s-js",
      name: "JavaScript",
      icon: "",
      category: "Frontend",
      shortDescription: "Core language for web apps and Node tooling",
      proficiency: "Advanced",
      color: "#F7DF1E",
      size: "wide",
    },
    {
      id: "s-docker",
      name: "Docker",
      icon: "",
      category: "DevOps",
      shortDescription: "Container images and repeatable deployments",
      proficiency: "Advanced",
      color: "#2496ED",
      size: "normal",
    },
    {
      id: "s-python",
      name: "Python",
      icon: "",
      category: "Backend",
      shortDescription: "Scripting, APIs, and data-focused tooling",
      proficiency: "Intermediate",
      color: "#3776AB",
      size: "wide",
    },
  ],
  experiences: [
    {
      id: "e1",
      companyName: "Toyota Lanka",
      role: "Software Engineering Intern",
      startDate: "October 2025",
      endDate: "",
      present: true,
      description:
        "Working as a Software Engineering Intern contributing to full stack development and DevOps practices. Building and maintaining real-world applications, containerizing services, and supporting CI/CD pipeline workflows in a professional engineering environment.",
      logo: "💼",
      side: "left",
    },
    {
      id: "e2",
      companyName: "Toyota Lanka — VCMS (AutoStream)",
      role: "Sales Intern",
      startDate: "June 2025",
      endDate: "October 2025",
      present: false,
      description:
        "Acted as the key connection between car dealerships and individual car sale owners, onboarding them onto the AutoStream platform. Managed the end-to-end process of collecting vehicle details and publishing listings on AutoStream. Built and maintained relationships with clients to ensure smooth ad uploads and platform engagement.",
      logo: "🤝",
      side: "right",
    },
    {
      id: "e3",
      companyName: "Cargills Food City - Hanwella",
      role: "Part-Time Worker",
      startDate: "August 2024",
      endDate: "December 2024",
      present: false,
      description:
        "Assisted customers with purchases and inquiries, maintained store organization, and supported inventory tasks. Worked with team members to meet sales goals and ensure efficient daily operations in a fast-paced retail environment.",
      logo: "🛒",
      side: "left",
    },
  ],
  education: [
    {
      id: "ed1",
      institutionName: "University of Plymouth via NSBM Green University, Sri Lanka",
      degree: "BSc (Hons) Computer Science",
      startDate: "October 2023",
      endDate: "",
      present: true,
      description:
        "Final year student under the transnational education partnership with the University of Plymouth, UK. Coursework and assessments are conducted at NSBM Green University, aligned with UK academic standards.",
      logo: "🎓",
      side: "left",
    },
  ],
  about: {
    paragraphs: [
      "I'm Kavindu Sandaruwan, a final-year Computer Science student at the University of Plymouth via NSBM Green University, Sri Lanka — and a Software Engineering Intern at Toyota Lanka.",
      "My passion lives at the intersection of Full Stack development and DevOps engineering. Day to day, I'm building and shipping real-world applications, containerizing services, and designing reliable CI/CD pipelines in a professional environment.",
      "I'm continuously sharpening my skills across the full stack — from crafting clean, responsive frontends to architecting scalable backends and cloud-native infrastructure. Every project is a step toward building systems that are fast, resilient, and built to last.",
    ],
    badges: [
      { id: "b1", emoji: "🔍", label: "Research" },
      { id: "b2", emoji: "🤖", label: "AI" },
      { id: "b3", emoji: "☁️", label: "Cloud" },
      { id: "b4", emoji: "🧩", label: "Full Stack" },
    ],
    profilePhoto: "/profile.png",
  },
  hero: {
    heading: "Aspiring Cloud &\nDevOps Engineer",
    subHeading: "Based in Sri Lanka. Building scalable, intelligent systems for the cloud.",
    cta1Label: "View Works",
    cta1Link: "#works",
    cta2Label: "Download CV",
    cta2Link: "/cv.pdf",
    heroPhoto: "/profile.png",
  },
  contact: {
    email: "kavindu2003sandaruwan@gmail.com",
    whatsapp: "https://wa.me/94742256408",
    linkedin: "https://www.linkedin.com/in/kavindu-sandaruwan-54354128a/",
    github: "https://github.com/Kavindu200385",
    phone: "+94 74 225 6408",
    heading: "Get In Touch",
    description:
      "I'm actively looking for opportunities in Cloud infrastructure and DevOps engineering. Whether it's a full-time role, internship, or an interesting project — I'd love to connect.",
  },
  changesLog: [],
};

const emptyAbout: AboutData = {
  paragraphs: ["", "", ""],
  badges: [],
  profilePhoto: "",
};

const emptyHero: HeroData = {
  heading: "",
  subHeading: "",
  cta1Label: "",
  cta1Link: "",
  cta2Label: "",
  cta2Link: "",
  heroPhoto: "",
};

const emptyContact: ContactData = {
  email: "",
  whatsapp: "",
  linkedin: "",
  github: "",
  phone: "",
  heading: "",
  description: "",
};

export function pushAdminToast(type: "success" | "error", message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { type, message } }));
}

async function fetchJsonLoose(path: string): Promise<unknown> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildPortfolioData(
  rawProjects: unknown,
  rawSkills: unknown,
  rawExp: unknown,
  rawEdu: unknown,
  rawAbout: unknown,
  rawHero: unknown,
  rawContact: unknown,
  admin: boolean,
): PortfolioData {

  const projects: ProjectItem[] = (() => {
    if (rawProjects == null) {
      return admin ? [] : defaultPortfolioData.projects;
    }
    const arr = rawProjects;
    if (!Array.isArray(arr) || arr.length === 0) {
      return admin ? [] : defaultPortfolioData.projects;
    }
    return arr.map((d) => mapProjectFromApi(d as Record<string, unknown>));
  })();

  const skills: SkillItem[] = (() => {
    if (rawSkills == null) {
      return admin ? [] : defaultPortfolioData.skills;
    }
    const arr = rawSkills;
    if (!Array.isArray(arr) || arr.length === 0) {
      return admin ? [] : defaultPortfolioData.skills;
    }
    return arr.map((d) => mapSkillFromApi(d as Record<string, unknown>));
  })();

  const experiences: ExperienceItem[] = (() => {
    if (rawExp == null) {
      return admin ? [] : defaultPortfolioData.experiences;
    }
    const arr = rawExp;
    if (!Array.isArray(arr) || arr.length === 0) {
      return admin ? [] : defaultPortfolioData.experiences;
    }
    return arr.map((d, i) => mapExperienceFromApi(d as Record<string, unknown>, i));
  })();

  const education: EducationItem[] = (() => {
    if (rawEdu == null) {
      return admin ? [] : defaultPortfolioData.education;
    }
    const arr = rawEdu;
    if (!Array.isArray(arr) || arr.length === 0) {
      return admin ? [] : defaultPortfolioData.education;
    }
    return arr.map((d, i) => mapEducationFromApi(d as Record<string, unknown>, i));
  })();

  const about: AboutData = (() => {
    if (rawAbout == null) {
      return admin ? emptyAbout : defaultPortfolioData.about;
    }
    const doc = rawAbout as Record<string, unknown> | null;
    if (!doc) {
      return admin ? emptyAbout : defaultPortfolioData.about;
    }
    const m = mapAboutFromApi(doc);
    if (!m) {
      return admin ? emptyAbout : defaultPortfolioData.about;
    }
    if (!admin && !m.paragraphs.some((p) => p.trim())) {
      return defaultPortfolioData.about;
    }
    return m;
  })();

  const hero: HeroData = (() => {
    if (rawHero == null) {
      return admin ? emptyHero : defaultPortfolioData.hero;
    }
    const doc = rawHero as Record<string, unknown> | null;
    if (!doc) {
      return admin ? emptyHero : defaultPortfolioData.hero;
    }
    const m = mapHeroFromApi(doc);
    if (!m) {
      return admin ? emptyHero : defaultPortfolioData.hero;
    }
    if (!admin && !m.heading.trim() && !m.subHeading.trim()) {
      return defaultPortfolioData.hero;
    }
    return m;
  })();

  const contact: ContactData = (() => {
    if (rawContact == null) {
      return admin ? emptyContact : defaultPortfolioData.contact;
    }
    const doc = rawContact as Record<string, unknown> | null;
    if (!doc) {
      return admin ? emptyContact : defaultPortfolioData.contact;
    }
    const m = mapContactFromApi(doc);
    if (!m) {
      return admin ? emptyContact : defaultPortfolioData.contact;
    }
    if (!admin && !m.email.trim() && !m.heading.trim()) {
      return defaultPortfolioData.contact;
    }
    return m;
  })();

  return {
    projects,
    skills,
    experiences,
    education,
    about,
    hero,
    contact,
    changesLog: [],
  };
}

/**
 * Loads all sections in parallel. Uses resilient fetches (never throws per endpoint).
 * `admin` controls empty-vs-default behavior in buildPortfolioData, not fetch strictness.
 */
export async function loadPortfolioFromApi(admin: boolean): Promise<PortfolioData> {
  const [rawProjects, rawSkills, rawExp, rawEdu, rawAbout, rawHero, rawContact] = await Promise.all([
    fetchJsonLoose("/api/projects"),
    fetchJsonLoose("/api/skills"),
    fetchJsonLoose("/api/experience"),
    fetchJsonLoose("/api/education"),
    fetchJsonLoose("/api/about"),
    fetchJsonLoose("/api/hero"),
    fetchJsonLoose("/api/contact"),
  ]);
  return buildPortfolioData(rawProjects, rawSkills, rawExp, rawEdu, rawAbout, rawHero, rawContact, admin);
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { value?: string; issuedAt?: number } | null;
    if (parsed && typeof parsed.issuedAt === "number" && parsed.value) {
      const age = Date.now() - parsed.issuedAt;
      if (age > ADMIN_TOKEN_MAX_AGE_MS) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return parsed.value;
    }
  } catch {
    // legacy plain-string token, fall through
  }
  return raw;
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  const wrapped = { value: token, issuedAt: Date.now() };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(wrapped));
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export type UsePortfolioOptions = {
  /** @deprecated Route (/admin/*) determines admin vs public; option is ignored. */
  admin?: boolean;
};

type PortfolioContextValue = {
  data: PortfolioData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const PortfolioDataContext = createContext<PortfolioContextValue | null>(null);

/** Single source of portfolio API state for the whole app (avoids duplicate fetches and empty sections). */
export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  /** Login page should not use strict “admin empty” mode or require API; same as public for initial load. */
  const isLoginRoute =
    pathname === "/admin/login" || pathname.endsWith("/admin/login");
  /** True for /admin/* except login — drives empty lists vs defaults in buildPortfolioData. */
  const portfolioAdminMode = pathname.startsWith("/admin") && !isLoginRoute;

  const [data, setData] = useState<PortfolioData>(() => ({
    ...defaultPortfolioData,
    changesLog: [],
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await loadPortfolioFromApi(portfolioAdminMode);
      setData(next);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load portfolio data";
      setError(msg);
      if (!portfolioAdminMode) {
        setData({ ...defaultPortfolioData, changesLog: [] });
      }
    } finally {
      setLoading(false);
    }
  }, [portfolioAdminMode]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({ data, loading, error, refetch }),
    [data, loading, error, refetch],
  );

  return createElement(PortfolioDataContext.Provider, { value }, children);
}

export function usePortfolioData(_opts?: UsePortfolioOptions) {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error("usePortfolioData must be used within PortfolioDataProvider");
  }
  return useMemo(
    () => ({
      loading: ctx.loading,
      error: ctx.error,
      data: ctx.data,
      refetch: ctx.refetch,
      pushAdminToast,
    }),
    [ctx.data, ctx.loading, ctx.error, ctx.refetch],
  );
}
