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
      "FindWORK is a full-stack web app built to connect job seekers, employers, freelancers, and contractors in one place. Users can discover roles, filter listings in real time, and manage their profile and applications through a responsive dashboard. The stack pairs a React and Next.js front end with MongoDB on the back end, plus authentication so accounts and data stay protected.",
    thumbnail:
      "/photos/8E5D21E0-D245-44D7-BA50-5F58F9301462.png",
    githubLink: "https://github.com/plymouth-projects/findwork-webapp",
    liveDemoLink: "https://findwork-webapp.vercel.app",
    techStack: ["React", "Next.js", "MongoDB", "Tailwind"],
    extraImages: [],
    featured: true,
  },
  {
    id: "p2",
    name: "KaviCode Portfolio",
    type: "Individual",
    shortDescription:
      "A dark, motion-rich developer portfolio showcasing projects, skills, and experience.",
    longDescription:
      "KaviCode Portfolio is this site — a personal portfolio built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion. It presents work, skills, and contact in a cohesive dark UI with smooth, cinematic transitions instead of static sections. React Router ties the views together, and the project is set up to talk to a backend API when deployed.",
    thumbnail:
      "/photos/image.png",
    githubLink: "https://github.com/Kavindu200385/Portofolio",
    liveDemoLink: "https://kavicode.vercel.app",
    techStack: ["React", "Vite", "TypeScript", "Framer Motion", "Tailwind CSS"],
    extraImages: [],
    featured: false,
  },
  {
    id: "p3",
    name: "Travel Agency Website",
    type: "Group",
    shortDescription:
      "A full-featured travel agency e-commerce system that enables customers to explore destinations, make bookings, and submit inquiries. The platform also allows the agency to efficiently manage bookings via phpMyAdmin and receive customer inquiries through Gmail.",
    longDescription:
      "This project is a complete e-commerce solution designed for a travel agency to streamline its online operations. It allows customers to browse available travel destinations, make bookings easily, and contact the agency for further information or assistance through an integrated contact form. On the administrative side, the system provides a simple yet effective way to manage customer bookings using phpMyAdmin, ensuring all booking data is organized and accessible. Additionally, all customer inquiries submitted through the contact form are automatically sent to the agency via Gmail, enabling quick responses and better customer communication. The system focuses on usability, efficient data handling, and seamless interaction between customers and the agency, making it a practical solution for small to medium-scale travel businesses.",
    thumbnail: "/photos/travel-agency-website.png",
    githubLink: "https://github.com/Kavindu200385/Travel-Agency-Website",
    liveDemoLink: "#",
    techStack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    extraImages: [],
    featured: false,
  },

  {
    id: "p4",
    name: "Vehicle Parts Inventory System",
    type: "Individual",
    shortDescription:
      "A full-stack web app to manage vehicle parts with CRUD, filtering, and real-time stock updates.",
    longDescription:
      "A full-stack inventory app for managing vehicle parts with full CRUD, search and filters by name, type, or status, and real-time stock status so levels stay accurate as data changes. The backend is a RESTful API built with Node.js and Express on top of MySQL, with structured error handling, CORS enabled for the React client, and configuration loaded through dotenv. The front end uses React with Axios for API calls and CSS for a responsive layout that works across devices.",
    thumbnail:
      "/photos/vehicle parts inventory system(1).jpeg",
    githubLink: "https://github.com/Kavindu200385/Vehicle-Parts-Inventory-System",
    liveDemoLink: "#",
    techStack: ["React","Axios","CSS","Node.js","Express","MySQL"],
    extraImages: [],
    featured: false,
  },

  {
    id: "p5",
    name: "TechWave - Modern Laptop E-commerce Platform",
    type: "Group",
    shortDescription:
      "A fully functional, modern laptop e-commerce platform built with React, TypeScript, NestJS, and MySQL.",
    longDescription:
      "TechWave is a full-stack laptop storefront with a dark-themed React 18 and TypeScript front end powered by Vite, Tailwind CSS, Framer Motion, React Router, Zustand, and Axios. Shoppers can browse and filter the catalog, manage a cart and wishlist, authenticate and maintain profiles, place and track orders, leave reviews, check out with integrated payments, and use a real-time AI chatbot for support, while admins operate a full dashboard for products, orders, users, and analytics. The NestJS back end exposes a secure REST API with JWT and Passport.js, TypeORM on MySQL for persistence, class-validator for input validation, and flows for cart, wishlist, orders, categories, and admin operations across the full order lifecycle.",
    thumbnail:
      "/photos/TechWave.jpeg",
    githubLink: "https://github.com/Kavindu200385/TechWave-Modern-Laptop-E-commerce-Platform",
    liveDemoLink: "#",
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "React Router",
      "Zustand",
      "Axios",
      "NestJS",
      "TypeORM",
      "MySQL",
      "JWT",
      "Passport.js",
      "class-validator",
    ],
    extraImages: [],
    featured: true,
  },
];
