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
import { defaultPortfolioContent } from "../../../lib/defaultPortfolioContent";
import {
  mapAboutFromApi,
  mapContactFromApi,
  mapEducationFromApi,
  mapExperienceFromApi,
  mapHeroFromApi,
  mapProjectFromApi,
  mapSkillFromApi,
} from "../lib/portfolioMappers";
import { apiUrl } from "../lib/apiBase";

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
  ...(defaultPortfolioContent as unknown as Omit<PortfolioData, "changesLog">),
  changesLog: [],
};

export function pushAdminToast(type: "success" | "error", message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { type, message } }));
}

async function fetchJsonLoose(path: string): Promise<unknown> {
  try {
    const res = await fetch(apiUrl(path));
    if (!res.ok) return null;
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Merges API payloads with built-in defaults. Public site and admin use the same fallbacks when
 * the database is empty so the CMS always shows the same content visitors see.
 */
function buildPortfolioData(
  rawProjects: unknown,
  rawSkills: unknown,
  rawExp: unknown,
  rawEdu: unknown,
  rawAbout: unknown,
  rawHero: unknown,
  rawContact: unknown,
): PortfolioData {

  const projects: ProjectItem[] = (() => {
    if (rawProjects == null) {
      return defaultPortfolioData.projects;
    }
    const arr = rawProjects;
    if (!Array.isArray(arr) || arr.length === 0) {
      return defaultPortfolioData.projects;
    }
    return arr.map((d) => mapProjectFromApi(d as Record<string, unknown>));
  })();

  const skills: SkillItem[] = (() => {
    if (rawSkills == null) {
      return defaultPortfolioData.skills;
    }
    const arr = rawSkills;
    if (!Array.isArray(arr) || arr.length === 0) {
      return defaultPortfolioData.skills;
    }
    return arr.map((d) => mapSkillFromApi(d as Record<string, unknown>));
  })();

  const experiences: ExperienceItem[] = (() => {
    if (rawExp == null) {
      return defaultPortfolioData.experiences;
    }
    const arr = rawExp;
    if (!Array.isArray(arr) || arr.length === 0) {
      return defaultPortfolioData.experiences;
    }
    return arr.map((d, i) => mapExperienceFromApi(d as Record<string, unknown>, i));
  })();

  const education: EducationItem[] = (() => {
    if (rawEdu == null) {
      return defaultPortfolioData.education;
    }
    const arr = rawEdu;
    if (!Array.isArray(arr) || arr.length === 0) {
      return defaultPortfolioData.education;
    }
    return arr.map((d, i) => mapEducationFromApi(d as Record<string, unknown>, i));
  })();

  const about: AboutData = (() => {
    if (rawAbout == null) {
      return defaultPortfolioData.about;
    }
    const doc = rawAbout as Record<string, unknown> | null;
    if (!doc) {
      return defaultPortfolioData.about;
    }
    const m = mapAboutFromApi(doc);
    if (!m) {
      return defaultPortfolioData.about;
    }
    if (!m.paragraphs.some((p) => p.trim())) {
      return defaultPortfolioData.about;
    }
    return m;
  })();

  const hero: HeroData = (() => {
    if (rawHero == null) {
      return defaultPortfolioData.hero;
    }
    const doc = rawHero as Record<string, unknown> | null;
    if (!doc) {
      return defaultPortfolioData.hero;
    }
    const m = mapHeroFromApi(doc);
    if (!m) {
      return defaultPortfolioData.hero;
    }
    if (!m.heading.trim() && !m.subHeading.trim()) {
      return defaultPortfolioData.hero;
    }
    return m;
  })();

  const contact: ContactData = (() => {
    if (rawContact == null) {
      return defaultPortfolioData.contact;
    }
    const doc = rawContact as Record<string, unknown> | null;
    if (!doc) {
      return defaultPortfolioData.contact;
    }
    const m = mapContactFromApi(doc);
    if (!m) {
      return defaultPortfolioData.contact;
    }
    if (!m.email.trim() && !m.heading.trim()) {
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
 */
export async function loadPortfolioFromApi(): Promise<PortfolioData> {
  const [rawProjects, rawSkills, rawExp, rawEdu, rawAbout, rawHero, rawContact] = await Promise.all([
    fetchJsonLoose("/api/projects"),
    fetchJsonLoose("/api/skills"),
    fetchJsonLoose("/api/experience"),
    fetchJsonLoose("/api/education"),
    fetchJsonLoose("/api/about"),
    fetchJsonLoose("/api/hero"),
    fetchJsonLoose("/api/contact"),
  ]);
  return buildPortfolioData(rawProjects, rawSkills, rawExp, rawEdu, rawAbout, rawHero, rawContact);
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
      const next = await loadPortfolioFromApi();
      setData(next);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load portfolio data";
      setError(msg);
      setData({ ...defaultPortfolioData, changesLog: [] });
    } finally {
      setLoading(false);
    }
  }, []);

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
