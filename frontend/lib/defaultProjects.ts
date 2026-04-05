import type { ProjectItem } from "../src/app/data/portfolioData";

/**
 * Projects shown when `/api/projects` is empty or unreachable.
 *
 * To add a project: copy an object below, give it a unique `id`, and fill every field.
 * `type` must be one of: "Individual" | "Group" | "Research"
 * `thumbnail` / `extraImages`: use https URLs or site paths like `/my-screenshot.png` in `public/`.
 *
 * Note: If MongoDB returns at least one project, the API list replaces this entire array.
 * To rely only on this file, keep the projects collection empty (or don’t run the API).
 */
export const defaultProjects: ProjectItem[] = [
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
];
