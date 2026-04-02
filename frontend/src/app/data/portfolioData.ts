import { useEffect, useMemo, useState } from "react";

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

const STORAGE_KEY = "portfolio_data_v1";
const TOKEN_KEY = "admin_auth_token_v1";
const DATA_EVENT = "portfolio-data-updated";
export const TOAST_EVENT = "portfolio-admin-toast";

const nowStamp = () => new Date().toLocaleString();

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
    email: "kavindu@kavicode.dev",
    whatsapp: "https://wa.me/94742256408",
    linkedin: "https://linkedin.com/in/kavindu-sandaruwan",
    github: "https://github.com/kavisandaruwan",
    phone: "+94 74 225 6408",
    heading: "Get In Touch",
    description:
      "I'm actively looking for opportunities in Cloud infrastructure and DevOps engineering. Whether it's a full-time role, internship, or an interesting project — I'd love to connect.",
  },
  changesLog: [],
};

function readData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPortfolioData;
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      ...defaultPortfolioData,
      ...parsed,
      about: { ...defaultPortfolioData.about, ...parsed.about },
      hero: { ...defaultPortfolioData.hero, ...parsed.hero },
      contact: { ...defaultPortfolioData.contact, ...parsed.contact },
      projects: parsed.projects?.length ? parsed.projects : defaultPortfolioData.projects,
      skills: parsed.skills?.length ? parsed.skills : defaultPortfolioData.skills,
      experiences: parsed.experiences?.length ? parsed.experiences : defaultPortfolioData.experiences,
      education: parsed.education?.length ? parsed.education : defaultPortfolioData.education,
      changesLog: parsed.changesLog ?? [],
    };
  } catch {
    return defaultPortfolioData;
  }
}

function writeData(data: PortfolioData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(DATA_EVENT));
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(() => readData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(readData());
    setLoading(false);
    const onStorage = () => setData(readData());
    window.addEventListener("storage", onStorage);
    window.addEventListener(DATA_EVENT, onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(DATA_EVENT, onStorage);
    };
  }, []);

  const api = useMemo(() => {
    const save = (next: PortfolioData, logMessage?: string) => {
      const withLog =
        logMessage && logMessage.trim()
          ? { ...next, changesLog: [`${nowStamp()} — ${logMessage}`, ...next.changesLog].slice(0, 50) }
          : next;
      setData(withLog);
      writeData(withLog);
      if (logMessage) {
        window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { type: "success", message: logMessage } }));
      }
    };

    return {
      loading,
      data,
      save,
      resetSection: (section: keyof PortfolioData) => {
        const next = { ...data, [section]: defaultPortfolioData[section] } as PortfolioData;
        save(next, `Reset ${section} to default`);
      },
    };
  }, [data, loading]);

  return api;
}

